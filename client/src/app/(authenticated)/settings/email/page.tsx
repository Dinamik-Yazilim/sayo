'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, Save, TestTube } from 'lucide-react'
import { postItem, getItem } from '@/lib/fetch'
import { useToast } from '@/components/ui/use-toast'
import Cookies from 'js-cookie'

interface EmailSettings {
  enabled: boolean
  provider: 'smtp' | 'gmail'
  fromEmail: string
  fromName: string
  smtp: {
    host: string
    port: number
    secure: boolean
    username: string
    password: string
  }
  gmail: {
    clientId: string
    clientSecret: string
    refreshToken: string
  }
  templates: {
    orderCreated: {
      enabled: boolean
      subject: string
      recipients: string[]
    }
    orderApproved: {
      enabled: boolean
      subject: string
      recipients: string[]
    }
    orderCompleted: {
      enabled: boolean
      subject: string
      recipients: string[]
    }
  }
}

export default function EmailSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [token, setToken] = useState('')
  const { toast } = useToast()

  const [settings, setSettings] = useState<EmailSettings>({
    enabled: false,
    provider: 'smtp',
    fromEmail: '',
    fromName: '',
    smtp: {
      host: '',
      port: 587,
      secure: false,
      username: '',
      password: ''
    },
    gmail: {
      clientId: '',
      clientSecret: '',
      refreshToken: ''
    },
    templates: {
      orderCreated: {
        enabled: true,
        subject: 'Yeni Sipariş Oluşturuldu',
        recipients: []
      },
      orderApproved: {
        enabled: true,
        subject: 'Sipariş Onaylandı',
        recipients: []
      },
      orderCompleted: {
        enabled: true,
        subject: 'Sipariş Tamamlandı',
        recipients: []
      }
    }
  })

  useEffect(() => {
    const t = Cookies.get('token') || ''
    setToken(t)
  }, [])

  useEffect(() => {
    if (token) {
      loadSettings()
    }
  }, [token])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const result = await getItem('/settings', token)
      if (result?.emailSettings) {
        setSettings(result.emailSettings)
      }
    } catch (err: any) {
      console.error('Ayarlar yüklenirken hata:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await postItem('/settings', token, {
        emailSettings: settings
      })
      toast({
        title: 'Başarılı',
        description: 'Email ayarları kaydedildi',
      })
    } catch (err: any) {
      toast({
        title: 'Hata',
        description: err?.message || 'Ayarlar kaydedilirken bir hata oluştu',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleTestEmail = async () => {
    toast({
      title: 'Test Email',
      description: 'Test email gönderme özelliği yakında eklenecek',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-8 w-8" />
            Email Ayarları
          </h1>
          <p className="text-muted-foreground mt-1">
            SMTP veya Gmail üzerinden email gönderim ayarlarını yapılandırın
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestEmail}>
            <TestTube className="h-4 w-4 mr-2" />
            Test Email Gönder
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="smtp">SMTP Ayarları</TabsTrigger>
          <TabsTrigger value="templates">Email Şablonları</TabsTrigger>
        </TabsList>

        {/* Genel Ayarlar */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genel Email Ayarları</CardTitle>
              <CardDescription>
                Email gönderimini aktifleştirin ve sağlayıcı seçin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Gönderimi</Label>
                  <p className="text-sm text-muted-foreground">
                    Email gönderimini aktif/pasif yapın
                  </p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enabled: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Email Sağlayıcı</Label>
                <Select
                  value={settings.provider}
                  onValueChange={(value: 'smtp' | 'gmail') =>
                    setSettings({ ...settings, provider: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="gmail">Gmail (OAuth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Gönderen Email</Label>
                  <Input
                    type="email"
                    placeholder="ornek@sirket.com"
                    value={settings.fromEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, fromEmail: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gönderen Adı</Label>
                  <Input
                    placeholder="Şirket Adı"
                    value={settings.fromName}
                    onChange={(e) =>
                      setSettings({ ...settings, fromName: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMTP Ayarları */}
        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Sunucu Ayarları</CardTitle>
              <CardDescription>
                SMTP sunucu bilgilerini girin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SMTP Sunucu</Label>
                  <Input
                    placeholder="smtp.gmail.com"
                    value={settings.smtp.host}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, host: e.target.value }
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Gmail: smtp.gmail.com, Outlook: smtp-mail.outlook.com
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Port</Label>
                  <Input
                    type="number"
                    placeholder="587"
                    value={settings.smtp.port}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, port: parseInt(e.target.value) || 587 }
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    TLS: 587, SSL: 465
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SSL/TLS Kullan</Label>
                  <p className="text-sm text-muted-foreground">
                    Port 465 için aktifleştirin
                  </p>
                </div>
                <Switch
                  checked={settings.smtp.secure}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, secure: checked }
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Kullanıcı Adı</Label>
                  <Input
                    type="email"
                    placeholder="kullanici@gmail.com"
                    value={settings.smtp.username}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, username: e.target.value }
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Şifre</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={settings.smtp.password}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, password: e.target.value }
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Gmail için uygulama şifresi kullanın
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Şablonları */}
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Şablonları</CardTitle>
              <CardDescription>
                Farklı olaylar için email şablonlarını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sipariş Oluşturuldu */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sipariş Oluşturuldu</Label>
                    <p className="text-sm text-muted-foreground">
                      Yeni sipariş oluşturulduğunda gönderilir
                    </p>
                  </div>
                  <Switch
                    checked={settings.templates.orderCreated.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        templates: {
                          ...settings.templates,
                          orderCreated: { ...settings.templates.orderCreated, enabled: checked }
                        }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Konusu</Label>
                  <Input
                    value={settings.templates.orderCreated.subject}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        templates: {
                          ...settings.templates,
                          orderCreated: { ...settings.templates.orderCreated, subject: e.target.value }
                        }
                      })
                    }
                  />
                </div>
              </div>

              {/* Sipariş Onaylandı */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sipariş Onaylandı</Label>
                    <p className="text-sm text-muted-foreground">
                      Sipariş onaylandığında gönderilir
                    </p>
                  </div>
                  <Switch
                    checked={settings.templates.orderApproved.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        templates: {
                          ...settings.templates,
                          orderApproved: { ...settings.templates.orderApproved, enabled: checked }
                        }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Konusu</Label>
                  <Input
                    value={settings.templates.orderApproved.subject}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        templates: {
                          ...settings.templates,
                          orderApproved: { ...settings.templates.orderApproved, subject: e.target.value }
                        }
                      })
                    }
                  />
                </div>
              </div>

              {/* Sipariş Tamamlandı */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Sipariş Tamamlandı</Label>
                    <p className="text-sm text-muted-foreground">
                      Sipariş tamamlandığında gönderilir
                    </p>
                  </div>
                  <Switch
                    checked={settings.templates.orderCompleted.enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        templates: {
                          ...settings.templates,
                          orderCompleted: { ...settings.templates.orderCompleted, enabled: checked }
                        }
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Konusu</Label>
                  <Input
                    value={settings.templates.orderCompleted.subject}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        templates: {
                          ...settings.templates,
                          orderCompleted: { ...settings.templates.orderCompleted, subject: e.target.value }
                        }
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
