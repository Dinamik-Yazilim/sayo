import { cookies } from 'next/headers'

export function getAuthToken() {
  const token = cookies().get('token')?.value || ''
  return token
}

const PERSIST_COOKIES = ['deviceId', 'theme', 'lang']
export function authSignOut() {
  cookies().delete('token')
  cookies().delete('user')
  cookies().getAll().forEach(c => {
    if (!PERSIST_COOKIES.includes(c.name)) {
      cookies().delete(c.name)
    }
  })
}