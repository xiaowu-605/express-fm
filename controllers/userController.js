import { User } from '../model/index.js'
// 注册
export const register = async (req, res) => {
  // await User.create(req.body) // 等于下面的两步
  const userModel = new User(req.body)
  const bdBack = await userModel.save()
  res.success(bdBack, '注册成功')
}
