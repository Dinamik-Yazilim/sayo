"use client"

import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { postItem } from '@/lib/fetch'
import {
  getTopSellingProducts,
  getTotalStockCount,
  getDailySales,
  getMonthlySales,
  getActiveCustomerCount,
  getPendingOrderCount,
  getMonthlyInvoiceCount,
  getCriticalStockCount
} from '@/mikroerp'

interface TopProduct {
  sto_kod: string
  sto_isim: string
  net_tutar: number
  toplam_miktar: number
}

interface DashboardStats {
  totalStock: number
  dailySales: number
  monthlySales: number
  activeCustomers: number
  pendingOrders: number
  monthlyInvoices: number
  criticalStock: number
}

export default function Dashboard() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalStock: 0,
    dailySales: 0,
    monthlySales: 0,
    activeCustomers: 0,
    pendingOrders: 0,
    monthlyInvoices: 0,
    criticalStock: 0
  })
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const cookieToken = Cookies.get('token')
    if (cookieToken) {
      setToken(cookieToken)
    }
  }, [])

  useEffect(() => {
    if (token) {
      loadTopProducts()
      loadStats()
    }
  }, [token])

  const loadStats = async () => {
    try {
      setStatsLoading(true)

      // Tüm istatistikleri paralel olarak çek
      const [
        stockCount,
        dailySales,
        monthlySales,
        customerCount,
        orderCount,
        invoiceCount,
        criticalCount
      ] = await Promise.all([
        postItem('/mikro/get', token, { query: getTotalStockCount() }),
        postItem('/mikro/get', token, { query: getDailySales() }),
        postItem('/mikro/get', token, { query: getMonthlySales() }),
        postItem('/mikro/get', token, { query: getActiveCustomerCount() }),
        postItem('/mikro/get', token, { query: getPendingOrderCount() }),
        postItem('/mikro/get', token, { query: getMonthlyInvoiceCount() }),
        postItem('/mikro/get', token, { query: getCriticalStockCount() })
      ])

      let obj = {
        totalStock: stockCount?.[0]?.total || 0,
        dailySales: dailySales?.[0]?.daily_total || 0,
        monthlySales: monthlySales?.[0]?.monthly_total || 0,
        activeCustomers: customerCount?.[0]?.total || 0,
        pendingOrders: orderCount?.[0]?.total || 0,
        monthlyInvoices: invoiceCount?.[0]?.total || 0,
        criticalStock: criticalCount?.[0]?.total || 0
      }
      console.log('Stats obj:', obj)
      setStats(obj)
    } catch (err) {
      console.error('Stats fetch error:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  const loadTopProducts = async () => {
    try {
      setLoading(true)

      const query = getTopSellingProducts(30, 10)
      const data = await postItem('/mikro/get', token, { query })

      setTopProducts(data || [])
    } catch (err) {
      console.error('Top products fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Toplam Stok',
      value: statsLoading ? '...' : stats.totalStock.toLocaleString('tr-TR'),
      description: 'Kayıtlı stok sayısı',
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Günlük Satış',
      value: statsLoading ? '...' : `₺${stats.dailySales.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Bugünkü toplam satış',
      icon: TrendingUp,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Aktif Müşteriler',
      value: statsLoading ? '...' : stats.activeCustomers.toLocaleString('tr-TR'),
      description: 'Kayıtlı müşteri sayısı',
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'Bekleyen Siparişler',
      value: statsLoading ? '...' : stats.pendingOrders.toLocaleString('tr-TR'),
      description: 'İşlemde olan siparişler',
      icon: ShoppingCart,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    },
    {
      title: 'Aylık Ciro',
      value: statsLoading ? '...' : `₺${stats.monthlySales.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      description: 'Bu ayki toplam ciro',
      icon: DollarSign,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500'
    },
    {
      title: 'Toplam Fatura',
      value: statsLoading ? '...' : stats.monthlyInvoices.toLocaleString('tr-TR'),
      description: 'Bu ay kesilen fatura',
      icon: FileText,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-500'
    },
    {
      title: 'Kritik Stok',
      value: statsLoading ? '...' : stats.criticalStock.toLocaleString('tr-TR'),
      description: 'Minimum seviyede stoklar',
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      title: 'Stok Değeri',
      value: '₺0',
      description: 'Toplam stok değeri',
      icon: CheckCircle,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500'
    }
  ]

  return (
    <div className='container relative px-0 py-4 flex flex-col gap-6'>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Genel bakış ve istatistikler</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index} className={`relative overflow-hidden ${card.color} bg-opacity-10 border-none shadow-md`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.color} bg-opacity-20`}>
                <card.icon className={`h-4 w-4 ${card.textColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.textColor}`}>{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* En Çok Satan Ürünler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            En Çok Satan 10 Ürün
          </CardTitle>
          <CardDescription>
            Son 30 gün içinde en çok satılan ürünler (Net satış - İadeler)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : topProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Henüz satış kaydı bulunmuyor
            </div>
          ) : (
            <div className="space-y-2">
              {topProducts.map((product, index) => (
                <div
                  key={product.sto_kod}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-full font-bold
                      ${index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                            'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{product.sto_isim}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {product.sto_kod}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      {product.net_tutar.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} ₺
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {product.toplam_miktar.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} adet
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
