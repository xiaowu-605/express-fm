import mongoose from 'mongoose'
const videoLikeSchema = new mongoose.Schema(
  {
    like: {
      type: Number,
      enum: [1, -1],
      required: true,
    },
    video: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'Video', // 和Video关联
    },
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User', // 和user关联
    },
  },
  {
    timestamps: true, // 自动加 createdAt 和 updatedAt
  },
)

export { videoLikeSchema }
