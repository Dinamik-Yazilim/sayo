import { Organization } from "./Organization"

export interface Member {
  _id?: string
  organization?: Organization | null
  username?: string
  name?: string
  role?: string
  passive?: boolean
}

export function getRoleList() {
  return [
    { _id: 'user', name: 'Kullanıcı' },
    { _id: 'owner', name: 'Sahip' },
    { _id: 'purchase', name: 'Satın Alma' },
    { _id: 'sales', name: 'Satış' },
    { _id: 'admin', name: 'Yönetici' },
  ]
}


export function getAdminRoleList() {
  return [
    { _id: 'sysuser', name: 'Sistem Kullanıcısı' },
    { _id: 'sysadmin', name: 'Sistem Yöneticisi' },
  ]
}