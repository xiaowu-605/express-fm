import mongoose from 'mongoose'
import { userSchema } from './userModel.js'
import { videoSchema } from './videoModel.js'
import { subscribeSchema } from './subscribeModel.js'
import { videoCommentSchema } from './videoCommentModel.js'
import { videoLikeSchema } from './videoLikeModel.js'
import { collectSchema } from './collectModel.js'

// Model — 操作集合
export const User = mongoose.model('User', userSchema)
export const Video = mongoose.model('Video', videoSchema)
export const Subscribe = mongoose.model('Subscribe', subscribeSchema)
export const VideoComment = mongoose.model('VideoComment', videoCommentSchema)
export const VideoLike = mongoose.model('VideoLike', videoLikeSchema)
export const Collect = mongoose.model('Collect', collectSchema)
