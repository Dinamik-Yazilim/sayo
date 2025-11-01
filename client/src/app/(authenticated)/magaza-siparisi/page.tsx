'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
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
  const [step, setStep] = useState(1) // 1: Mağaza Seçimi, 2: Ürün Seçimi, 3: Sipariş Onayı
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
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
  }, [])

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

  const handleMagazaSelect = (magaza: Depo) => {
    setSelectedMagaza(magaza)
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
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Mağaza Değiştir
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Sipariş Sepeti */}
          {siparisKalemleri.length > 0 && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Sipariş Sepeti ({toplamUrunSayisi} ürün)
                </CardTitle>
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
              {/* Mağaza Bilgisi */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Mağaza Bilgileri
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Mağaza Adı:</div>
                  <div className="font-medium">{selectedMagaza.dep_adi}</div>
                  <div className="text-muted-foreground">Mağaza No:</div>
                  <div className="font-medium">{selectedMagaza.dep_no}</div>
                  <div className="text-muted-foreground">Depo Tipi:</div>
                  <div className="font-medium">
                    {selectedMagaza.dep_tipi === 1 ? 'Satış Mağazası' :
                      selectedMagaza.dep_tipi === 2 ? 'Merkez Depo' :
                        selectedMagaza.dep_tipi === 3 ? 'Şube Deposu' :
                          `Tip ${selectedMagaza.dep_tipi}`}
                  </div>
                </div>
              </div>

              {/* Sipariş Kalemleri */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Sipariş Kalemleri ({siparisKalemleri.length} Ürün, {toplamUrunSayisi} Adet)
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {siparisKalemleri.map((kalem, index) => (
                    <div key={`${kalem.stok.sto_kod}-${kalem.birim}`} className="border rounded-md p-3 bg-background">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-semibold">{kalem.stok.sto_kod}</span>
                          </div>
                          <div className="text-sm mt-1">{kalem.stok.sto_isim}</div>
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            {kalem.stok.ana_grup_isim && (
                              <span>Ana Grup: {kalem.stok.ana_grup_isim}</span>
                            )}
                            {kalem.stok.marka_isim && (
                              <span>Marka: {kalem.stok.marka_isim}</span>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs mt-2">
                            Birim: {kalem.birimAd}
                            {kalem.katsayi > 1 && ` (${kalem.katsayi}x)`}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{kalem.miktar}</div>
                          <div className="text-xs text-muted-foreground">{kalem.birimAd}</div>
                          {kalem.katsayi > 1 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              = {kalem.miktar * kalem.katsayi} {kalem.stok.sto_birim1_ad}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Özet */}
              <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                <h3 className="font-semibold mb-2">Sipariş Özeti</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Toplam Ürün Çeşidi:</div>
                  <div className="font-bold text-right">{siparisKalemleri.length}</div>
                  <div className="text-muted-foreground">Toplam Adet:</div>
                  <div className="font-bold text-right text-primary text-xl">{toplamUrunSayisi}</div>
                </div>
              </div>

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
                    // TODO: Sipariş kaydetme işlemi
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
