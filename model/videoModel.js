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
  },
  {
    timestamps: true, // 自动加 createdAt 和 updatedAt
  },
)

export { videoSchema }
