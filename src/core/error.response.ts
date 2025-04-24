import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export class ErrorResponse extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message: string = getReasonPhrase(400), statusCode: number = StatusCodes.BAD_REQUEST) {
    super(message, statusCode)
  }
}

export class AuthRequestError extends ErrorResponse {
  constructor(message: string = getReasonPhrase(401), statusCode: number = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

export class NotFoundRequestError extends ErrorResponse {
  constructor(message: string = getReasonPhrase(404), statusCode: number = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

export class ForbiddenRequestError extends ErrorResponse {
  constructor(message: string = getReasonPhrase(403), statusCode: number = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

export class EntityError extends ErrorResponse {
  errors: object[]
  constructor({
    message = 'Validate error',
    statusCode = StatusCodes.BAD_REQUEST,
    errors
  }: {
    message?: string
    statusCode?: number
    errors: object[]
  }) {
    super(message, statusCode)
    this.errors = errors
  }
}
