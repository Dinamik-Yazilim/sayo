"use client"


import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { Member } from "@/types/Member"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { description } from "../home/dashboard/rapor1"



export function SignOutButton() {
  const router = useRouter()

  const [user, setUser] = useState<Member>()
  const { toast } = useToast()
  useEffect(() => {
    try {
      if (!user) {
        setUser(JSON.parse(Cookies.get('user') || '{}') as Member)
      }
    } catch { }
  }, [])

  return (<>
    {user &&
      <Button variant={'outline'}
        onClick={() => {
          if (!user.role?.startsWith('sys') || user.role?.startsWith('sys') && !user.organization) {
            if (confirm('Çıkmak istiyor musunuz?')) {
              Cookies.remove('token')
              Cookies.remove('user')
              Cookies.remove('db')
              Cookies.remove('dbList')
              setTimeout(() => {
                location.href = '/auth/login'
              }, 300)
            }
          } else {
            let u = user
            u.organization = null
            Cookies.set('user', JSON.stringify(u))
            toast({ title: `Organizasyondan çıkış yapılıyor`, description: user?.organization?.name?.toUpperCase(), duration: 1000 })
            setTimeout(() => {
              location.href = '/admin/organizations'
            }, 1100)
          }
        }}
      >
        <i className='fa-solid fa-power-off'></i>
      </Button>
    }
  </>
  )
}


