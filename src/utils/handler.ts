import { RequestHandler, Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { EntityError, ErrorResponse, NotFoundRequestError } from '~/core/error.response'

// Transform to async await for controller
export const wrapRequestHandler = <P = any>(handler: RequestHandler<P>) => {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

//Handle Error for all project
export const errorHandler: ErrorRequestHandler = (
  err: ErrorResponse | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof EntityError) {
    const statusCode = err.statusCode
    res.status(statusCode).json({
      message: 'Middleware error',
      statusCode: StatusCodes.BAD_REQUEST,
      err: err.errors
    })
    return
  }

  // // if validate error in db
  // if (err instanceof ValidationError) {
  //   const errorFields = convertValidateErr(err)
  //   res.status(status.BAD_REQUEST).json({
  //     message: 'Validate Error DB',
  //     statusCode: status.BAD_REQUEST,
  //     err: errorFields
  //   })
  //   return
  // }

  const statusCode = err instanceof ErrorResponse ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || 'Internal Server Error'
  res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: message
  })
  return
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundRequestError()
}
