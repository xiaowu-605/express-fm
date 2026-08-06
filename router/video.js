import multer from 'multer'
import { Router } from 'express'
import {
  // uploadVideo,
  createVideo,
  videoList,
  videoDetail,
  comment,
  commentList,
  delComment,
  likeVideo,
  likeVideoList,
  collect,
  getHots,
} from '../controllers/videoController.js'
import { getvod } from '../controllers/vodControll.js'
import { requireAuth } from '../utils/jwt.js'
import { videoValidator } from '../middleware/validator/videoValidator.js'
import { validator } from '../middleware/validator/errorBack.js'

const router = Router()
const upload = multer({
  storage: multer.diskStorage({ destination: 'uploads/videos/' }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    const allowed = ['video/mp4', 'video/quicktime', 'video/x-msvideo']
    if (allowed.includes(file.mimetype)) return cb(null, true)
    cb(new Error('仅支持 mp4/mov/avi 格式'))
  },
})

router
  // .post('/upload', requireAuth(), upload.single('video'), uploadVideo)
  .post('/getvod', requireAuth(), getvod)
  .post('/createVideo', requireAuth(), validator(videoValidator), createVideo)
  .get('/videoList', requireAuth(false), videoList)
  .get('/videoDetail', requireAuth(false), videoDetail)
  .post('/comment', requireAuth(), comment) // 提交评论
  .get('/commentList', requireAuth(), commentList) // 获取评论列表
  .delete('/delComment', requireAuth(), delComment) // 删除评论
  .post('/like', requireAuth(), likeVideo) // 喜欢视频
  .get('/likeVideoList', requireAuth(), likeVideoList) // 喜欢视频列表
  .post('/collect', requireAuth(), collect) // 收藏视频
  .get('/getHots', getHots) // 获取热门视频

export default router
