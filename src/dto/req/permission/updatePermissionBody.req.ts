import { Action, Resource } from '~/constants/access'

export interface UpdatePermissionBodyReq {
  resource: Resource
  action: Action
}
