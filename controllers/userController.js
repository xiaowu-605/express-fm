import { User } from '../model/index.js'
import bcrypt from 'bcryptjs'
import { getToken } from '../utils/jwt.js'
// 注册
export const register = async (req, res) => {
  // await User.create(req.body) // 等于下面的两步
  const userModel = new User(req.body)
  const bdBack = await userModel.save()
  let userObj = bdBack.toObject()
  delete userObj.password
  res.success(userObj, '注册成功')
}

// 登录
export const login = async (req, res) => {
  // user不是普通的 JS 对象，是 Mongoose 包装过的实例对象
  let user = await User.findOne({ email: req.body.email }).select('+password')
  if (!user) return res.fail('邮箱或密码不正确') // 不要提示具体的哪个错误，防止撞库攻击
  // 判断密码
  const isMatch = await bcrypt.compare(req.body.password, user.password)
  if (!isMatch) return res.fail('邮箱或密码不正确')
  const userObj = user.toObject()
  delete userObj.password
  userObj.token = getToken(userObj)
  res.success(userObj, '登录成功')
}

// 列表
export const list = async (req, res) => {
  res.success('list')
}

// 更新
export const update = async (req, res) => {
  const id = req.user?.userInfo?._id
  if (!id) return res.fail('未获取到用户信息')
  const dbBack = await User.findByIdAndUpdate(id, req.body, { new: true }) // new: true获取更新后的
  res.success(dbBack, '更新成功')
}
