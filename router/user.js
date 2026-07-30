import { Router } from 'express'
import { register, login } from '../controllers/userController.js'
import { validator } from '../middleware/validator/errorBack.js'
import {
  registerValidator,
  loginValidator,
} from '../middleware/validator/userValidator.js'
const router = Router()

router
  .post('/register', validator(registerValidator), register)
  .post('/login', validator(loginValidator), login)

export default router
