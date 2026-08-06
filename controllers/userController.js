import fs from 'fs-extra'
import { Subscribe, User } from '../model/index.js'
import bcrypt from 'bcryptjs'
import { getToken } from '../utils/jwt.js'
import { join } from 'path'
import { pick } from 'lodash-es'
import { PICK_FIELD, USER_UPDATE_FIELDS } from '../utils/index.js'

const __dirname = import.meta.dirname
// 注册
export const register = async (req, res) => {
  // await User.create(req.body) // 等于下面的两步
  const allowed = pick(req.body, 'username', 'email', 'password', 'phone') // 白名单过滤
  const userModel = new User(allowed)
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
  // update 中用白名单过滤，不允传 password
  const allowed = pick(req.body, ...USER_UPDATE_FIELDS)

  if (!id) return res.fail('未获取到用户信息')
  const dbBack = await User.findByIdAndUpdate(id, allowed, { new: true }) // new: true获取更新后的
  res.success(dbBack, '更新成功')
}

// 密码修改单独接口
export const changePassword = async (req, res) => {
  const user = await User.findById(req.user.userInfo._id).select('+password')
  const isMatch = await bcrypt.compare(req.body.oldPassword, user.password)
  if (!isMatch) return res.fail('原密码不正确')
  user.password = req.body.newPassword
  await user.save() // trigger pre('save') hook
  res.success(null, '密码修改成功')
}

// 上传头像
export const uploadAvatar = async (req, res) => {
  try {
    const nameArr = req.file.originalname.split('.')
    const fileType = nameArr[nameArr.length - 1]
    let path = join(__dirname, '../uploads/images') // C:\Users\87018\Desktop\wuxh\AICoding\express-fm\uploads
    await fs.rename(
      `${path}\\${req.file.filename}`,
      `${path}\\${req.file.filename}.${fileType}`,
    )
    const id = req.user?.userInfo?._id
    if (!id) return res.fail('未获取到用户信息')
    const image = `${req.file.filename}.${fileType}`
    const relativePath = `/uploads/images/${image}`
    const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`
    await User.findByIdAndUpdate(id, { image: relativePath }, { new: true }) // new: true获取更新后的
    res.success({ url: fullUrl }, '上传成功')
  } catch (e) {
    res.fail('上传失败', 500)
  }
}

// 关注
export const subscribe = async (req, res) => {
  const channleId = req.query?.userId // 关注人的id
  const id = req.user?.userInfo?._id
  if (!channleId) return res.fail('请传入用户id')
  if (channleId == id) return res.fail('不能关注自己', 422)
  const userInfo = await User.findById(channleId)
  if (!userInfo) return res.fail('该用户不存在')
  const data = { user: id, channle: channleId }
  const record = await Subscribe.findOne(data)
  if (record) return res.fail('已关注该用户')
  // 存入数据库
  await new Subscribe(data).save()
  // 关注人的粉丝加1
  await User.findByIdAndUpdate(channleId, { $inc: { subscribeCount: 1 } })
  const dbBack = await userInfo.save()
  res.success(null, '关注成功')
}

// 取消关注
export const unsubscribe = async (req, res) => {
  const channleId = req.query?.userId // 关注人的id
  const id = req.user?.userInfo?._id
  if (!channleId) return res.fail('请传入用户id')
  if (channleId == id) return res.fail('不能取消关注自己', 422)
  const userInfo = await User.findById(channleId)
  if (!userInfo) return res.fail('该用户不存在')
  const data = { user: id, channle: channleId }
  const record = await Subscribe.findOne(data)
  if (!record) return res.fail('还没有关注该用户')
  await record.deleteOne()
  // 关注人的粉丝减1
  userInfo.subscribeCount--
  await userInfo.save()
  res.success(null, '取消成功')
}

// 获取频道
export const getUser = async (req, res) => {
  let isSubscribe = false // 是否关注--通过是否已关注字段，来显示不同的状态
  const channleId = req.query?.userId // 查看人的id
  const id = req.user?.userInfo?._id
  if (id) {
    const data = { user: id, channle: channleId }
    const record = await Subscribe.findOne(data)
    if (record) {
      // 关注了
      isSubscribe = true
    }
  }
  let user = await User.findById(channleId)
  if (!user) return res.fail('该用户不存在')
  let tempUser = pick(user, PICK_FIELD)
  tempUser.isSubscribe = isSubscribe
  res.success(tempUser)
}

// 某一个人的关注列表
export const getSubscribe = async (req, res) => {
  const { userId } = req.query // 查看人的id
  const userInfo = await User.findById(userId)
  if (!userInfo) return res.fail('该用户不存在')
  let channleUsers = await Subscribe.find({ user: userId }).populate('channle')
  if (channleUsers) {
    channleUsers = channleUsers.map((item) => {
      return pick(item.channle, PICK_FIELD)
    })
  }
  res.success(channleUsers)
}

// 获取我的粉丝列表
export const getChannel = async (req, res) => {
  const id = req.user?.userInfo?._id || null
  let channleUsers = await Subscribe.find({ channle: id }).populate('user')
  if (channleUsers) {
    channleUsers = channleUsers.map((item) => {
      return pick(item.user, PICK_FIELD)
    })
  }
  res.success(channleUsers)
}
