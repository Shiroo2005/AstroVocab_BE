import { Permission } from '~/entities/permission.entity'

export interface CreatePermissionBodyReq {
  action: string
  resource: string
}
