import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ChartBar,
  Package,
  ShoppingCart,
  Users,
  CheckCircle,
  Shield,
  Clock,
  TrendingUp,
  Smartphone,
  Cloud,
  Zap,
  Star
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">DinamikSAYO</h1>
              <Badge variant="secondary" className="ml-3">V17</Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900">Özellikler</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900">Fiyatlandırma</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900">İletişim</a>
            </nav>
            <Button asChild>
              <a href="https://sayoapp.dinamikup.com" target="_blank" rel="noopener noreferrer">Sisteme Giriş</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Mikro ERP ile Entegre
            <span className="text-blue-600"> Satın Alma Yönetimi</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            DinamikSAYO, Mikro ERP V16 ve V17 sürümleri ile tam entegre çalışan profesyonel satın alma yönetim sistemidir.
            Dinamik Yazılım güvencesi ile işletmenizi geleceğe taşıyın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Demo Talep Et
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Dinamik Yazılım'ı Ziyaret Et
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              DinamikSAYO Özellikleri
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Mikro ERP entegrasyonu ile Dinamik Yazılım kalitesinde çözümler
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Mikro ERP Entegrasyonu</CardTitle>
                <CardDescription>
                  V16 ve V17 sürümleri ile tam entegre çalışan sistem. Dinamik Yazılım kalitesi garantisi.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Satın Alma Yönetimi</CardTitle>
                <CardDescription>
                  Tedarikçi yönetimi, sipariş takibi ve satın alma süreçlerini DinamikSAYO ile optimize edin
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <ChartBar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Detaylı Raporlama</CardTitle>
                <CardDescription>
                  Kapsamlı raporlar ve analizler ile işletme performansınızı izleyin
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Kullanıcı Yönetimi</CardTitle>
                <CardDescription>
                  Rol tabanlı erişim kontrolü ile güvenli kullanıcı yönetimi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Cloud className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Bulut Tabanlı</CardTitle>
                <CardDescription>
                  Her yerden erişim, otomatik yedekleme ve güvenli veri saklama
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle>Mobil Uyumlu</CardTitle>
                <CardDescription>
                  Responsive tasarım ile tüm cihazlardan sorunsuz erişim
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Neden DinamikSAYO?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Dinamik Yazılım Ltd. Şti. güvencesi ile Mikro ERP entegreli çözüm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">Kolay Kullanım</h3>
                    <p className="text-slate-600">Sezgisel arayüz ile hızlı öğrenme ve verimli çalışma</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">Güvenli</h3>
                    <p className="text-slate-600">SSL şifreleme ve güvenli veri saklama ile verileriniz güvende</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Zap className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">Hızlı</h3>
                    <p className="text-slate-600">Modern teknoloji altyapısı ile yüksek performans</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-green-500 mt-1" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-900">Ölçeklenebilir</h3>
                    <p className="text-slate-600">İşletmeniz büyüdükçe sistem de büyür</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                  <Star className="w-8 h-8 text-blue-600" />
                </div>
                <blockquote className="text-lg text-slate-600 mb-6">
                  "DinamikSAYO ile Mikro ERP entegrasyonu sayesinde satın alma süreçlerimiz %60 hızlandı!"
                </blockquote>
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">Mehmet Kaya</p>
                  <p className="text-slate-500">İşletme Müdürü, Örnek Şirketi A.Ş.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              DinamikSAYO Fiyatlandırma
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Dinamik Yazılım özel fiyatlandırması - Mikro ERP entegrasyonu dahil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Başlangıç</CardTitle>
                <CardDescription>Küçük işletmeler için</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₺0,00</span>
                  <span className="text-slate-500">/ay</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    5 kullanıcı
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Temel raporlar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Email desteği
                  </li>
                </ul>
                <Button className="w-full mt-6">Başlayın</Button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600">Popüler</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Profesyonel</CardTitle>
                <CardDescription>Büyüyen işletmeler için</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₺0,00</span>
                  <span className="text-slate-500">/ay</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    15 kullanıcı
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Gelişmiş raporlar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Telefon desteği
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    API erişimi
                  </li>
                </ul>
                <Button className="w-full mt-6">Başlayın</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Kurumsal</CardTitle>
                <CardDescription>Büyük organizasyonlar için</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₺0,00</span>
                  <span className="text-slate-500">/ay</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Sınırsız kullanıcı
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Özel raporlar
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    7/24 destek
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Özelleştirme
                  </li>
                </ul>
                <Button className="w-full mt-6">İletişime Geçin</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            DinamikSAYO'ya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Dinamik Yazılım güvencesi ile Mikro ERP entegre çözümü keşfedin.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Demo Talep Edin
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">DinamikSAYO</h3>
              <p className="text-slate-400">
                Dinamik Yazılım Ltd. Şti. ile Mikro ERP entegre satın alma yönetim sistemi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Özellikler</li>
                <li>Fiyatlandırma</li>
                <li>Güvenlik</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Hakkımızda</li>
                <li>İletişim</li>
                <li>Kariyer</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Dokümantasyon</li>
                <li>Yardım Merkezi</li>
                <li>API</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-slate-700" />
          <div className="text-center text-slate-400">
            <p>&copy; 2025 Dinamik Yazılım Ltd. Şti. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
