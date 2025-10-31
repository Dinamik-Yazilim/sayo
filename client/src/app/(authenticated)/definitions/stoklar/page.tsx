'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, X, Filter, Package } from 'lucide-react'
import { postItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import {
  getStoklar,
  getStokAnaGruplari,
  getStokAltGruplari,
  getStokKategorileri,
  getStokMarkalari
} from '@/mikroerp'

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

export default function StoklarPage() {
  const [stoklar, setStoklar] = useState<Stok[]>([])
  const [anaGruplar, setAnaGruplar] = useState<StokAnaGrup[]>([])
  const [altGruplar, setAltGruplar] = useState<StokAltGrup[]>([])
  const [kategoriler, setKategoriler] = useState<StokKategori[]>([])
  const [markalar, setMarkalar] = useState<StokMarka[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnaGrup, setSelectedAnaGrup] = useState<string>('all')
  const [selectedAltGrup, setSelectedAltGrup] = useState<string>('all')
  const [selectedKategori, setSelectedKategori] = useState<string>('all')
  const [selectedMarka, setSelectedMarka] = useState<string>('all')
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const { toast } = useToast()

  const loadFilters = async () => {
    try {
      // Ana Gruplar
      const anaGrupData = await postItem('/mikro/get', token, { query: getStokAnaGruplari() })
      setAnaGruplar(anaGrupData || [])

      // Alt Gruplar
      const altGrupData = await postItem('/mikro/get', token, { query: getStokAltGruplari() })
      setAltGruplar(altGrupData || [])

      // Kategoriler
      const kategoriData = await postItem('/mikro/get', token, { query: getStokKategorileri() })
      setKategoriler(kategoriData || [])

      // Markalar
      const markaData = await postItem('/mikro/get', token, { query: getStokMarkalari() })
      setMarkalar(markaData || [])
    } catch (err) {
      console.error('Filtreler yüklenirken hata:', err)
    }
  }

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const query = getStoklar(
        searchTerm || undefined,
        selectedAnaGrup,
        selectedAltGrup,
        selectedKategori,
        selectedMarka
      )

      const data = await postItem('/mikro/get', token, { query })
      setStoklar(data || [])
      setLastSearchTerm(searchTerm)
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Veri yüklenirken hata oluştu')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleClearFilters = () => {
    setSelectedAnaGrup('all')
    setSelectedAltGrup('all')
    setSelectedKategori('all')
    setSelectedMarka('all')
    setSearchTerm('')
  }

  useEffect(() => {
    if (!token) {
      setToken(Cookies.get('token') || '')
    }
  }, [])

  useEffect(() => {
    if (token) {
      loadFilters()
      load().finally(() => setInitialLoading(false))
    }
  }, [token])

  // searchTerm temizlendiğinde otomatik listele
  useEffect(() => {
    if (token && searchTerm === '' && lastSearchTerm !== '') {
      load()
    }
  }, [searchTerm])

  // Filtre değişimlerinde yeniden yükle
  useEffect(() => {
    if (token && anaGruplar.length > 0) {
      load()
    }
  }, [selectedAnaGrup, selectedAltGrup, selectedKategori, selectedMarka])

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Hata</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            Stok Kartları
          </CardTitle>
          <CardDescription>
            MikroERP Stok Kartları Listesi ({stoklar.length} kayıt)
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
                  <SelectItem value="all">Tüm Alt Gruplar</SelectItem>
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
                  onKeyDown={(e) => e.key === 'Enter' && load()}
                  className="pl-9 pr-9"
                  disabled={loading}
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Button
                onClick={load}
                variant={searchTerm ? "default" : "outline"}
                className="min-w-[100px]"
                disabled={loading}
              >
                {searchTerm ? (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrele
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Listele
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stoklar.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  Kayıt bulunamadı
                </div>
              ) : (
                stoklar.map((stok) => (
                  <Card key={stok.sto_kod} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold tracking-wide">{stok.sto_kod}</CardTitle>
                      <CardDescription className="text-sm font-medium text-foreground">
                        {stok.sto_isim}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Gruplar */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Ana Grup</div>
                          <div className="font-medium">{stok.ana_grup_isim}</div>
                          <div className="text-xs text-muted-foreground">{stok.sto_anagrup_kod}</div>
                        </div>
                        {stok.sto_altgrup_kod && (
                          <div>
                            <div className="text-xs text-muted-foreground">Alt Grup</div>
                            <div className="font-medium">{stok.alt_grup_isim}</div>
                            <div className="text-xs text-muted-foreground">{stok.sto_altgrup_kod}</div>
                          </div>
                        )}
                      </div>

                      {/* Kategori ve Marka */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {stok.sto_kategori_kodu && (
                          <div>
                            <div className="text-xs text-muted-foreground">Kategori</div>
                            <div className="font-medium">{stok.kategori_isim}</div>
                          </div>
                        )}
                        {stok.sto_marka_kodu && (
                          <div>
                            <div className="text-xs text-muted-foreground">Marka</div>
                            <div className="font-medium">{stok.marka_isim}</div>
                          </div>
                        )}
                      </div>

                      {/* Satıcı */}
                      {stok.sto_sat_cari_kod && (
                        <div className="text-sm">
                          <div className="text-xs text-muted-foreground">Satıcı</div>
                          <div className="font-medium text-orange-700">{stok.satici_unvan}</div>
                          <div className="text-xs text-muted-foreground">{stok.sto_sat_cari_kod}</div>
                        </div>
                      )}

                      {/* Birimler */}
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground">1. Birim</div>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                            {stok.sto_birim1_ad}
                          </span>
                        </div>
                        {stok.sto_birim2_ad && (
                          <div className="flex-1">
                            <div className="text-xs text-muted-foreground">2. Birim</div>
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                              {stok.sto_birim2_ad} ({stok.sto_birim2_katsayi})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Barkodlar */}
                      {(stok.barkod1 || stok.barkod2 || stok.barkod3) && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Barkodlar</div>
                          <div className="flex flex-wrap gap-1">
                            {stok.barkod1 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-200 dark:bg-slate-700 dark:text-slate-100">
                                {stok.barkod1}
                              </span>
                            )}
                            {stok.barkod2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-200 dark:bg-slate-700 dark:text-slate-100">
                                {stok.barkod2}
                              </span>
                            )}
                            {stok.barkod3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-slate-200 dark:bg-slate-700 dark:text-slate-100">
                                {stok.barkod3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fiyatlar */}
                      {(stok.fiyat1 || stok.fiyat2) && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                          {stok.fiyat1 && (
                            <div>
                              <div className="text-xs text-muted-foreground">Liste 1</div>
                              <div className="font-semibold text-lg text-green-600">
                                {stok.fiyat1.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                              </div>
                            </div>
                          )}
                          {stok.fiyat2 && (
                            <div>
                              <div className="text-xs text-muted-foreground">Liste 2</div>
                              <div className="font-semibold text-lg text-blue-600">
                                {stok.fiyat2.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
