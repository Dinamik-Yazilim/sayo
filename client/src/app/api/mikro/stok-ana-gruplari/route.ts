import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get('session')?.value

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // MikroERP SQL query
    const query = `
      SELECT 
        san_kod as kod,
        san_isim as isim
      FROM STOK_ANA_GRUPLARI
      WHERE san_iptal = 0
      ORDER BY san_kod
    `

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mikro/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `session=${session}`
      },
      body: JSON.stringify({ query })
    })

    if (!response.ok) {
      throw new Error('MikroERP API error')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Stok ana grupları error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
