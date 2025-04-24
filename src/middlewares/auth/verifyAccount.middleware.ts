import { NextFunction, Request, Response } from 'express'
import { UserStatus } from '~/constants/userStatus'
import { BadRequestError } from '~/core/error.response'
import { User } from '~/entities/user.entity'
import { wrapRequestHandler } from '~/utils/handler'

const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.user as User

  if (status == UserStatus.NOT_VERIFIED)
    throw new BadRequestError('User was not verified, Please check verify in email!')

  next()
}

export const verifyAccountValidation = wrapRequestHandler(verifyAccount)
