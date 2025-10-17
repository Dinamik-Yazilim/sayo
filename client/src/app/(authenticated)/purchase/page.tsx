"use client"

import { Button } from '@/components/ui/button'
import { MenuPage } from '@/components/ui216/menu-page'

import { NotebookPenIcon, TruckIcon, UsersIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
export default function PurchasePage() {
  const router = useRouter()


  return (<MenuPage title='Satın Alma'>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      <Button onClick={() => router.push('/purchase/vendors')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🐫🐫</span>Satıcılar
      </Button>
      <Button onClick={() => router.push('/purchase/orders')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>🚚📝</span>Satın Alma Siparişleri
      </Button>
      <Button onClick={() => router.push('/purchase/invoices')} variant={'outline'} className='flex justify-start gap-4'>
        <span className='text-2xl'>↘️🧾</span>
        Gelen Faturalar
      </Button>
    </div>
  </MenuPage>)
}