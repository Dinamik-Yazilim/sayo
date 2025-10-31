'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, X, Filter, Building2, Package } from 'lucide-react'
import { postItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { getTedarikciler, searchTedarikciler } from '@/mikroerp'

interface Tedarikci {
  cari_kod: string
  cari_unvan1: string
  cari_unvan2: string
  cari_vdaire_no: string
  cari_CepTel: string
  ilce: string
  il: string
  urun_sayisi: number
}

export default function TedarikcilerPage() {
  const [tedarikciler, setTedarikciler] = useState<Tedarikci[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const { toast } = useToast()

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const query = searchTerm
        ? searchTedarikciler(searchTerm)
        : getTedarikciler()

      const data = await postItem('/mikro/get', token, { query })
      setTedarikciler(data || [])
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
      load().finally(() => setInitialLoading(false))
    }
  }, [token])

  // searchTerm temizlendiğinde otomatik listele
  useEffect(() => {
    if (token && searchTerm === '' && lastSearchTerm !== '') {
      load()
    }
  }, [searchTerm])

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
            <Building2 className="h-6 w-6" />
            Tedarikçiler
          </CardTitle>
          <CardDescription>
            Tedarikçi Listesi ({tedarikciler.length} kayıt)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Arama */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Kod, ünvan veya vergi no ile ara..."
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

          {/* Tablo */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Yükleniyor...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kod</TableHead>
                    <TableHead>Ünvan</TableHead>
                    <TableHead>Vergi No</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Konum</TableHead>
                    <TableHead className="text-center">Ürün Sayısı</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tedarikciler.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Kayıt bulunamadı
                      </TableCell>
                    </TableRow>
                  ) : (
                    tedarikciler.map((tedarikci) => (
                      <TableRow key={tedarikci.cari_kod}>
                        <TableCell className="font-mono font-semibold">
                          {tedarikci.cari_kod}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{tedarikci.cari_unvan1}</div>
                            {tedarikci.cari_unvan2 && (
                              <div className="text-sm text-muted-foreground">
                                {tedarikci.cari_unvan2}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tedarikci.cari_vdaire_no || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {tedarikci.cari_CepTel || '-'}
                        </TableCell>
                        <TableCell>
                          {tedarikci.ilce || tedarikci.il ? (
                            <div className="text-sm">
                              {tedarikci.ilce && <div>{tedarikci.ilce}</div>}
                              {tedarikci.il && (
                                <div className="text-muted-foreground">{tedarikci.il}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {tedarikci.urun_sayisi > 0 ? (
                            <Badge variant="secondary" className="gap-1">
                              <Package className="h-3 w-3" />
                              {tedarikci.urun_sayisi}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
