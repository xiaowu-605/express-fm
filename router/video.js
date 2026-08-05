import multer from 'multer'
import { Router } from 'express'
import {
  uploadVideo,
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
const upload = multer({ dest: 'uploads/videos' })

router
  .post('/upload', requireAuth(), upload.single('video'), uploadVideo)
  .post('/getvod', requireAuth(), getvod)
  .post('/createVideo', requireAuth(), validator(videoValidator), createVideo)
  .get('/videoList', requireAuth(false), videoList)
  .get('/videoDetail', requireAuth(false), videoDetail)
  .post('/comment', requireAuth(), comment) // 提交评论
  .get('/commentList', requireAuth(), commentList) // 获取评论列表
  .delete('/delComment', requireAuth(), delComment) // 删除评论
  .get('/like', requireAuth(), likeVideo) // 喜欢视频
  .get('/likeVideoList', requireAuth(), likeVideoList) // 喜欢视频列表
  .get('/collect', requireAuth(), collect) // 收藏视频
  .get('/getHots', getHots) // 获取热门视频

export default router
