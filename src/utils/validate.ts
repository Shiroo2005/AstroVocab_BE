import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { BadRequestError, EntityError } from '~/core/error.response'

// can be reused by many routes
export const validateSchema = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    await validation.run(req)
    const result = validationResult(req)

    const errorObjects = result.mapped()
    const entityError = new EntityError({ errors: [] })
    for (const key in errorObjects) {
      entityError.errors.push(errorObjects[key])
    }

    if (!result.isEmpty()) {
      next(entityError)
    }

    next()
  }
}

export const validateClass = async (obj: object) => {
  const err = await validate(obj)

  console.log('?>>>>>>>>>>>>>>>>>>>>>>>>', err)

  if (err && err.length > 0) {
    throw new BadRequestError(`Validate ${obj.constructor.name} in DB error!`)
  }
}
