import mongoose from 'mongoose'
const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    vodvideoId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User', // 和user关联
    },
    cover: {
      // 封面
      type: String,
      required: false,
    },
    commentCount: {
      // 评论数量
      type: Number,
      default: 0,
    },
    likeCount: {
      // 喜欢数量
      type: Number,
      default: 0,
    },
    dislikeCount: {
      // 不喜欢数量
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // 自动加 createdAt 和 updatedAt
  },
)

export { videoSchema }
