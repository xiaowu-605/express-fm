import mongoose from 'mongoose'
const subscribeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      required: true,
      ref: 'User', // 和user关联
    },
    channle: {
      // 关注的人
      type: mongoose.ObjectId,
      required: true,
      ref: 'User', // 和user关联
    },
  },
  {
    timestamps: true, // 自动加 createdAt 和 updatedAt
  },
)
subscribeSchema.index({ user: 1, channle: 1 }, { unique: true })
export { subscribeSchema }
