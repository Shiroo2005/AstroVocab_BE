import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { EntityError } from '~/core/error.response'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
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
