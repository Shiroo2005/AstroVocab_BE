export interface CreateRoleBodyReq {
  name: string
  description?: string
  permissionIds?: number[]
}
