import multer from 'multer'
import { Router } from 'express'
import { uploadVideo, createVideo } from '../controllers/videoController.js'
import { getvod } from '../controllers/vodControll.js'
import { requireAuth } from '../utils/jwt.js'
import { videoValidator } from '../middleware/validator/videoValidator.js'
import { validator } from '../middleware/validator/errorBack.js'

const router = Router()
const upload = multer({ dest: 'uploads/videos' })

router
  .post('/upload', requireAuth, upload.single('video'), uploadVideo)
  .post('/getvod', requireAuth, getvod)
  .post('/createVideo', requireAuth, validator(videoValidator), createVideo)

export default router
