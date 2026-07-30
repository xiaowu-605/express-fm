import mongoose from 'mongoose'
import bcrypt from 'bcryptjs' // 加密

// 定义数据--用户
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // unique = 自动建唯一索引
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    // createAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updateAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true, // 自动加 createdAt 和 updatedAt
  },
)
// 密码加密 不能用箭头函数，this指向不对
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})
export { userSchema }
