import { Router } from 'express'
import { EnterUser, ValidationErrorHandler } from './services'
import { auth } from './middlewares'
const router = Router()

router.post(
  '/enter',
  EnterUser.validation,
  ValidationErrorHandler,
  EnterUser.main
)
router.get('/', auth, (req, res) => res.send(JSON.stringify(req.user)))

export default router
