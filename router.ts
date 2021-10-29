import { Router } from 'express'
import { AuthenticationService, ValidationErrorHandler } from './services'
const router = Router()

router.post(
  '/enter',
  AuthenticationService.validation,
  ValidationErrorHandler,
  AuthenticationService.main
)
router.get('/', AuthenticationService.middleware, (req, res) =>
  res.send(JSON.stringify(req.user))
)

export default router
