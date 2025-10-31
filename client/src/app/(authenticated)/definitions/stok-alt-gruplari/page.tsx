'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, X, Filter } from 'lucide-react'
import { postItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { getStokAltGruplari, searchStokAltGruplari, getStokAnaGruplari } from '@/mikroerp'

interface StokAltGrup {
  sta_kod: string
  sta_isim: string
  sta_ana_grup_kod: string
  ana_grup_isim: string
  stok_sayisi: number
}

interface StokAnaGrup {
  san_kod: string
  san_isim: string
}

export default function StokAltGruplariPage() {
  const [gruplar, setGruplar] = useState<StokAltGrup[]>([])
  const [anaGruplar, setAnaGruplar] = useState<StokAnaGrup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAnaGrup, setSelectedAnaGrup] = useState<string>('all')
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const { toast } = useToast()

  const loadAnaGruplar = async () => {
    try {
      const query = getStokAnaGruplari()
      const data = await postItem('/mikro/get', token, { query })
      setAnaGruplar(data || [])
    } catch (err) {
      console.error('Ana gruplar yüklenirken hata:', err)
    }
  }

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const query = searchTerm
        ? searchStokAltGruplari(searchTerm, selectedAnaGrup)
        : getStokAltGruplari(selectedAnaGrup)

      const data = await postItem('/mikro/get', token, { query })
      setGruplar(data || [])
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

  useEffect(() => {
    if (!token) {
      setToken(Cookies.get('token') || '')
    }
  }, [])

  useEffect(() => {
    if (token) {
      loadAnaGruplar()
      load()
    }
  }, [token])

  // searchTerm temizlendiğinde otomatik listele
  useEffect(() => {
    if (token && searchTerm === '' && lastSearchTerm !== '') {
      load()
    }
  }, [searchTerm])

  // Ana grup seçimi değiştiğinde yeniden yükle
  useEffect(() => {
    if (token && anaGruplar.length > 0) {
      load()
    }
  }, [selectedAnaGrup])

  if (loading) {
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
          <CardTitle>Stok Alt Grupları</CardTitle>
          <CardDescription>
            Stok Alt Grupları Listesi ({gruplar.length} kayıt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Select value={selectedAnaGrup} onValueChange={setSelectedAnaGrup}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Ana Grup Seçin" />
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

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Kod veya isim ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load()}
                className="pl-9 pr-9"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              onClick={load}
              variant={searchTerm ? "default" : "outline"}
              className="min-w-[100px]"
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Kod</TableHead>
                <TableHead>İsim</TableHead>
                <TableHead className="w-[200px]">Ana Grup</TableHead>
                <TableHead className="w-[120px] text-right">Stok Sayısı</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gruplar.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Kayıt bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                gruplar.map((grup) => (
                  <TableRow key={grup.sta_kod}>
                    <TableCell className="font-mono font-medium">
                      {grup.sta_kod}
                    </TableCell>
                    <TableCell>{grup.sta_isim}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {grup.sta_ana_grup_kod}
                      </span>
                      {' - '}
                      <span className="text-sm">
                        {grup.ana_grup_isim}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                        {grup.stok_sayisi}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
