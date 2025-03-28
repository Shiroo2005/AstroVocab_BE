import { Permission } from '~/entities/permission.entity'

export interface CreatePermissionBodyReq {
  roleId: number
  permissions: Permission[]
}
