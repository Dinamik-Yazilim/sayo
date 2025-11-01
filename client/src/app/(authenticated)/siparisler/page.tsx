'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { OrderSummary } from '@/components/order-summary'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Loader2,
  FileText,
  ShoppingCart,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Archive,
  ArchiveRestore
} from 'lucide-react'
import { postItem, getList } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CartLine {
  _id: string
  itemCode: string
  itemName: string
  unitCode: string
  quantity: number
  price: number
}

interface Cart {
  _id: string
  db: string
  depoNo: number
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled'
  lines: CartLine[]
  notes: string
  createdAt: string
  updatedAt: string
  createdBy?: {
    _id: string
    name: string
    email: string
  }
  updatedBy?: {
    _id: string
    name: string
    email: string
  }
  totalQuantity?: number
  totalAmount?: number
}

const statusConfig = {
  draft: {
    label: 'Taslak',
    icon: Clock,
    variant: 'secondary' as const,
    color: 'text-gray-500'
  },
  pending: {
    label: 'Beklemede',
    icon: AlertCircle,
    variant: 'default' as const,
    color: 'text-blue-500'
  },
  approved: {
    label: 'Onaylandı',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'text-green-500'
  },
  completed: {
    label: 'Tamamlandı',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'text-green-600'
  },
  cancelled: {
    label: 'İptal',
    icon: XCircle,
    variant: 'destructive' as const,
    color: 'text-red-500'
  }
}

export default function SiparislerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')
  const [carts, setCarts] = useState<Cart[]>([])
  const [deleteCartId, setDeleteCartId] = useState<string | null>(null)
  const [selectedCartIds, setSelectedCartIds] = useState<string[]>([])
  const [sendingOrders, setSendingOrders] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [viewCartId, setViewCartId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast } = useToast()

  useEffect(() => {
    const t = Cookies.get('token') || ''
    console.log('Cookie okundu - token var mı:', !!t)
    console.log('Cookie okundu - token başlangıcı:', t ? t.substring(0, 20) : 'YOK')
    console.log('Cookie okundu - DINAMIKUP_ ile başlıyor mu:', t ? t.startsWith('DINAMIKUP_') : false)
    setToken(t)
  }, [])

  useEffect(() => {
    if (token) {
      loadCarts()
    }
  }, [token, showArchived, statusFilter])

  const loadCarts = async () => {
    try {
      setLoading(true)
      console.log('loadCarts - token var mı:', !!token)
      console.log('loadCarts - token başlangıcı:', token ? token.substring(0, 20) : 'YOK')
      console.log('loadCarts - token uzunluğu:', token ? token.length : 0)
      console.log('loadCarts - showArchived:', showArchived)
      console.log('loadCarts - statusFilter:', statusFilter)

      let url = `/cart/list?showArchived=${showArchived}`
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }

      const result = await getList(url, token)
      console.log('loadCarts - result:', result)
      setCarts(result || [])
    } catch (err: any) {
      console.error('Siparişler yüklenirken hata:', err)
      console.error('Hata tipi:', typeof err)
      console.error('Hata detayı:', JSON.stringify(err, null, 2))
      toast({
        title: 'Hata',
        description: typeof err === 'string' ? err : (err?.message || err?.error || 'Siparişler yüklenirken bir hata oluştu'),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResumeOrder = (cartId: string, status: string) => {
    if (status === 'draft') {
      router.push(`/magaza-siparisi?cartId=${cartId}`)
    } else {
      // Diğer durumlarda modal ile görüntüle
      setViewCartId(cartId)
    }
  }

  const handleViewOrder = (cartId: string) => {
    setViewCartId(cartId)
  }

  const handleDeleteOrder = async () => {
    if (!deleteCartId) return

    try {
      const result = await postItem(`/cart/delete/${deleteCartId}`, token, {})
      toast({
        title: 'Başarılı',
        description: result?.deleted ? 'Sipariş silindi' : 'Sipariş arşivlendi',
      })
      loadCarts()
    } catch (err: any) {
      toast({
        title: 'Hata',
        description: err?.message || 'Sipariş silinirken/arşivlenirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setDeleteCartId(null)
    }
  }

  const handleSendOrder = async (cartId: string) => {
    try {
      setSendingOrders(true)
      await postItem(`/cart/changeStatus/${cartId}`, token, { status: 'pending' })
      toast({
        title: 'Başarılı',
        description: 'Sipariş gönderildi',
      })
      loadCarts()
    } catch (err: any) {
      toast({
        title: 'Hata',
        description: err?.message || 'Sipariş gönderilirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setSendingOrders(false)
    }
  }

  const handleSendSelectedOrders = async () => {
    if (selectedCartIds.length === 0) {
      toast({
        title: 'Uyarı',
        description: 'Lütfen göndermek için sipariş seçin',
        variant: 'default'
      })
      return
    }

    try {
      setSendingOrders(true)
      // Tüm seçili siparişleri sırayla gönder
      for (const cartId of selectedCartIds) {
        await postItem(`/cart/changeStatus/${cartId}`, token, { status: 'pending' })
      }

      toast({
        title: 'Başarılı',
        description: `${selectedCartIds.length} sipariş gönderildi`,
      })
      setSelectedCartIds([])
      loadCarts()
    } catch (err: any) {
      toast({
        title: 'Hata',
        description: err?.message || 'Siparişler gönderilirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setSendingOrders(false)
    }
  }

  const handleSelectAll = () => {
    const draftCartIds = carts
      .filter(cart => cart.status === 'draft')
      .map(cart => cart._id)

    if (selectedCartIds.length === draftCartIds.length) {
      // Tümü seçiliyse, hepsini kaldır
      setSelectedCartIds([])
    } else {
      // Tümünü seç
      setSelectedCartIds(draftCartIds)
    }
  }

  const handleToggleCart = (cartId: string) => {
    setSelectedCartIds(prev => {
      if (prev.includes(cartId)) {
        return prev.filter(id => id !== cartId)
      } else {
        return [...prev, cartId]
      }
    })
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Siparişler
              </CardTitle>
              <CardDescription>
                {showArchived ? 'Arşivlenmiş siparişler' : 'Aktif siparişler'} ({carts.length} sipariş)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Durum Filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="pending">Beklemede</SelectItem>
                  <SelectItem value="approved">Onaylandı</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="cancelled">İptal</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={showArchived ? "default" : "outline"}
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? (
                  <>
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Aktif Siparişler
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 mr-2" />
                    Arşiv
                  </>
                )}
              </Button>
              {selectedCartIds.length > 0 && (
                <Button
                  onClick={handleSendSelectedOrders}
                  disabled={sendingOrders}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {sendingOrders ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Sipariş Gönder ({selectedCartIds.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {carts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Henüz sipariş yok</h3>
              <p className="text-muted-foreground mb-4">
                Yeni sipariş oluşturmak için Mağaza Siparişi sayfasını kullanın
              </p>
              <Button onClick={() => router.push('/magaza-siparisi')}>
                Yeni Sipariş Oluştur
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          carts.filter(c => c.status === 'draft').length > 0 &&
                          selectedCartIds.length === carts.filter(c => c.status === 'draft').length
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Depo</TableHead>
                    <TableHead>Ürün Sayısı</TableHead>
                    <TableHead>Toplam Miktar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturan</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carts.map((cart) => {
                    const status = statusConfig[cart.status]
                    const StatusIcon = status.icon
                    const totalItems = cart.lines?.length || 0
                    const totalQty = cart.lines?.reduce((sum, line) => sum + (line.quantity || 0), 0) || 0

                    return (
                      <TableRow key={cart._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCartIds.includes(cart._id)}
                            onCheckedChange={() => handleToggleCart(cart._id)}
                            disabled={cart.status !== 'draft'}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="text-sm">
                            {formatDate(cart.createdAt)}
                          </div>
                          {cart.createdAt !== cart.updatedAt && (
                            <div className="text-xs text-muted-foreground">
                              Güncellendi: {formatDate(cart.updatedAt)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">Depo {cart.depoNo}</div>
                          <div className="text-xs text-muted-foreground">{cart.db}</div>
                        </TableCell>
                        <TableCell>{totalItems} ürün</TableCell>
                        <TableCell>{totalQty} adet</TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {cart.createdBy?.name || 'Bilinmiyor'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {cart.status === 'draft' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleSendOrder(cart._id)}
                                  disabled={sendingOrders}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Gönder
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResumeOrder(cart._id, cart.status)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Devam Et
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="bg-red-600 hover:bg-red-700 text-white border-red-600"
                                  onClick={() => setDeleteCartId(cart._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Sil
                                </Button>
                              </>
                            )}
                            {cart.status !== 'draft' && !showArchived && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleResumeOrder(cart._id, cart.status)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Görüntüle
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setDeleteCartId(cart._id)}
                                >
                                  <Archive className="h-4 w-4 mr-1" />
                                  Arşivle
                                </Button>
                              </>
                            )}
                            {showArchived && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResumeOrder(cart._id, cart.status)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Görüntüle
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete/Archive Confirmation Dialog */}
      <AlertDialog open={!!deleteCartId} onOpenChange={(open) => !open && setDeleteCartId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {carts.find(c => c._id === deleteCartId)?.status === 'draft' ? 'Siparişi Sil' : 'Siparişi Arşivle'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {carts.find(c => c._id === deleteCartId)?.status === 'draft'
                ? 'Bu taslak siparişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
                : 'Bu siparişi arşivlemek istediğinizden emin misiniz? Arşivlenen siparişleri daha sonra görüntüleyebilirsiniz.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder}>
              {carts.find(c => c._id === deleteCartId)?.status === 'draft' ? 'Sil' : 'Arşivle'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Order Modal */}
      <Dialog open={!!viewCartId} onOpenChange={(open) => !open && setViewCartId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sipariş Detayları</DialogTitle>
            <DialogDescription>
              Sipariş numarası: {viewCartId}
            </DialogDescription>
          </DialogHeader>
          {viewCartId && (() => {
            const cart = carts.find(c => c._id === viewCartId)
            if (!cart) return <div>Sipariş bulunamadı</div>

            return (
              <OrderSummary
                depoNo={cart.depoNo}
                depoAdi={`Depo ${cart.depoNo}`}
                lines={cart.lines}
                showTitle={false}
              />
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
