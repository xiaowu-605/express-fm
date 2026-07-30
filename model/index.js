import mongoose from 'mongoose'
import { userSchema } from './userModel.js'

async function main() {
  await mongoose.connect('mongodb://localhost:27017/express-video')
}
main()
  .then((res) => {
    console.log('mongodb连接成功')
  })
  .catch((err) => {
    console.log('mongodb连接失败:', err)
  })

export const User = mongoose.model('User', userSchema)
