"use client"

import { Button } from '@/components/ui/button'
import { MenuPage } from '@/components/ui216/menu-page'
import { NotebookPenIcon, UsersIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function SalesPage() {
  const router = useRouter()

  return (<MenuPage title='Satış'>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <Button onClick={() => router.push('/sales/customers')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🕺🏻💃🏻</span>Müşteriler
      </Button>
      <Button onClick={() => router.push('/sales/orders')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🛒📝</span>
        Satış Siparişleri
      </Button>
      <Button onClick={() => router.push('/sales/invoices')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🧾↗️</span>
        Giden Faturalar
      </Button>
    </div>
  </MenuPage>)
}