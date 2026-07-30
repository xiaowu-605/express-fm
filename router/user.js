import { Router } from 'express'
import { register, login, list } from '../controllers/userController.js'
import { validator } from '../middleware/validator/errorBack.js'
import {
  registerValidator,
  loginValidator,
} from '../middleware/validator/userValidator.js'
import { requireAuth } from '../utils/jwt.js'

const router = Router()

router
  .post('/register', validator(registerValidator), register)
  .post('/login', validator(loginValidator), login)
  .get('/list', requireAuth, list)

export default router
