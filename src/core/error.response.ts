import status from 'http-status'

export class ErrorResponse extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message: string = status[400], statusCode: number = status.BAD_REQUEST) {
    super(message, statusCode)
  }
}

export class AuthRequestError extends ErrorResponse {
  constructor(message: string = status[401], statusCode: number = status.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

export class NotFoundRequestError extends ErrorResponse {
  constructor(message: string = status[404], statusCode: number = status.NOT_FOUND) {
    super(message, statusCode)
  }
}

export class ForbiddenRequestError extends ErrorResponse {
  constructor(message: string = status[403], statusCode: number = status.FORBIDDEN) {
    super(message, statusCode)
  }
}

export class EntityError extends ErrorResponse {
  errors: object[]
  constructor({
    message = 'Validate error',
    statusCode = status.BAD_REQUEST,
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
