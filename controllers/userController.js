import { User } from '../model/index.js'
import bcrypt from 'bcryptjs'
// 注册
export const register = async (req, res) => {
  // await User.create(req.body) // 等于下面的两步
  const userModel = new User(req.body)
  const bdBack = await userModel.save()
  res.success(null, '注册成功')
}

// 登录
export const login = async (req, res) => {
  // user不是普通的 JS 对象，是 Mongoose 包装过的实例对象
  let user = await User.findOne({ email: req.body.email }).select('+password')
  if (!user) return res.fail('邮箱不存在，请先注册')
  // 判断密码
  const isMatch = await bcrypt.compare(req.body.password, user.password)
  if (!isMatch) return res.fail('密码不正确')
  const userObj = user.toObject()
  delete userObj.password
  res.success(userObj, '登录成功')
}
