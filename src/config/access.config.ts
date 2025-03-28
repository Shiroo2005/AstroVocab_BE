import { AccessControl } from 'accesscontrol'
import { Resource, RoleName } from '~/constants/access'

const ac = new AccessControl()

ac.grant(RoleName.USER)

ac.grant(RoleName.ADMIN)
  .extend([RoleName.USER])
  .createAny(Resource.ROLE)
  .readAny(Resource.ROLE)
  .updateAny(Resource.ROLE)
  .deleteAny(Resource.ROLE)

export default ac
