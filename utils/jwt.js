import jwt from 'jsonwebtoken'
import { User } from '../model/index.js'
// 生成token
export const getToken = (userInfo) => {
  // 只存id，其他信息不存，防止token过大
  return jwt.sign({ _id: userInfo._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// 验证token中间件
export const requireAuth = (require = true) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      if (!require) return next()
      return res.fail('请先登录', 401)
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded._id)
      if (!user) return res.fail('用户不存在', 401)
      req.user = user
      next()
    } catch (e) {
      res.fail('Token 无效或已过期', 401)
    }
  }
}
