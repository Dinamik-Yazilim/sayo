'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, X, Filter, Warehouse } from 'lucide-react'
import { postItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { getDepolar, searchDepolar } from '@/mikroerp'

interface Depo {
  dep_no: number
  dep_adi: string
  dep_tipi: number
  dep_tipi_adi: string
  dep_sor_mer_kodu: string
  dep_proje_kodu: string
}

const depoTipleri = [
  { value: 0, label: 'Merkez Depo' },
  { value: 1, label: 'Şube Depo' },
  { value: 2, label: 'Mağaza Depo' },
  { value: 3, label: 'Market Depo' },
  { value: 4, label: 'Satıcı Depo' },
  { value: 5, label: 'Gümrük Depo' },
  { value: 6, label: 'Mal Kabul Depo' },
  { value: 7, label: 'Ham Madde Depo' },
  { value: 8, label: 'Yarı Mamül Depo' },
  { value: 9, label: 'Üretim Koltuk Depo' },
  { value: 10, label: 'Fason Depo' },
  { value: 11, label: 'Mamül Depo' },
  { value: 12, label: 'Sevk Depo' },
  { value: 13, label: 'Kalite Kontrol Depo' },
  { value: 14, label: 'Konsinye Depo' },
  { value: 15, label: 'Nakliye Depo' },
  { value: 16, label: 'Kiralama Depo' },
]

export default function DepolarPage() {
  const [depolar, setDepolar] = useState<Depo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTip, setSelectedTip] = useState<string>('all')
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const { toast } = useToast()

  const getDepoTipiAdi = (tip: number): string => {
    return depoTipleri.find(t => t.value === tip)?.label || `Tip ${tip}`
  }

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const query = searchTerm
        ? searchDepolar(searchTerm, selectedTip)
        : getDepolar(selectedTip)

      const data = await postItem('/mikro/depolar', token, { query })
      setDepolar(data || [])
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
    setSelectedTip('all')
    setSearchTerm('')
  }

  useEffect(() => {
    if (!token) {
      setToken(Cookies.get('token') || '')
    }
  }, [])

  useEffect(() => {
    if (token) {
      load()
    }
  }, [token])

  // searchTerm temizlendiğinde otomatik listele
  useEffect(() => {
    if (token && searchTerm === '' && lastSearchTerm !== '') {
      load()
    }
  }, [searchTerm])

  // Tip değişiminde yeniden yükle
  useEffect(() => {
    if (token) {
      load()
    }
  }, [selectedTip])

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
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-6 w-6" />
            Depolar
          </CardTitle>
          <CardDescription>
            Depo Tanımları ({depolar.length} kayıt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtreler */}
          <div className="mb-4 space-y-3">
            <div className="flex gap-2">
              <Select value={selectedTip} onValueChange={setSelectedTip}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Depo Tipi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Tipler</SelectItem>
                  {depoTipleri.map((tip) => (
                    <SelectItem key={tip.value} value={tip.value.toString()}>
                      {tip.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="ml-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Filtreleri Temizle
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="No, ad, sorumluluk merkezi veya proje kodu ile ara..."
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
          </div>

          {/* Tablo */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No</TableHead>
                <TableHead>Depo Adı</TableHead>
                <TableHead className="w-[200px]">Tip</TableHead>
                <TableHead className="w-[180px]">Sorumluluk Merkezi</TableHead>
                <TableHead className="w-[180px]">Proje Kodu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {depolar.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Kayıt bulunamadı
                  </TableCell>
                </TableRow>
              ) : (
                depolar.map((depo) => (
                  <TableRow key={depo.dep_no}>
                    <TableCell className="font-mono font-medium">
                      {depo.dep_no}
                    </TableCell>
                    <TableCell className="font-medium">{depo.dep_adi}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                        {getDepoTipiAdi(depo.dep_tipi)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {depo.dep_sor_mer_kodu && (
                        <span className="text-sm font-mono">
                          {depo.dep_sor_mer_kodu}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {depo.dep_proje_kodu && (
                        <span className="text-sm font-mono">
                          {depo.dep_proje_kodu}
                        </span>
                      )}
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
