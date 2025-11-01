"use client"

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Users, Settings as SettingsIcon, Database } from 'lucide-react'

interface Props {
}

export default function SettingsPage({ }: Props) {
  const settingsMenu = [
    {
      title: 'Email Ayarları',
      description: 'SMTP ve Gmail email gönderim ayarları',
      icon: Mail,
      href: '/settings/email',
      color: 'text-blue-500'
    },
    {
      title: 'Kullanıcılar',
      description: 'Kullanıcı ve yetki yönetimi',
      icon: Users,
      href: '/settings/users',
      color: 'text-green-500'
    },
    {
      title: 'Bağlantı Ayarları',
      description: 'Veritabanı ve sistem bağlantıları',
      icon: Database,
      href: '/settings/connector',
      color: 'text-purple-500'
    },
    {
      title: 'Çalışma Parametreleri',
      description: 'Genel sistem parametreleri',
      icon: SettingsIcon,
      href: '/settings/workingParams',
      color: 'text-orange-500'
    }
  ]

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground mt-1">
          Sistem ayarlarını yapılandırın ve yönetin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsMenu.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}