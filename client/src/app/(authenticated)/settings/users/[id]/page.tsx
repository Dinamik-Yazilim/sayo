"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { getItem, postItem, putItem } from "@/lib/fetch"
import { getRoleList, Member } from "@/types/Member"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnSwitch } from "@/components/ui216/tsn-switch"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { TsnSelect } from "@/components/ui216/tsn-select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Warehouse } from "lucide-react"
import { getDepolarMagazalar } from "@/mikroerp"

interface Depo {
  dep_no: number
  dep_adi: string
  dep_tipi: number
}

interface Props {
  params: { id: string }
}

export default function UserEditPage({ params }: Props) {
  const [token, setToken] = useState('')
  const [db, setDb] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [depoLoading, setDepoLoading] = useState(false)
  const router = useRouter()
  const [member, setMember] = useState<Member>()
  const [depolar, setDepolar] = useState<Depo[]>([])
  const [yetkiliDepoNos, setYetkiliDepoNos] = useState<number[]>([])

  const loadDepolar = async () => {
    try {
      setDepoLoading(true)
      const data = await postItem('/mikro/depolar', token, { query: getDepolarMagazalar() })
      setDepolar(data || [])
    } catch (err) {
      console.error('Depolar yüklenirken hata:', err)
    } finally {
      setDepoLoading(false)
    }
  }

  const load = () => {
    setLoading(true)
    getItem(`/members/${params.id}`, token)
      .then(result => {
        console.log(result)
        const memberData = result as Member
        setMember(memberData)

        // Session db'ye göre yetkili depoları bul
        if (db && memberData.depoYetkileri) {
          const dbYetki = memberData.depoYetkileri.find(y => y.db === db)
          setYetkiliDepoNos(dbYetki ? dbYetki.depoNos : [])
        }
      })
      .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
      .finally(() => setLoading(false))
  }

  const handleDepoToggle = (depoNo: number, checked: boolean) => {
    let newYetkiliDepoNos: number[]

    if (checked) {
      newYetkiliDepoNos = [...yetkiliDepoNos, depoNo]
    } else {
      newYetkiliDepoNos = yetkiliDepoNos.filter(d => d !== depoNo)
    }

    setYetkiliDepoNos(newYetkiliDepoNos)
  }

  const save = () => {
    // depoYetkileri güncelle
    let depoYetkileri = member?.depoYetkileri || []

    if (db) {
      // Mevcut db kaydını bul veya oluştur
      const existingIndex = depoYetkileri.findIndex(y => y.db === db)

      if (yetkiliDepoNos.length > 0) {
        if (existingIndex >= 0) {
          depoYetkileri[existingIndex].depoNos = yetkiliDepoNos
        } else {
          depoYetkileri.push({ db, depoNos: yetkiliDepoNos })
        }
      } else {
        // Yetkisi yoksa kaldır
        if (existingIndex >= 0) {
          depoYetkileri.splice(existingIndex, 1)
        }
      }
    }

    const updatedMember = { ...member, depoYetkileri }

    if (!member?._id) {
      postItem(`/members`, token, updatedMember)
        .then(result => router.back())
        .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
    } else {
      putItem(`/members/${member?._id}`, token, updatedMember)
        .then(result => router.back())
        .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
    }
  }

  useEffect(() => {
    if (!token) {
      setToken(Cookies.get('token') || '')
      setDb(Cookies.get('db') || '')
    }
  }, [])

  useEffect(() => {
    if (token) {
      if (params.id != 'addnew') {
        load()
      }
      loadDepolar()
    }
  }, [token])

  return (<StandartForm
    title={params.id == 'addnew' ? 'Yeni Kullanıcı' : 'Kullanıcıyı Düzenle'}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}
  >
    <TsnInput title='Kullanıcı Adı' defaultValue={member?.username} onBlur={e => setMember({ ...member, username: e.target.value })} />
    <TsnInput title='Ad Soyad' defaultValue={member?.name} onBlur={e => setMember({ ...member, name: e.target.value })} />
    <TsnSelect title='Rol' list={getRoleList()} value={member?.role} onValueChange={e => setMember({ ...member, role: e })} />
    <TsnSwitch title='Pasif mi?' defaultChecked={member?.passive} onCheckedChange={e => setMember({ ...member, passive: e })} />

    {/* Depo Yetkileri */}
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Warehouse className="h-5 w-5" />
          Depo Yetkileri
        </CardTitle>
        <CardDescription>
          Kullanıcının erişebileceği mağaza/depoları seçin ({db})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tüm Depolar Yetkisi */}
        <div className="flex items-center justify-between p-3 mb-3 bg-muted rounded-md">
          <Label htmlFor="tumDepoYetkisi" className="font-semibold">
            Tüm Depolar için Yetki
          </Label>
          <Switch
            id="tumDepoYetkisi"
            checked={member?.tumDepoYetkisi || false}
            onCheckedChange={e => setMember({ ...member, tumDepoYetkisi: e })}
          />
        </div>

        {/* Depo Listesi */}
        {!member?.tumDepoYetkisi && (
          <div className="space-y-2">
            {depoLoading ? (
              <div className="text-center py-4 text-muted-foreground">Depolar yükleniyor...</div>
            ) : depolar.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">Depo bulunamadı</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {depolar.map((depo) => (
                  <div
                    key={depo.dep_no}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        Depo {depo.dep_no} - {depo.dep_adi}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Tip: {depo.dep_tipi}
                      </div>
                    </div>
                    <Switch
                      checked={yetkiliDepoNos.includes(depo.dep_no)}
                      onCheckedChange={(checked) => handleDepoToggle(depo.dep_no, checked)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  </StandartForm>)
}
