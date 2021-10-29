export { AuthenticationService } from './auth.service'
export { ErrorHandler, ValidationErrorHandler } from './error.service'

export type Service = {
  validation: import('express-validator').ValidationChain[]
  main: import('express').Handler
  middleware: import('express').Handler
}
