import { Router } from 'express'
import multer from 'multer'
import {
  register,
  login,
  list,
  update,
  uploadAvatar,
} from '../controllers/userController.js'
import { validator } from '../middleware/validator/errorBack.js'
import {
  registerValidator,
  loginValidator,
  updateValidator,
} from '../middleware/validator/userValidator.js'
import { requireAuth } from '../utils/jwt.js'

const router = Router()
const upload = multer({ dest: 'uploads/images' }) // 文件存到uploads/images目录下

router
  .post('/register', validator(registerValidator), register)
  .post('/login', validator(loginValidator), login)
  .put('/update', requireAuth(), validator(updateValidator), update)
  .get('/list', requireAuth(), list)
  .post('/upload', requireAuth(), upload.single('avatar'), uploadAvatar) // avatar前端传的字段名

export default router
