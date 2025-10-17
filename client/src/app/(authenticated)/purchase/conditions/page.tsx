"use client"

import { useEffect, useState } from 'react'
import { getItem, getList, postItem, putItem } from '@/lib/fetch'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { useToast } from '@/components/ui/use-toast'
import { TsnSelect } from '@/components/ui216/tsn-select'

import { StandartForm } from '@/components/ui216/standart-form'
import { TsnInput } from '@/components/ui216/tsn-input'
import { Label } from '@/components/ui/label'
import { TsnPanel } from '@/components/ui216/tsn-panel'
import { PackageCheckIcon, TruckIcon, Users2Icon } from 'lucide-react'
import { getRoleList, Member } from '@/types/Member'
import { ListGrid } from '@/components/ui216/list-grid'
import { TsnGrid } from '@/components/ui216/tsn-grid'
import { moneyFormat, startOfLastMonth, today } from '@/lib/utils'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { PurchaseConditionHeader, purchaseConditionListQuery, PurchaseConditionListQueryProps } from '@/types/PurchaseConditions'


export default function PurchaseConditionsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [filter, setFilter] = useState<PurchaseConditionListQueryProps>({ startDate: startOfLastMonth(), endDate: today() })

  return (
    <TsnGrid
      query={purchaseConditionListQuery(filter)}
      options={{ showAddNew: true, showEdit: true, showDelete: true, showSearch: true, type: 'Update' }}
      title="Satın Alma Şartları"
      icon=<TruckIcon />
      onFilterPanel={() => {
        return (<div className='flex flex-col gap-1'>
          <TsnInput type='date' title="Başlangıç Tarihi" defaultValue={filter.startDate} onBlur={e => setFilter({ ...filter, startDate: e.target.value })} />
          <TsnInput type='date' title="Bitiş Tarihi" defaultValue={filter.endDate} onBlur={e => setFilter({ ...filter, endDate: e.target.value })} />
          <TsnSelectRemote all title="Depo" itemClassName='capitalize' value={filter.warehouseId} onValueChange={e => setFilter({ ...filter, warehouseId: e })} query={`SELECT dep_no as _id, CAST(dep_no as VARCHAR(10)) + ' - ' + dep_adi as [name], * FROM DEPOLAR WHERE dep_envanter_harici_fl=0 ORDER BY dep_no`} />
        </div>)
      }}
      onHeaderPaint={() => <>
        <div className='grid grid-cols-9 w-full gap-2'>
          <div className=''>Tarih/Sipariş No</div>
          <div className=''>Başlangıç/Bitiş</div>
          <div className='col-span-3'>Firma</div>
          <div className='text-end me-2'>Tutar</div>
          <div className='text-end me-3'>Satır Sayısı</div>
          <div className=''>Depo</div>
        </div>
      </>}
      onRowPaint={(e: PurchaseConditionHeader, colIndex) =>
        <div className='grid grid-cols-9 w-full items-center gap-2'>
          <div className='flex flex-col gap-1 items-start'>
            <div>{new Date(e.issueDate || '').toLocaleDateString()}</div>
            <div className='text-xs py-[2px] px-[5px] rounded bg-indigo-700 text-white'>{e.docNoSerial ? e.docNoSerial + '-' : ''}{e.docNoSequence}</div>

          </div>
          <div className='flex flex-col gap-1 items-start'>
            <div>{new Date(e.startDate || '').toLocaleDateString()}</div>
            {(e.endDate || '') > '1900-01-01' && <div>{new Date(e.endDate || '').toLocaleDateString()}</div>}
            {(e.endDate || '') < '1900-01-01' && <div>-</div>}
          </div>
          <div className='col-span-3 flex flex-col gap-1 items-start'>
            <div className='capitalize'>{e.firm?.toLowerCase()}</div>

          </div>
          <div className='flex flex-col items-end'>
            {moneyFormat(e.amount)}
          </div>
          <div className='flex flex-col items-end'>
            {e.lineCount}
          </div>
          <div className='ms-4'>
            {e.warehouse && <div className='capitalize'>{e.warehouse?.toLowerCase()}</div>}
            {!e.warehouse && <div>Genel</div>}
          </div>

        </div>
      }
    />
  )
}
