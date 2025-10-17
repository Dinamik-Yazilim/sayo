"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuContent, DropdownMenu, DropdownMenuGroup, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuShortcut, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import Link from 'next/link'
import { SignOutButton } from './signout-button'
import { FC, useEffect, useState } from 'react'
import { Member } from '@/types/Member'
import Cookies from 'js-cookie'
import { DatabaseSelect } from '@/app/(authenticated)/(components)/database-select'
import { Skeleton } from '@/components/ui/skeleton'
export function UserMenu() {
  const [token, setToken] = useState('')
  const [userInfo, setUserInfo] = useState<Member>()
  const [loading, setLoading] = useState(true)
  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => {
    try {
      if (Cookies.get('user'))
        setUserInfo(JSON.parse(Cookies.get('user') || '{}') as Member)

    } catch (err) {
      console.log('hata:', err)
    }
    setLoading(false)
  }, [token])


  return (<>
    {!loading && userInfo &&
      <DropdownMenu >
        <DropdownMenuTrigger asChild  >
          <Button className="rounded-full border border-gray-200 w-12 h-12 dark:border-gray-800 "
            size="icon"
            variant="ghost"
          >
            <Image
              priority
              alt="Avatar"
              className="rounded-full shadow-[1px_1px_2px_2px_black] dark:shadow-none"
              height="48"
              src={"/img/avatar-place-holder.png"}  // TODO:// session user image
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="48"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href="/me" className='flex flex-col'>
              <span className=''>{userInfo?.name}</span>
              <span className='text-muted-foreground'>🏣 {userInfo?.organization?.name}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='flex flex-row justify-between gap-6'>
            <ThemeToggleButton />
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    }
    {(loading || !userInfo) && <Skeleton className='h-12 w-12 rounded-full' />}
  </>)
}
