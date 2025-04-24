import { Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

export class SuccessResponse {
  message: string
  statusCode: number
  metaData: object

  constructor({
    message = getReasonPhrase(200),
    statusCode = StatusCodes.OK,
    metaData = {}
  }: {
    message?: string
    statusCode?: number
    metaData?: object | void
  }) {
    this.message = message
    this.statusCode = statusCode
    this.metaData = metaData
  }

  send(res: Response) {
    res.status(this.statusCode).json(this)
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message = getReasonPhrase(201),
    metaData = {}
  }: {
    message?: string
    metaData?: object
    options?: object
  }) {
    super({ message, statusCode: StatusCodes.CREATED, metaData })
  }
}
