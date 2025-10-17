"use client"


import './box.css'
import { ChartPieSimple } from './dashboard/rapor1'
import { ChartPieInteractive } from './dashboard/rapor2'

export default function Home() {

  return (
    <div className='container relative px-0 py-4 flex flex-col gap-4'>
      <h1>Ana Sayfa</h1>
      <div className='grid grid-cols-1 lg:grid-cols-4'>
        <div><ChartPieSimple /></div>
        <div><ChartPieInteractive /></div>
        <div><ChartPieSimple /></div>
        <div><ChartPieSimple /></div>
      </div>

    </div>
  )
}
