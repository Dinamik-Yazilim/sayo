'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { OrderSummary } from '@/components/order-summary'
import {
  Loader2,
  ShoppingCart,
  Store,
  Package,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  X,
  Filter,
  Building2,
  Plus,
  Minus
} from 'lucide-react'
import { postItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import {
  getDepolarMagazalar,
  getStoklar,
  getStokAnaGruplari,
  getStokAltGruplari,
  getStokKategorileri,
  getStokMarkalari,
  getTedarikcilerModal
} from '@/mikroerp'

interface Depo {
  dep_no: number
  dep_adi: string
  dep_tipi: number
  dep_sor_mer_kodu: string
  dep_proje_kodu: string
}

interface Stok {
  sto_kod: string
  sto_isim: string
  sto_anagrup_kod: string
  ana_grup_isim: string
  sto_altgrup_kod: string
  alt_grup_isim: string
  sto_kategori_kodu: string
  kategori_isim: string
  sto_marka_kodu: string
  marka_isim: string
  sto_sat_cari_kod: string
  satici_unvan: string
  sto_birim1_ad: string
  sto_birim2_ad: string
  sto_birim2_katsayi: number
  sto_birim3_ad: string
  sto_birim3_katsayi: number
  barkod1: string
  barkod2: string
  barkod3: string
  fiyat1: number
  fiyat2: number
}

interface StokAnaGrup {
  san_kod: string
  san_isim: string
}

interface StokAltGrup {
  sta_kod: string
  sta_isim: string
}

interface StokKategori {
  ktg_kod: string
  ktg_isim: string
}

interface StokMarka {
  mrk_kod: string
  mrk_ismi: string
}

interface Tedarikci {
  cari_kod: string
  cari_unvan1: string
  cari_unvan2: string
  urun_sayisi: number
}

interface SiparisKalemi {
  stok: Stok
  miktar: number
  birim: 'birim1' | 'birim2' | 'birim3'
  birimAd: string
  katsayi: number
}

export default function MagazaSiparisiPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const resumeCartId = searchParams.get('cartId')

  const [step, setStep] = useState(1) // 1: Mağaza Seçimi, 2: Ürün Seçimi, 3: Sipariş Onayı
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [currentCartId, setCurrentCartId] = useState<string | null>(resumeCartId)
  const [db, setDb] = useState<string>('')
  const [organizationId, setOrganizationId] = useState<string>('')
  const { toast } = useToast()

  // Step 1: Mağaza Seçimi
  const [magazalar, setMagazalar] = useState<Depo[]>([])
  const [selectedMagaza, setSelectedMagaza] = useState<Depo | null>(null)

  // Step 2: Ürün Seçimi
  const [stoklar, setStoklar] = useState<Stok[]>([])
  const [anaGruplar, setAnaGruplar] = useState<StokAnaGrup[]>([])
  const [altGruplar, setAltGruplar] = useState<StokAltGrup[]>([])
  const [kategoriler, setKategoriler] = useState<StokKategori[]>([])
  const [markalar, setMarkalar] = useState<StokMarka[]>([])
  const [tedarikciler, setTedarikciler] = useState<Tedarikci[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnaGrup, setSelectedAnaGrup] = useState<string>('all')
  const [selectedAltGrup, setSelectedAltGrup] = useState<string>('all')
  const [selectedKategori, setSelectedKategori] = useState<string>('all')
  const [selectedMarka, setSelectedMarka] = useState<string>('all')
  const [selectedTedarikci, setSelectedTedarikci] = useState<string>('all')
  const [showTedarikciModal, setShowTedarikciModal] = useState(false)

  // Sipariş kalemleri
  const [siparisKalemleri, setSiparisKalemleri] = useState<SiparisKalemi[]>([])
  const [sepetVisible, setSepetVisible] = useState(false) // Sepet görünürlüğü

  // Her ürün için miktar state'i - ürün kodu ve birim kombinasyonu
  const [urunMiktarlari, setUrunMiktarlari] = useState<Record<string, number>>({})

  const getUrunMiktarKey = (stoKod: string, birim: string) => `${stoKod}-${birim}`

  const getUrunMiktar = (stoKod: string, birim: string) => {
    return urunMiktarlari[getUrunMiktarKey(stoKod, birim)] || 1
  }

  const setUrunMiktar = (stoKod: string, birim: string, miktar: number) => {
    const key = getUrunMiktarKey(stoKod, birim)
    setUrunMiktarlari(prev => ({
      ...prev,
      [key]: Math.max(1, miktar)
    }))
  }

  const artirUrunMiktar = (stoKod: string, birim: string) => {
    const mevcutMiktar = getUrunMiktar(stoKod, birim)
    setUrunMiktar(stoKod, birim, mevcutMiktar + 1)
  }

  const azaltUrunMiktar = (stoKod: string, birim: string) => {
    const mevcutMiktar = getUrunMiktar(stoKod, birim)
    setUrunMiktar(stoKod, birim, Math.max(1, mevcutMiktar - 1))
  }

  useEffect(() => {
    if (!token) {
      setToken(Cookies.get('token') || '')
    }

    // Load user info for organization and db
    try {
      const userStr = Cookies.get('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.organization) {
          setOrganizationId(user.organization._id || user.organization)
        }
      }
      const dbFromCookie = Cookies.get('db')
      if (dbFromCookie) {
        setDb(dbFromCookie)
      }
    } catch (err) {
      console.error('Error loading user/db:', err)
    }
  }, [])

  // Load cart if resuming an existing order
  useEffect(() => {
    if (token && resumeCartId && organizationId && db) {
      loadCartById(resumeCartId)
    }
  }, [token, resumeCartId, organizationId, db])

  useEffect(() => {
    if (token && step === 1) {
      loadMagazalar()
    }
  }, [token, step])

  useEffect(() => {
    if (token && step === 2) {
      loadFilters()
      loadStoklar()
    }
  }, [token, step])

  // Ana grup değiştiğinde alt grupları yükle
  useEffect(() => {
    if (token && step === 2 && anaGruplar.length > 0) {
      loadAltGruplar(selectedAnaGrup)
      setSelectedAltGrup('all')
    }
  }, [selectedAnaGrup])

  // Filtre değişimlerinde yeniden yükle
  useEffect(() => {
    if (token && step === 2 && anaGruplar.length > 0) {
      loadStoklar()
    }
  }, [selectedAnaGrup, selectedAltGrup, selectedKategori, selectedMarka, selectedTedarikci])

  // Auto-save cart when items change
  useEffect(() => {
    if (currentCartId && token && selectedMagaza && siparisKalemleri.length >= 0) {
      console.log('Auto-save triggered - will save in 1 second...', siparisKalemleri.length, 'items')

      const timer = setTimeout(() => {
        saveCartItems()
      }, 1000) // Debounce 1 second

      return () => clearTimeout(timer)
    }
  }, [siparisKalemleri, currentCartId, token, selectedMagaza])

  // Load cart by ID (for resuming)
  const loadCartById = async (cartId: string) => {
    try {
      setLoading(true)
      console.log('loadCartById - loading cart:', cartId)

      const cart = await postItem(`/cart/get/${cartId}`, token, {})
      console.log('loadCartById - cart loaded:', cart)

      if (cart) {
        setCurrentCartId(cart._id)

        // Önce magazalar listesini yükle (eğer yoksa)
        if (magazalar.length === 0) {
          console.log('loadCartById - loading magazalar first...')
          const data = await postItem('/mikro/depolar', token, { query: getDepolarMagazalar() })
          setMagazalar(data || [])

          // Yeni yüklenen listeden mağazayı bul
          const magaza = (data || []).find((m: Depo) => m.dep_no === cart.depoNo)
          if (magaza) {
            console.log('loadCartById - magaza found:', magaza.dep_adi)
            setSelectedMagaza(magaza)
          } else {
            console.log('loadCartById - magaza not found for depoNo:', cart.depoNo)
          }
        } else {
          // Mevcut listeden mağazayı bul
          const magaza = magazalar.find(m => m.dep_no === cart.depoNo)
          if (magaza) {
            console.log('loadCartById - magaza found from existing list:', magaza.dep_adi)
            setSelectedMagaza(magaza)
          } else {
            console.log('loadCartById - magaza not found in existing list for depoNo:', cart.depoNo)
          }
        }

        // Convert cart lines to siparis kalemleri
        const kalemler: SiparisKalemi[] = (cart.lines || []).map((line: any) => ({
          stok: {
            sto_kod: line.itemCode,
            sto_isim: line.itemName,
            sto_birim1_ad: line.unitCode || 'ADET',
            sto_birim2_ad: '',
            sto_birim2_katsayi: 0,
            sto_birim3_ad: '',
            sto_birim3_katsayi: 0
          } as Stok,
          miktar: line.quantity,
          birim: 'birim1',
          birimAd: line.unitCode || 'ADET',
          katsayi: 1
        }))

        console.log('loadCartById - kalemler loaded:', kalemler.length)
        setSiparisKalemleri(kalemler)

        // Go to step 2
        setStep(2)

        toast({
          title: 'Sipariş Yüklendi',
          description: `Taslak sipariş yüklendi (${kalemler.length} ürün)`,
        })
      }
    } catch (err) {
      console.error('Cart yüklenirken hata:', err)
      toast({
        title: 'Hata',
        description: 'Sipariş yüklenirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  // Load or create draft cart for selected depot
  const loadOrCreateDraftCart = async (depoNo: number, depoAdi: string) => {
    if (!organizationId || !db) {
      console.error('loadOrCreateDraftCart - Organization or DB not set:', { organizationId, db })
      return
    }

    try {
      console.log('loadOrCreateDraftCart - checking for existing draft...', { depoNo, db, organizationId })

      // Check if there's an existing draft for this depot
      const drafts = await postItem(`/cart/drafts?depoNo=${depoNo}`, token, {})

      console.log('loadOrCreateDraftCart - drafts found:', drafts ? drafts.length : 0)

      if (drafts && drafts.length > 0) {
        // Use existing draft
        const existingCart = drafts[0]
        console.log('loadOrCreateDraftCart - using existing cart:', existingCart._id)
        setCurrentCartId(existingCart._id)

        // Load existing items
        const kalemler: SiparisKalemi[] = (existingCart.lines || []).map((line: any) => ({
          stok: {
            sto_kod: line.itemCode,
            sto_isim: line.itemName,
            sto_birim1_ad: line.unitCode || 'ADET',
            sto_birim2_ad: '',
            sto_birim2_katsayi: 0,
            sto_birim3_ad: '',
            sto_birim3_katsayi: 0
          } as Stok,
          miktar: line.quantity,
          birim: 'birim1',
          birimAd: line.unitCode || 'ADET',
          katsayi: 1
        }))

        setSiparisKalemleri(kalemler)

        if (kalemler.length > 0) {
          toast({
            title: 'Taslak Yüklendi',
            description: `Önceki taslak siparişiniz yüklendi (${kalemler.length} ürün)`,
          })
        }
      } else {
        // Create new cart
        console.log('loadOrCreateDraftCart - creating new cart...', { db, depoNo })

        const newCart = await postItem('/cart/create', token, {
          db,
          depoNo,
          lines: [],
          notes: ''
        })

        console.log('loadOrCreateDraftCart - new cart created:', newCart._id)
        setCurrentCartId(newCart._id)
      }
    } catch (err) {
      console.error('Cart yüklenirken/oluşturulurken hata:', err)
      // Don't show error toast, just log it
    }
  }

  // Save cart items to backend
  const saveCartItems = async () => {
    if (!currentCartId || !selectedMagaza) {
      console.log('saveCartItems - skip: currentCartId =', currentCartId, 'selectedMagaza =', selectedMagaza)
      return
    }

    try {
      console.log('saveCartItems - saving...', siparisKalemleri.length, 'items')

      const lines = siparisKalemleri.map(k => ({
        itemCode: k.stok.sto_kod,
        itemName: k.stok.sto_isim,
        unitCode: k.birimAd,
        quantity: k.miktar,
        price: 0,
        kdvYuzde: 0,
        isk1Yuzde: 0,
        isk2Yuzde: 0
      }))

      console.log('saveCartItems - lines:', lines)
      console.log('saveCartItems - URL:', `/cart/update/${currentCartId}`)

      const result = await postItem(`/cart/update/${currentCartId}`, token, {
        lines,
        status: 'draft'
      })

      console.log('saveCartItems - saved successfully:', result)
    } catch (err) {
      console.error('Cart kaydedilirken hata:', err)
      // Silent fail - don't interrupt user experience
    }
  }

  const loadMagazalar = async () => {
    try {
      setLoading(true)
      const data = await postItem('/mikro/depolar', token, { query: getDepolarMagazalar() })
      setMagazalar(data || [])
    } catch (err) {
      console.error('Mağazalar yüklenirken hata:', err)
      toast({
        title: 'Hata',
        description: 'Mağazalar yüklenirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const loadFilters = async () => {
    try {
      // Ana Gruplar
      const anaGrupData = await postItem('/mikro/get', token, { query: getStokAnaGruplari() })
      setAnaGruplar(anaGrupData || [])

      // Alt Gruplar başlangıçta boş
      setAltGruplar([])

      // Kategoriler
      const kategoriData = await postItem('/mikro/get', token, { query: getStokKategorileri() })
      setKategoriler(kategoriData || [])

      // Markalar
      const markaData = await postItem('/mikro/get', token, { query: getStokMarkalari() })
      setMarkalar(markaData || [])

      // Tedarikçiler
      const tedarikciData = await postItem('/mikro/get', token, { query: getTedarikcilerModal() })
      setTedarikciler(tedarikciData || [])
    } catch (err) {
      console.error('Filtreler yüklenirken hata:', err)
    }
  }

  const loadAltGruplar = async (anaGrupKod: string) => {
    try {
      if (anaGrupKod === 'all') {
        setAltGruplar([])
        return
      }

      const query = getStokAltGruplari(anaGrupKod)
      const altGrupData = await postItem('/mikro/get', token, { query })
      setAltGruplar(altGrupData || [])
    } catch (err) {
      console.error('Alt gruplar yüklenirken hata:', err)
      setAltGruplar([])
    }
  }

  const loadStoklar = async () => {
    try {
      setLoading(true)

      const query = getStoklar(
        searchTerm || undefined,
        selectedAnaGrup,
        selectedAltGrup,
        selectedKategori,
        selectedMarka
      )

      let data = await postItem('/mikro/get', token, { query })

      // Tedarikçi filtresi varsa uygula
      if (selectedTedarikci && selectedTedarikci !== 'all') {
        data = (data || []).filter((s: Stok) => s.sto_sat_cari_kod === selectedTedarikci)
      }

      setStoklar(data || [])
    } catch (err) {
      console.error('Stoklar yüklenirken hata:', err)
      toast({
        title: 'Hata',
        description: 'Stoklar yüklenirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMagazaSelect = async (magaza: Depo) => {
    setSelectedMagaza(magaza)
    // Sepeti temizle - yeni depo için yeni cart yüklenecek
    setSiparisKalemleri([])
    setCurrentCartId(null)
    await loadOrCreateDraftCart(magaza.dep_no, magaza.dep_adi)
    setStep(2)
  }

  const handleUrunEkle = (stok: Stok, birim: 'birim1' | 'birim2' | 'birim3') => {
    let birimAd = stok.sto_birim1_ad
    let katsayi = 1

    if (birim === 'birim2') {
      birimAd = stok.sto_birim2_ad
      katsayi = stok.sto_birim2_katsayi || 1
    } else if (birim === 'birim3') {
      birimAd = stok.sto_birim3_ad
      katsayi = stok.sto_birim3_katsayi || 1
    }

    const eklenecekMiktar = getUrunMiktar(stok.sto_kod, birim)

    const existingIndex = siparisKalemleri.findIndex(
      k => k.stok.sto_kod === stok.sto_kod && k.birim === birim
    )

    if (existingIndex >= 0) {
      const newKalemler = [...siparisKalemleri]
      newKalemler[existingIndex].miktar += eklenecekMiktar
      setSiparisKalemleri(newKalemler)
    } else {
      setSiparisKalemleri([...siparisKalemleri, {
        stok,
        miktar: eklenecekMiktar,
        birim,
        birimAd,
        katsayi
      }])
    }

    // Miktar input'unu sıfırla
    setUrunMiktar(stok.sto_kod, birim, 1)

    toast({
      title: 'Ürün Eklendi',
      description: `${eklenecekMiktar} ${birimAd} - ${stok.sto_kod} sepete eklendi`,
    })
  }

  const handleMiktarArtir = (stoKod: string, birim: 'birim1' | 'birim2' | 'birim3') => {
    const newKalemler = siparisKalemleri.map(k =>
      k.stok.sto_kod === stoKod && k.birim === birim ? { ...k, miktar: k.miktar + 1 } : k
    )
    setSiparisKalemleri(newKalemler)
  }

  const handleMiktarAzalt = (stoKod: string, birim: 'birim1' | 'birim2' | 'birim3') => {
    const newKalemler = siparisKalemleri
      .map(k => k.stok.sto_kod === stoKod && k.birim === birim ? { ...k, miktar: k.miktar - 1 } : k)
      .filter(k => k.miktar > 0)
    setSiparisKalemleri(newKalemler)
  }

  const handleTedarikciSelect = (cariKod: string) => {
    setSelectedTedarikci(cariKod)
    setShowTedarikciModal(false)
  }

  const handleClearFilters = () => {
    setSelectedAnaGrup('all')
    setSelectedAltGrup('all')
    setSelectedKategori('all')
    setSelectedMarka('all')
    setSelectedTedarikci('all')
    setSearchTerm('')
  }

  const toplamUrunSayisi = siparisKalemleri.reduce((sum, k) => sum + k.miktar, 0)

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-primary text-primary-foreground' : 'bg-green-500 text-white'
              }`}>
              {step > 1 ? <Check className="h-6 w-6" /> : '1'}
            </div>
            <span className={`font-medium ${step === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              Mağaza Seçimi
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-primary text-primary-foreground' :
              step > 2 ? 'bg-green-500 text-white' :
                'bg-muted text-muted-foreground'
              }`}>
              {step > 2 ? <Check className="h-6 w-6" /> : '2'}
            </div>
            <span className={`font-medium ${step === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              Ürün Seçimi
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
              3
            </div>
            <span className={`font-medium ${step === 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              Sipariş Onayı
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Mağaza Seçimi */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              Mağaza Seçimi
            </CardTitle>
            <CardDescription>
              Sipariş vereceğiniz mağazayı seçin ({magazalar.length} mağaza)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {magazalar.map((magaza) => (
                  <Card
                    key={magaza.dep_no}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleMagazaSelect(magaza)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        {magaza.dep_adi}
                      </CardTitle>
                      <CardDescription>
                        Depo No: {magaza.dep_no}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {magaza.dep_sor_mer_kodu && (
                          <div>Sorumlu: {magaza.dep_sor_mer_kodu}</div>
                        )}
                        {magaza.dep_proje_kodu && (
                          <div>Proje: {magaza.dep_proje_kodu}</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Ürün Seçimi */}
      {step === 2 && selectedMagaza && (
        <div className="space-y-4">
          {/* Seçilen Mağaza Bilgisi */}
          <Card className="bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-lg">{selectedMagaza.dep_adi}</CardTitle>
                    <CardDescription>Depo No: {selectedMagaza.dep_no}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    // Mağaza değiştirirken mevcut sepeti temizle
                    setSiparisKalemleri([])
                    setCurrentCartId(null)
                    setSelectedMagaza(null)
                    setStep(1)
                  }}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Mağaza Değiştir
                  </Button>
                  {siparisKalemleri.length > 0 && (
                    <Button
                      variant={sepetVisible ? "secondary" : "default"}
                      size="sm"
                      onClick={() => setSepetVisible(!sepetVisible)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Sepet ({toplamUrunSayisi} ürün)
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Sipariş Sepeti */}
          {siparisKalemleri.length > 0 && sepetVisible && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Sipariş Sepeti ({toplamUrunSayisi} ürün)
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSepetVisible(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Gizle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                  {siparisKalemleri.map((kalem, index) => (
                    <div key={`${kalem.stok.sto_kod}-${kalem.birim}`} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex-1">
                        <div className="font-semibold">{kalem.stok.sto_kod}</div>
                        <div className="text-sm text-muted-foreground">{kalem.stok.sto_isim}</div>
                        <Badge variant="outline" className="text-xs mt-1">
                          {kalem.birimAd}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleMiktarAzalt(kalem.stok.sto_kod, kalem.birim)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-bold">{kalem.miktar}</span>
                        <Button size="sm" variant="outline" onClick={() => handleMiktarArtir(kalem.stok.sto_kod, kalem.birim)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setStep(3)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sipariş Onayına Geç
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Ürün Listesi ve Filtreler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6" />
                Ürün Seçimi
              </CardTitle>
              <CardDescription>
                Stoklardan ürün seçin ({stoklar.length} kayıt)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtreler */}
              <div className="mb-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedAnaGrup} onValueChange={setSelectedAnaGrup} disabled={loading}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Ana Grup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Ana Gruplar</SelectItem>
                      {anaGruplar.map((ag) => (
                        <SelectItem key={ag.san_kod} value={ag.san_kod}>
                          {ag.san_kod} - {ag.san_isim}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedAltGrup} onValueChange={setSelectedAltGrup} disabled={loading}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Alt Grup" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {altGruplar.length === 0 ? 'Tümü' : 'Tüm Alt Gruplar'}
                      </SelectItem>
                      {altGruplar.map((ag) => (
                        <SelectItem key={ag.sta_kod} value={ag.sta_kod}>
                          {ag.sta_kod} - {ag.sta_isim}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedKategori} onValueChange={setSelectedKategori} disabled={loading}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kategoriler</SelectItem>
                      {kategoriler.map((k) => (
                        <SelectItem key={k.ktg_kod} value={k.ktg_kod}>
                          {k.ktg_kod} - {k.ktg_isim}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedMarka} onValueChange={setSelectedMarka} disabled={loading}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Marka" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Markalar</SelectItem>
                      {markalar.map((m) => (
                        <SelectItem key={m.mrk_kod} value={m.mrk_kod}>
                          {m.mrk_kod} - {m.mrk_ismi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Tedarikçi Seçimi Modal */}
                  <Dialog open={showTedarikciModal} onOpenChange={setShowTedarikciModal}>
                    <DialogTrigger asChild>
                      <Button variant="outline" disabled={loading}>
                        <Building2 className="h-4 w-4 mr-2" />
                        {selectedTedarikci === 'all' ? 'Tedarikçi Seç' : 'Tedarikçi Seçili'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tedarikçi Seçin</DialogTitle>
                        <DialogDescription>
                          Ürünleri filtrelemek için bir tedarikçi seçin
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleTedarikciSelect('all')}
                        >
                          Tüm Tedarikçiler
                        </Button>
                        {tedarikciler.map((t) => (
                          <Button
                            key={t.cari_kod}
                            variant={selectedTedarikci === t.cari_kod ? 'default' : 'outline'}
                            className="w-full justify-start"
                            onClick={() => handleTedarikciSelect(t.cari_kod)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="text-left">
                                <div className="font-semibold">{t.cari_kod}</div>
                                <div className="text-sm">{t.cari_unvan1}</div>
                                {t.cari_unvan2 && (
                                  <div className="text-xs text-muted-foreground">{t.cari_unvan2}</div>
                                )}
                              </div>
                              <Badge variant="secondary">
                                <Package className="h-3 w-3 mr-1" />
                                {t.urun_sayisi}
                              </Badge>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="ml-auto"
                    disabled={loading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Filtreleri Temizle
                  </Button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Kod, isim veya barkod ile ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadStoklar()}
                      className="pl-9"
                      disabled={loading}
                    />
                  </div>
                  <Button onClick={loadStoklar} disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    Ara
                  </Button>
                </div>
              </div>

              {/* Ürün Listesi */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Yükleniyor...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stoklar.map((stok) => (
                    <Card key={stok.sto_kod} className="hover:border-primary transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold tracking-wide">
                          {stok.sto_kod}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {stok.sto_isim}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-xs space-y-1">
                          {stok.ana_grup_isim && (
                            <div className="text-muted-foreground">
                              Ana Grup: {stok.ana_grup_isim}
                            </div>
                          )}
                          {stok.marka_isim && (
                            <div className="text-muted-foreground">
                              Marka: {stok.marka_isim}
                            </div>
                          )}
                          {stok.satici_unvan && (
                            <div className="text-muted-foreground">
                              Tedarikçi: {stok.satici_unvan}
                            </div>
                          )}
                        </div>

                        {/* Birim Butonları */}
                        <div className="flex flex-col gap-2">
                          {/* Birim 1 - Her zaman var */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => azaltUrunMiktar(stok.sto_kod, 'birim1')}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={getUrunMiktar(stok.sto_kod, 'birim1')}
                                onChange={(e) => setUrunMiktar(stok.sto_kod, 'birim1', parseInt(e.target.value) || 1)}
                                className="h-7 text-center w-16"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-7 w-7"
                                onClick={() => artirUrunMiktar(stok.sto_kod, 'birim1')}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              className="w-full justify-start"
                              size="sm"
                              variant="outline"
                              onClick={() => handleUrunEkle(stok, 'birim1')}
                            >
                              <Plus className="h-3 w-3 mr-2" />
                              {stok.sto_birim1_ad || 'ADET'}
                            </Button>
                          </div>

                          {/* Birim 2 - Varsa göster */}
                          {stok.sto_birim2_ad && stok.sto_birim2_katsayi > 0 && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7"
                                  onClick={() => azaltUrunMiktar(stok.sto_kod, 'birim2')}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={getUrunMiktar(stok.sto_kod, 'birim2')}
                                  onChange={(e) => setUrunMiktar(stok.sto_kod, 'birim2', parseInt(e.target.value) || 1)}
                                  className="h-7 text-center w-16"
                                />
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7"
                                  onClick={() => artirUrunMiktar(stok.sto_kod, 'birim2')}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                className="w-full justify-start"
                                size="sm"
                                variant="outline"
                                onClick={() => handleUrunEkle(stok, 'birim2')}
                              >
                                <Plus className="h-3 w-3 mr-2" />
                                {stok.sto_birim2_katsayi}x {stok.sto_birim2_ad}
                              </Button>
                            </div>
                          )}

                          {/* Birim 3 - Varsa göster */}
                          {stok.sto_birim3_ad && stok.sto_birim3_katsayi > 0 && (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7"
                                  onClick={() => azaltUrunMiktar(stok.sto_kod, 'birim3')}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={getUrunMiktar(stok.sto_kod, 'birim3')}
                                  onChange={(e) => setUrunMiktar(stok.sto_kod, 'birim3', parseInt(e.target.value) || 1)}
                                  className="h-7 text-center w-16"
                                />
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7"
                                  onClick={() => artirUrunMiktar(stok.sto_kod, 'birim3')}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                className="w-full justify-start"
                                size="sm"
                                variant="outline"
                                onClick={() => handleUrunEkle(stok, 'birim3')}
                              >
                                <Plus className="h-3 w-3 mr-2" />
                                {stok.sto_birim3_katsayi}x {stok.sto_birim3_ad}
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Sipariş Onayı */}
      {step === 3 && selectedMagaza && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-6 w-6" />
                Sipariş Onayı
              </CardTitle>
              <CardDescription>
                Sipariş bilgilerinizi kontrol edin ve onaylayın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sipariş Özeti Komponenti */}
              <OrderSummary
                magaza={selectedMagaza}
                lines={siparisKalemleri.map(kalem => ({
                  itemCode: kalem.stok.sto_kod,
                  itemName: kalem.stok.sto_isim,
                  unitCode: kalem.birimAd,
                  quantity: kalem.miktar * kalem.katsayi,
                  price: 0
                }))}
                showTitle={false}
              />

              {/* Butonlar */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Geri Dön
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={() => {
                    toast({
                      title: '✓ Sipariş Onaylandı!',
                      description: `${toplamUrunSayisi} adet ürün içeren sipariş oluşturuldu`,
                    })
                    // Siparişler sayfasına yönlendir
                    router.push('/siparisler')
                  }}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Siparişi Onayla
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
