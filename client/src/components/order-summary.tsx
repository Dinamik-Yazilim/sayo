'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, ShoppingCart, Package } from 'lucide-react'

interface OrderLine {
  itemCode: string
  itemName: string
  unitCode: string
  quantity: number
  price?: number
}

interface Cart {
  _id: string
  db: string
  depoNo: number
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled'
  lines: OrderLine[]
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy?: {
    name: string
    email: string
  }
}

interface Magaza {
  dep_no: number
  dep_adi: string
  dep_tipi: number
}

interface OrderSummaryProps {
  magaza?: Magaza
  depoNo?: number
  depoAdi?: string
  lines: OrderLine[]
  showTitle?: boolean
  className?: string
}

export function OrderSummary({
  magaza,
  depoNo,
  depoAdi,
  lines,
  showTitle = true,
  className = ''
}: OrderSummaryProps) {
  const totalItems = lines.length
  const totalQuantity = lines.reduce((sum, line) => sum + (line.quantity || 0), 0)

  const magazaInfo = magaza ? {
    name: magaza.dep_adi,
    no: magaza.dep_no,
    type: magaza.dep_tipi === 1 ? 'Satış Mağazası' :
      magaza.dep_tipi === 2 ? 'Merkez Depo' :
        magaza.dep_tipi === 3 ? 'Şube Deposu' :
          `Tip ${magaza.dep_tipi}`
  } : depoNo && depoAdi ? {
    name: depoAdi,
    no: depoNo,
    type: 'Depo'
  } : null

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div>
          <h2 className="text-2xl font-bold">Sipariş Detayları</h2>
          <p className="text-muted-foreground">Sipariş bilgilerini inceleyin</p>
        </div>
      )}

      {/* Mağaza/Depo Bilgisi */}
      {magazaInfo && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Store className="h-5 w-5" />
            Mağaza/Depo Bilgileri
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Ad:</div>
            <div className="font-medium">{magazaInfo.name}</div>
            <div className="text-muted-foreground">No:</div>
            <div className="font-medium">{magazaInfo.no}</div>
            {magaza && (
              <>
                <div className="text-muted-foreground">Depo Tipi:</div>
                <div className="font-medium">{magazaInfo.type}</div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sipariş Kalemleri */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Sipariş Kalemleri ({totalItems} Ürün, {totalQuantity} Adet)
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Henüz ürün eklenmemiş</p>
            </div>
          ) : (
            lines.map((line, index) => (
              <div key={`${line.itemCode}-${index}`} className="border rounded-md p-3 bg-background">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="font-semibold">{line.itemCode}</span>
                    </div>
                    <div className="text-sm mt-1">{line.itemName}</div>
                    <Badge variant="secondary" className="text-xs mt-2">
                      Birim: {line.unitCode}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{line.quantity}</div>
                    <div className="text-xs text-muted-foreground">{line.unitCode}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Özet */}
      <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
        <h3 className="font-semibold mb-2">Sipariş Özeti</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-muted-foreground">Toplam Ürün Çeşidi:</div>
          <div className="font-bold text-right">{totalItems}</div>
          <div className="text-muted-foreground">Toplam Adet:</div>
          <div className="font-bold text-right text-primary text-xl">{totalQuantity}</div>
        </div>
      </div>
    </div>
  )
}
