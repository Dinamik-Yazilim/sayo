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
              <h1 className="text-2xl font-bold text-slate-900">Sayo</h1>
              <Badge variant="secondary" className="ml-3">Beta</Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900">Özellikler</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900">Fiyatlandırma</a>
              <a href="#contact" className="text-slate-600 hover:text-slate-900">İletişim</a>
            </nav>
            <Button>Ücretsiz Deneyin</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            İşletmenizi Dijital Dönüşümle
            <span className="text-blue-600"> Güçlendirin</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Sayo ile satın alma, envanter yönetimi, raporlama ve daha fazlasını tek platformda yönetin.
            Modern, hızlı ve kullanıcı dostu ERP çözümü.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3">
              Hemen Başlayın
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Demo İzleyin
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Güçlü Özellikler
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              İşletmenizin ihtiyacı olan her şey tek platformda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Envanter Yönetimi</CardTitle>
                <CardDescription>
                  Gerçek zamanlı stok takibi ve otomatik uyarılar ile envanter kontrolünü kolaylaştırın
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Satın Alma</CardTitle>
                <CardDescription>
                  Tedarikçi yönetimi, sipariş takibi ve satın alma süreçlerini optimize edin
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
              Neden Sayo?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Modern teknoloji ile geleneksel iş süreçlerini birleştiren çözümümüz
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
                  "Sayo ile işletme süreçlerimizi tamamen dijitalleştirdik. Verimlilik %40 arttı!"
                </blockquote>
                <div className="text-sm">
                  <p className="font-semibold text-slate-900">Ahmet Yılmaz</p>
                  <p className="text-slate-500">CEO, ABC Ltd.</p>
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
              Basit Fiyatlandırma
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              İhtiyacınıza uygun planı seçin, istediğiniz zaman değiştirin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Başlangıç</CardTitle>
                <CardDescription>Küçük işletmeler için</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₺299</span>
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
                  <span className="text-4xl font-bold">₺599</span>
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
                  <span className="text-4xl font-bold">₺999</span>
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
            Hemen Başlamaya Hazır mısınız?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            14 gün ücretsiz deneme. Kredi kartı gerekmez.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Ücretsiz Denemeyi Başlat
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sayo</h3>
              <p className="text-slate-400">
                Modern ERP çözümü ile işletmenizi geleceğe taşıyın.
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
            <p>&copy; 2025 Sayo. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
