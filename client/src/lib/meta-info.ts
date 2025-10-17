import { Metadata } from 'next/types'

export function pageMeta(title: string, description?: string) {
  const metadata: Metadata = {
    title: ` ${title} - ${process.env.NEXT_PUBLIC_APP_TITLE || 'ENV ERROR'}`,
    description: `${description || process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'ENV Error'}`,
  }
  return metadata
}