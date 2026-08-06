import { Router } from 'express'
import multer from 'multer'
import {
  register,
  login,
  list,
  update,
  uploadAvatar,
  subscribe,
  unsubscribe,
  getUser,
  getSubscribe,
  getChannel,
  changePassword,
} from '../controllers/userController.js'
import { validator } from '../middleware/validator/errorBack.js'
import {
  registerValidator,
  loginValidator,
  updateValidator,
} from '../middleware/validator/userValidator.js'
import { requireAuth } from '../utils/jwt.js'

const router = Router()
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/images',
    limits: {
      fileSize: 1024 * 1024 * 5, // 限制文件大小为5MB
    },
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp']
      if (allowed.includes(file.mimetype)) return cb(null, true)
      cb(new Error('仅支持 jpg/png/webp 格式'))
    },
  }),
}) // 文件存到uploads/images目录下

router
  .post('/register', validator(registerValidator), register)
  .post('/login', validator(loginValidator), login)
  .put('/update', requireAuth(), validator(updateValidator), update)
  .put('/changePassword', requireAuth(), changePassword)
  .get('/list', requireAuth(), list)
  .post('/upload', requireAuth(), upload.single('avatar'), uploadAvatar) // avatar前端传的字段名
  .get('/subscribe', requireAuth(), subscribe) // 订阅 关注
  .get('/unsubscribe', requireAuth(), unsubscribe) // 取消订阅 关注
  .get('/getUser', requireAuth(false), getUser) // 获取频道
  .get('/getSubscribe', getSubscribe) // 获取关注列表，关注了哪些人,不登录也可以查看--某一个人的关注列表
  .get('/getChannel', getChannel) // 获取粉丝

export default router
