"use client"

import { useEffect, useState } from 'react'
import { Plug2, Unplug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { postItem, getItem } from '@/lib/fetch'
import Cookies from 'js-cookie'
import { Connector } from '@/types/Connector'
import { useToast } from '@/components/ui/use-toast'

interface ConnectorStatus {
  status: 'connected' | 'disconnected'
  message?: string
}

export function ConnectorStatus() {
  const [status, setStatus] = useState<ConnectorStatus>({ status: 'disconnected' })
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const { toast } = useToast()

  const checkStatus = async (showToast: boolean = false) => {
    if (!token) return

    try {
      setLoading(true)

      // Önce connector bilgilerini al
      const connectorData = await getItem('/connector', token)

      if (!connectorData || !connectorData.connector) {
        setStatus({ status: 'disconnected', message: 'Yapılandırılmamış' })
        if (showToast) {
          toast({
            title: 'Bağlantı Yok',
            description: 'Connector yapılandırılmamış',
            variant: 'destructive'
          })
        }
        return
      }

      // Connector test yap
      const result = await postItem('/connector/connectorTest', token, connectorData.connector)

      if (result) {
        setStatus({ status: 'connected', message: 'Bağlı' })
        if (showToast) {
          toast({
            title: '✓ Bağlı',
            description: 'Connector bağlantısı başarılı',
            duration: 2000
          })
        }
      } else {
        setStatus({ status: 'disconnected', message: 'Yanıt alınamadı' })
        if (showToast) {
          toast({
            title: 'Bağlantı Yok',
            description: 'Connector yanıt vermedi',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      setStatus({ status: 'disconnected', message: 'Bağlantı hatası' })
      if (showToast) {
        toast({
          title: 'Hata',
          description: error instanceof Error ? error.message : 'Bağlantı hatası oluştu',
          variant: 'destructive'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const t = Cookies.get('token') || ''
    setToken(t)
  }, [])

  useEffect(() => {
    if (!token) return

    // İlk kontrolü yap
    checkStatus(false)

    // Her 1 dakikada bir kontrol et
    const interval = setInterval(() => {
      checkStatus(false)
    }, 60000) // 60000ms = 1 dakika

    return () => clearInterval(interval)
  }, [token])

  const isConnected = status.status === 'connected'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full border w-10 h-10 transition-all ${isConnected
              ? 'border-green-600 dark:border-green-400'
              : 'border-gray-300 dark:border-gray-700'
              } ${loading ? 'animate-pulse' : ''}`}
            onClick={() => checkStatus(true)}
            disabled={loading}
          >
            {isConnected ? (
              <Plug2 className="h-5 w-5 text-green-600 dark:text-green-400 transition-colors" />
            ) : (
              <Unplug className="h-5 w-5 text-gray-400 dark:text-gray-600 transition-colors" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">
            {isConnected ? (
              <span className="text-green-600 dark:text-green-400 font-medium">✓ Connector: Bağlı</span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                ⚠ Connector: {status.message || 'Bağlantı yok'}
              </span>
            )}
          </p>
          <p className="text-[0.65rem] text-gray-400 mt-1">Tıklayarak yeniden kontrol edin</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
