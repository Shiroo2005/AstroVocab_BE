import { WhereOptions } from 'sequelize'
import { Permission } from '~/entities/permission.entity'
import { unGetData } from '~/utils'

export const create = async (permissions: Permission[]) => {
  const transformedPermissions = permissions.map((permission) => {
    const { attributes, resource, action, possession } = permission
    return { attributes, resource, action, possession }
  })
  const createdPermission = await Permission.bulkCreate(transformedPermissions)
  return createdPermission
}

export const find = async ({
  condition,
  unGetFields,
  isRaw = true
}: {
  condition: WhereOptions
  status?: string
  unGetFields?: string[]
  isRaw?: boolean
}) => {
  const foundPermissions = await Permission.findAll({
    where: {
      ...condition
    },
    raw: isRaw
  })

  if (!foundPermissions) return null

  return foundPermissions.map((permission) => {
    return unGetData({ fields: unGetFields, object: permission })
  })
}
