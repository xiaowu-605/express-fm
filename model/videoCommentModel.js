import mongoose from 'mongoose'
const videoCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
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

videoCommentSchema.index({ video: 1, createdAt: -1 })

export { videoCommentSchema }
