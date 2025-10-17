"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Settings, Users, ShoppingCart, BarChart, FileText, Mail, Bell, HelpCircle, CheckCircle2Icon, ChartAreaIcon, TruckIcon, ShoppingCartIcon, ComputerIcon, Users2Icon, Building2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Cookies from 'js-cookie'
import { Member } from "@/types/Member"
import { SignOutButton } from "./signout-button"

// Define menu item types
interface MenuItem {
  title: string
  icon: React.ReactNode
  href?: string
  submenu?: SubMenuItem[]
}

interface SubMenuItem {
  title: string
  href: string
  icon?: React.ReactNode
}

interface Props {
  className?: string
}

function menuItems(user: Member) {
  let l = [
    {
      title: 'Gösterge Paneli',
      icon: <Home className="h-6 w-6" />,
      href: "/",
    },
    {
      title: 'Satın Alma',
      icon: <TruckIcon className="h-6 w-6" />,
      submenu: [
        { title: 'Envanter', href: "/purchase/inventory", icon: <BarChart className="h-5 w-5" /> },
        { title: 'Tedarikçiler', href: "/module-closed/vendors", icon: <Users className="h-5 w-5" /> },
        { title: 'Satın Alma Siparişleri', href: "/purchase/orders", icon: <ShoppingCart className="h-5 w-5" /> },
        { title: 'Satın Alma Koşulları', href: "/purchase/conditions", icon: <FileText className="h-5 w-5" /> },
      ],
    },
    {
      title: 'Raporlar',
      icon: <ChartAreaIcon className="h-6 w-6" />,
      submenu: [
        { title: "Satın Alma Raporu", href: "/reports/purchase", icon: <FileText className="h-5 w-5" /> },
        { title: "Satış Devir Hızı", href: "/module-closed/sales-cycle", icon: <FileText className="h-5 w-5" /> },
        { title: "Satış Raporu", href: "/module-closed/satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Saatlik Satış Raporu", href: "/module-closed/saatlik-satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Günlük Ciro", href: "/module-closed/gunluk-ciro", icon: <FileText className="h-5 w-5" /> },
        { title: "Aylık Ciro", href: "/module-closed/aylik-ciro", icon: <FileText className="h-5 w-5" /> },
        { title: "Mağaza Masrafları", href: "/module-closed/magaza-masraflari", icon: <FileText className="h-5 w-5" /> },
        { title: "Envanter", href: "/module-closed/envanter", icon: <FileText className="h-5 w-5" /> },
        { title: "Tedarikçiye Göre Satış Raporu", href: "/module-closed/tedarikciye-gore-satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Tedarikçiye Göre Sipariş Karşılama", href: "/module-closed/tedarikciye-gore-siparis-karsilama", icon: <FileText className="h-5 w-5" /> },
        { title: "Satın Almaya Göre Satış Raporu", href: "/module-closed/satin-almaya-gore-satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Nakit Akış", href: "/module-closed/nakit-akis", icon: <FileText className="h-5 w-5" /> },
        { title: "Müşteri Satış Raporu", href: "/module-closed/musteri-satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Ürün Satış Raporu", href: "/module-closed/urun-satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Belge Bazlı Ürün Raporu", href: "/module-closed/belge-bazli-urun-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "İade Nedenleri", href: "/module-closed/iade-nedenleri", icon: <FileText className="h-5 w-5" /> },
        { title: "Fire Raporu", href: "/module-closed/fire-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "KDV Bazlı Satış Raporu", href: "/module-closed/kdv-bazli-satis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Ürün Stok Durumu", href: "/module-closed/urun-stok-durumu", icon: <FileText className="h-5 w-5" /> },
        { title: "Market Sipariş Raporu", href: "/module-closed/market-siparis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Depo Sipariş Raporu", href: "/module-closed/depo-siparis-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Günlük Kasa Defteri", href: "/module-closed/gunluk-kasa-defteri", icon: <FileText className="h-5 w-5" /> },
        { title: "İndirimler Raporu", href: "/module-closed/indirimler-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Fiyat Değişim Raporu", href: "/module-closed/fiyat-degisim-raporu", icon: <FileText className="h-5 w-5" /> },
        { title: "Marj Raporu", href: "/module-closed/marj-raporu", icon: <FileText className="h-5 w-5" /> },
      ],
    },
    {
      title: 'Bildirimler',
      icon: <Bell className="h-6 w-6" />,
      href: "/notifications",
    },
    {
      title: 'Ayarlar',
      icon: <Settings className="h-6 w-6" />,
      submenu: [
        { title: 'Kullanıcılar', href: "/settings/users", icon: <Users className="h-5 w-5" /> },
        { title: 'Konnektör', href: "/settings/connector", icon: <ComputerIcon className="h-5 w-5" /> },
        { title: 'Çalışma Parametreleri', href: "/settings/workingParams", icon: <Settings className="h-5 w-5" /> },
      ],
    },
  ]
  return l
}

function adminMenu(user: Member) {
  let l = [
    {
      title: 'Gösterge Paneli',
      icon: <Home className="h-6 w-6" />,
      href: "/",
    },
    {
      title: 'Organizasyonlar',
      icon: <Building2Icon className="h-6 w-6" />,
      href: '/admin/organizations'
    }
  ]
  if (user.role == 'sysadmin') {
    l.push({
      title: 'Admin Kullanıcıları',
      icon: <Users2Icon className="h-6 w-6" />,
      href: "/admin/adminUsers",
    })
  }
  return l
}


export function Sidebar({ className }: Props) {
  const pathname = usePathname()
  // Track open accordion values
  const [openAccordions, setOpenAccordions] = useState<string[]>([])
  const [user, setUser] = useState<Member>()
  const [menu, setMenu] = useState<MenuItem[]>([])
  // Define menu items

  // Check if a path is active or is a parent of the current path
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  // Handle accordion state changes
  const handleAccordionChange = (value: string) => {
    setOpenAccordions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  // Ensure parent accordion is open if a child is active
  const ensureParentOpen = () => {

  }


  useEffect(() => {
    try {
      if (!user) {
        setUser(JSON.parse(Cookies.get('user') || '{}') as Member)
      }
    } catch { }
  }, [])
  useEffect(() => {
    if (user) {
      const m: MenuItem[] = user.organization ? menuItems(user) : adminMenu(user)
      m.forEach((item, index) => {
        if (item.submenu) {
          const hasActiveChild = item.submenu.some((subItem) => isActive(subItem.href))
          if (hasActiveChild && !openAccordions.includes(`item-${index}`)) {
            setOpenAccordions((prev) => [...prev, `item-${index}`])
          }
        }
      })
      setMenu(m)
    }
  }, [user])

  return (
    <div className={`w-72 min-h-screen border-r flex flex-col ${className}`}>
      {user?.organization &&
        <div className="flex justify-between items-center border-b mb-1 bg-gr11een-600 text-green-600 px-2 py-1 font-bold">
          <div className="flex gap-2">
            <Building2Icon />
            {user?.organization?.name?.toUpperCase()}
          </div>
          <SignOutButton />
        </div>
      }
      {menu &&
        <nav className="p-2 mt-0 w-full">
          <Accordion type="multiple" value={openAccordions} className="space-y-1">

            {menu.map((item, index) => {
              // If the item has a submenu, render as accordion
              if (item.submenu) {
                return (
                  <AccordionItem key={index} value={`item-${index}`} className="border-none">
                    <AccordionTrigger
                      onClick={() => handleAccordionChange(`item-${index}`)}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm hover:bg-slate-500 hover:text-white transition-all",
                        item.submenu.some((subItem) => isActive(subItem.href)) && "bg-slate-600 text-white font-medium",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0 pl-9">
                      <div className="flex flex-col space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-600 hover:text-white transition-all",
                              isActive(subItem.href) && "bg-amber-700 text-white font-medium",
                            )}
                          >
                            {subItem.icon}
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              }

              // If the item doesn't have a submenu, render as a link
              return (
                <Link
                  key={index}
                  href={item.href || "#"}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-slate-600 hover:text-white transition-all",
                    isActive(item.href || "") && "bg-slate-600 font-medium text-white",
                  )}
                >
                  <div>{item.icon}</div>
                  <div>{item.title}</div>
                </Link>
              )
            })}

          </Accordion>
        </nav>
      }
    </div>
  )
}
