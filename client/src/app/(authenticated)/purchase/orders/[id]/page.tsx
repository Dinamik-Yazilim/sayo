"use client"

import { useToast } from "@/components/ui/use-toast"
import { StandartForm } from "@/components/ui216/standart-form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { postItem, putItem } from "@/lib/fetch"
import { TsnInput } from "@/components/ui216/tsn-input"
import { TsnPanel } from "@/components/ui216/tsn-panel"
import { moneyFormat, today } from "@/lib/utils"
import { TsnGridButtonDelete } from "@/components/ui216/tsn-grid"
import { OrderDetail, orderDetailQuery, OrderHeader, orderHeaderQuery, saveOrder } from "@/types/Order"
import { ChefHatIcon, EditIcon, PlusSquareIcon } from "lucide-react"

import { TsnLineGrid } from "@/components/ui216/tsn-line-grid"
import { OrderLineDialog } from "./order-line-dialog"
import { SelectFirm } from "@/app/(authenticated)/(components)/select-firm"
import { ButtonSelect } from "@/components/icon-buttons"
import { Label } from "@/components/ui/label"
import { SelectWarehouse } from "@/app/(authenticated)/(components)/select-warehouse"
import { SelectResponsibility } from "@/app/(authenticated)/(components)/select-responsibility"
import { SelectPaymentPlan } from "@/app/(authenticated)/(components)/select-paymentPlan"
import { SelectProject } from "@/app/(authenticated)/(components)/select-project"
import { SelectSalesperson } from "@/app/(authenticated)/(components)/select-salesperson"

interface Props {
  params: { id: string }
}

export default function OrderPage({ params }: Props) {
  const ioType = 1
  const [token, setToken] = useState('')
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [orderHeader, setOrderHeader] = useState<OrderHeader>({
    issueDate: today(),
    ioType: 1,
    documentDate: today(),
    docNoSequence: 0
  })
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])

  const load = () => {
    setLoading(true)
    postItem(`/mikro/get`, token, { query: orderHeaderQuery(params.id, ioType) })
      .then(result => {
        setOrderHeader(result[0] as OrderHeader)
        postItem(`/mikro/get`, token, { query: orderDetailQuery(params.id, ioType) })
          .then(result => {
            setOrderDetails(result as OrderDetail[])
          })
          .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
          .finally(() => setLoading(false))
      })
      .catch(err => {
        toast({ title: 'Hata', description: err || '', variant: 'destructive' })
        setLoading(false)
      })
  }


  const save = () => {
    saveOrder(token, orderHeader, orderDetails)
      .then(() => {
        toast({ title: '🙂 Başarılı', description: 'Belge başarıyla kaydedildi', duration: 800 })
        setTimeout(() => router.back(), 1000)
      })
      .catch(err => toast({ title: 'Hata', description: err || '', variant: 'destructive' }))
  }

  const deleteLine = (rowIndex: number) => {
    // let l = orderDetails
    // l.splice(rowIndex, 1)
    // setOrderDetails(l.map(e => e))
    const l = orderDetails.map((e, index) => {
      if (index == rowIndex) e.deleted = true
      return e
    })
    setOrderDetails(l)
    calcTotals(l)
  }

  const OrderCurrency = () => <span className='text-xs text-muted-foreground'>{orderHeader.currency}</span>

  const FormHeader = () => {
    return (<TsnPanel name="porder_Header" defaultOpen={true} className="mt-4" trigger="Başlık" contentClassName="grid grid-cols-1 lg:grid-cols-6 gap-2 w-full">
      <div className="col-span-1 lg:col-span-6 grid grid-cols-1 lg:grid-cols-5 w-full items-center gap-2">
        <TsnInput title="Doküman Serisi" defaultValue={orderHeader.docNoSerial}
          onBlur={e => setOrderHeader({ ...orderHeader, docNoSerial: e.target.value })}
          disabled={params.id != 'addnew'}
        />
        <TsnInput type='number' min={0} title="Doküman Sırası" defaultValue={orderHeader.docNoSequence}
          disabled
        />
        <TsnInput type='date' title="Tarih" defaultValue={orderHeader.issueDate?.substring(0, 10)}
          onBlur={e => setOrderHeader({ ...orderHeader, issueDate: e.target.value })} />
        <TsnInput title="Doküman Numarası" defaultValue={orderHeader.documentNumber}
          onBlur={e => setOrderHeader({ ...orderHeader, documentNumber: e.target.value })} />
        <TsnInput type='date' title="Doküman Tarihi" defaultValue={orderHeader.issueDate?.substring(0, 10)}
          onBlur={e => setOrderHeader({ ...orderHeader, documentDate: e.target.value })} />
      </div>
      <div className="col-span-4 lg:col-span-4 w-full p-2 pe-4 flex items-start justify-between  border rounded-md border-dashed">
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground">Tedarikçi Firma</Label>
          <div className="capitalize">{orderHeader.firm?.toLowerCase()}</div>
        </div>
        <SelectFirm onSelect={e => {
          setOrderHeader({ ...orderHeader, firmId: e._id, firm: e.name })
        }} ><ButtonSelect /></SelectFirm>

      </div>
      <div className="col-span-2 lg:col-span-2 w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
        <div className="flex flex-col gap-1">
          <Label className="text-muted-foreground">Depo</Label>
          <div className="capitalize">{orderHeader.warehouse}</div>
        </div>
        <SelectWarehouse onSelect={e => {
          setOrderHeader({ ...orderHeader, warehouseId: e._id, warehouse: e.name })
        }} ><ButtonSelect /></SelectWarehouse>

      </div>

      <div className="col-span-1 lg:col-span-6 grid grid-cols-1 lg:grid-cols-4 justify-between gap-2">
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">Ödeme Planı</Label>
            <div className="capitalize">{orderHeader.paymentPlan}</div>
          </div>
          <SelectPaymentPlan onSelect={e => { setOrderHeader({ ...orderHeader, paymentPlanId: e._id, paymentPlan: e.name }) }} ><ButtonSelect /></SelectPaymentPlan>

        </div>
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">Proje</Label>
            <div className="capitalize">{orderHeader.project}</div>
          </div>
          <SelectProject onSelect={e => { setOrderHeader({ ...orderHeader, projectId: e._id, project: e.name }) }} ><ButtonSelect /></SelectProject>

        </div>
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">Sorumluluk Merkezi</Label>
            <div className="capitalize">{orderHeader.responsibility}</div>
          </div>
          <SelectResponsibility onSelect={e => { setOrderHeader({ ...orderHeader, responsibilityId: e._id, responsibility: e.name }) }} ><ButtonSelect /></SelectResponsibility>

        </div>
        <div className="w-full flex justify-between p-2 pe-4 items-start  border rounded-md border-dashed">
          <div className="flex flex-col gap-1">
            <Label className="text-muted-foreground">Satış Temsilcisi</Label>
            <div className="capitalize">{orderHeader.salesperson}</div>
          </div>
          <SelectSalesperson onSelect={e => { setOrderHeader({ ...orderHeader, salespersonId: e._id, salesperson: e.name }) }} ><ButtonSelect /></SelectSalesperson>

        </div>
      </div>
    </TsnPanel>)
  }

  const FormDetail = () => {
    return (<TsnPanel name="porder_Detail" defaultOpen={true} className="mt-4" trigger="Satırlar" contentClassName="relative grid grid-cols-1gap-2 w-full">
      <TsnLineGrid
        list={orderDetails}
        onHeaderPaint={() =>
          <div className="flex  w-full gap-2">
            <div className="text-xs text-nowrap mt-2 text-muted-foreground">#</div>
            <div className="grid grid-cols-8 gap-1 w-full items-center">
              <div className="col-span-2">Ürün</div>
              <div className="text-end">Miktar</div>
              <div className="text-end">Fiyat</div>
              <div className="text-end">Tutar</div>
              <div className="text-center">İndirimler</div>
              <div className="text-end">KDV</div>
              <div className="text-end">Net Toplam</div>
            </div>
            <div className='w-20 p-1 flex justify-end lg:justify-end'>
              <OrderLineDialog ioType={1} orderDetails={orderDetails} setOrderDetails={e => {
                setOrderDetails(e)

              }} rowIndex={-1} >
                <div className="cursor-pointer bg-green-600 px-[5px] py-[4px] text-white rounded-md" ><PlusSquareIcon width={'24px'} /></div>
              </OrderLineDialog>
            </div>
          </div>
        }
        onRowPaint={(e: OrderDetail, rowIndex) => <>
          {!e.deleted &&
            <div key={'line' + rowIndex} className="flex  w-full gap-2 items-center">
              <div className="text-xs text-nowrap mt-2 text-muted-foreground">#{rowIndex + 1}</div>
              <div className="grid grid-cols-8 gap-1 w-full items-center">
                <div className="col-span-2 flex flex-col">
                  <div className="capitalize">{e.item?.toLowerCase()}</div>
                  <div className="text-xs text-muted-foreground">{e.barcode}</div>
                </div>
                <div className='flex flex-col items-end'>
                  <div className="flex items-center gap-[3px]">{e.quantity}  <span className='text-xs text-muted-foreground capitalize'>{e.unit?.toLowerCase()}</span></div>
                  <div className='text-muted-foreground text-xs'>{e.delivered}/{e.remainder}</div>
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  {moneyFormat(e.price)}<span className='text-xs text-muted-foreground ms-1'>{orderHeader.currency}</span>
                </div>
                <div className='flex flex-col gap-1 items-end'>
                  <div className='flex items-center gap-[3px]'>{moneyFormat(e.amount)} <span className='text-xs text-muted-foreground'>{orderHeader.currency}</span></div>

                </div>
                <div className='grid grid-cols-3 text-end justify-end px-2 text-xs text-muted-foreground'>
                  {e.discountRate1! > 0 && <div>%{e.discountRate1} </div>}
                  {e.discountRate2! > 0 && <div>%{e.discountRate2} </div>}
                  {e.discountRate3! > 0 && <div>%{e.discountRate3} </div>}
                  {e.discountRate4! > 0 && <div>%{e.discountRate4} </div>}
                  {e.discountRate5! > 0 && <div>%{e.discountRate5} </div>}
                  {e.discountRate6! > 0 && <div>%{e.discountRate6} </div>}
                </div>
                <div className='flex items-center justify-end gap-[3px]'>
                  {moneyFormat(e.vatAmount)}<span className='text-xs text-muted-foreground ms-1'>{orderHeader.currency}</span>
                </div>
                <div className='flex items-center justify-end gap-[3px]'>{moneyFormat(e.lineNetTotal)}<span className='text-xs text-muted-foreground ms-1'>{orderHeader.currency}</span></div>

              </div>
              <div className='w-20 flex flex-row items-end justify-end mx-2 gap-2'>

                <OrderLineDialog ioType={1} orderDetails={orderDetails} setOrderDetails={e => {
                  setOrderDetails(e)
                  calcTotals(e)
                }} rowIndex={rowIndex} >
                  <div className="cursor-pointer bg-indigo-600 text-white px-[5px] py-[4px] rounded-md" ><EditIcon width={'20px'} /></div>
                </OrderLineDialog>
                <TsnGridButtonDelete title={'Satırı sil?'} onOk={() => deleteLine(rowIndex)} />
              </div>
            </div>
          }
        </>}

      />

    </TsnPanel>)
  }

  const FormFooter = () => {
    return (<TsnPanel name="porder_Footer" defaultOpen={true} className="mt-4" trigger="Toplamlar" contentClassName="grid grid-cols-1 lg:grid-cols-4 gap-2 w-full">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2">
          <div>Satır Toplamı</div>
          <div className="text-end">{moneyFormat(orderHeader.amount)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>İndirim Toplamı</div>
          <div className="text-end">{moneyFormat(orderHeader.discountAmount1! + orderHeader.discountAmount2! + orderHeader.discountAmount3! + orderHeader.discountAmount4! + orderHeader.discountAmount5! + orderHeader.discountAmount6!)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>Brüt Toplam</div>
          <div className="text-end">{moneyFormat(orderHeader.grossTotal)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>KDV</div>
          <div className="text-end">{moneyFormat(orderHeader.vatAmount)} <OrderCurrency /></div>
        </div>
        <div className="grid grid-cols-2">
          <div>Net Toplam</div>
          <div className="text-end">{moneyFormat(orderHeader.netTotal)} <OrderCurrency /></div>
        </div>
      </div>
    </TsnPanel>)
  }

  const calcTotals = (orderDetails: OrderDetail[]) => {
    orderHeader.amount = 0
    orderHeader.vatAmount = 0
    orderHeader.discountAmount1 = 0
    orderHeader.discountAmount2 = 0
    orderHeader.discountAmount3 = 0
    orderHeader.discountAmount4 = 0
    orderHeader.discountAmount5 = 0
    orderHeader.discountAmount6 = 0
    orderHeader.expenseAmount1 = 0
    orderHeader.expenseAmount2 = 0
    orderHeader.expenseAmount3 = 0
    orderHeader.expenseAmount4 = 0
    orderDetails.forEach(e => {
      if (!e.deleted) {
        orderHeader.amount! += e.amount || 0
        orderHeader.vatAmount! += e.vatAmount || 0
        orderHeader.discountAmount1! += e.discountAmount1 || 0
        orderHeader.discountAmount2! += e.discountAmount2 || 0
        orderHeader.discountAmount3! += e.discountAmount3 || 0
        orderHeader.discountAmount4! += e.discountAmount4 || 0
        orderHeader.discountAmount5! += e.discountAmount5 || 0
        orderHeader.discountAmount6! += e.discountAmount6 || 0
        orderHeader.expenseAmount1! += e.expenseAmount1 || 0
        orderHeader.expenseAmount2! += e.expenseAmount2 || 0
        orderHeader.expenseAmount3! += e.expenseAmount3 || 0
        orderHeader.expenseAmount4! += e.expenseAmount4 || 0
      }
    })
    orderHeader.grossTotal = orderHeader.amount - (orderHeader.discountAmount1 + orderHeader.discountAmount2 + orderHeader.discountAmount3 + orderHeader.discountAmount4 + orderHeader.discountAmount5 + orderHeader.discountAmount6)
      + (orderHeader.expenseAmount1 + orderHeader.expenseAmount2 + orderHeader.expenseAmount3 + orderHeader.expenseAmount4)
    orderHeader.netTotal = orderHeader.grossTotal + orderHeader.vatAmount

  }

  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  useEffect(() => { token && params.id != 'addnew' && load() }, [token])
  useEffect(() => orderHeader && calcTotals(orderDetails), [orderDetails])
  return (<StandartForm
    title={params.id == 'addnew' ? 'Yeni Sipariş' : 'Sipariş Düzenle'}
    onSaveClick={save}
    onCancelClick={() => router.back()}
    loading={loading}

  >
    <div className="relative w-full h-full">
      {FormHeader()}
      {FormDetail()}
      {FormFooter()}
    </div>

  </StandartForm>)
}

