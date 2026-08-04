import mongoose from 'mongoose'
import { userSchema } from './userModel.js'
import { videoSchema } from './videoModel.js'
import { subscribeSchema } from './subscribeModel.js'
import { videoCommentSchema } from './videoCommentModel.js'
import { videoLikeSchema } from './videoLikeModel.js'

async function main() {
  await mongoose.connect(process.env.DB_URL)
}
main()
  .then((res) => {
    console.log('mongodb连接成功')
  })
  .catch((err) => {
    console.log('mongodb连接失败:', err)
  })

// Model — 操作集合
export const User = mongoose.model('User', userSchema)
export const Video = mongoose.model('Video', videoSchema)
export const Subscribe = mongoose.model('Subscribe', subscribeSchema)
export const VideoComment = mongoose.model('VideoComment', videoCommentSchema)
export const VideoLike = mongoose.model('VideoLike', videoLikeSchema)
