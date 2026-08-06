import mongoose from 'mongoose'
const collectSchema = new mongoose.Schema(
  {
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

collectSchema.index({ user: 1, video: 1 }, { unique: true })

export { collectSchema }
