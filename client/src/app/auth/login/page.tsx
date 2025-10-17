'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { useState } from 'react'
import { LogInIcon } from 'lucide-react'
import { HeaderLogo2 } from '@/components/logo'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { postItem } from '@/lib/fetch'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState(Cookies.get('login_last_username') || '')
  const [organization, setOrganization] = useState(Cookies.get('login_last_organization') || '')
  const { toast } = useToast()
  const deviceId = Cookies.get('deviceId') || ''
  const login = () => {
    if (username) {
      postItem(`/auth/login`, '', {
        username: username,
        deviceId: deviceId,
        organization: organization,
      })
        .then(result => {
          Cookies.set('login_last_username', username)
          Cookies.set('login_last_organization', organization)
          console.log('login result:', result)
          router.push(`/auth/login/verify?username=${username}`)
        })
        .catch(err =>
          toast({
            title: 'Hata',
            description: err,
            variant: 'destructive',
          }),
        )
    } else {
      toast({
        title: 'Lütfen e-posta adresinizi veya telefon numaranızı girin',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="relative h-full flex flex-col justify-center items-center gap-4">
      <div className="flex justify-center">
        <HeaderLogo2 />
      </div>
      <div className="flex flex-col justify-between gap-4 w-full h-full  mb-6 text-2xl max-w-[350px] max-h-[240px]  rounded-lg border border-dashed border-opacity-50 border-slate-400 p-4">
        <div className="flex flex-col gap-6 ">
          <div className="flex flex-col gap-2 ">
            <Label className="ms-2">Organizasyon</Label>
            <Input
              defaultValue={organization}
              placeholder="Organizasyon"
              onChange={e => setOrganization(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 ">
            <Label className="ms-2">Telefon Numarası veya E-posta</Label>
            <div className="flex gap-2">
              <Input
                defaultValue={username}
                placeholder="Telefon Numarası veya E-posta"
                onChange={e => setUsername(e.target.value)}
              />
              <Button className="flex-shrink" onClick={login}>
                <LogInIcon />
              </Button>
            </div>
          </div>
        </div>
        <TermsAndPolicies />
      </div>
    </div>
  )
}

function TermsAndPolicies() {
  return (
    <p className="w-full mt-6 text-center text-xs text-muted-foreground ">
      By clicking continue, you agree to our{' '}
      <Link
        href="#" // qwerty terms, privacy, dpa, etc
        className="underline underline-offset-4 hover:text-primary"
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        href="#" // qwerty terms, privacy, dpa, etc
        className="underline underline-offset-4 hover:text-primary"
      >
        Privacy Policy
      </Link>
      .
    </p>
  )
}
