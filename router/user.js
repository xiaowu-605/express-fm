import { Router } from 'express'
import { register } from '../controllers/userController.js'
import { validator } from '../middleware/validator/errorBack.js'
import { registerValidator } from '../middleware/validator/userValidator.js'
const router = Router()

router.post('/register', validator(registerValidator), register)

export default router
