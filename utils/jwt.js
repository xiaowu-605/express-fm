import jwt from 'jsonwebtoken'
// 生成token
export const getToken = (userInfo) => {
  return jwt.sign({ userInfo }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// 验证token中间件
export const requireAuth = (require = true) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      // 验证
      try {
        const userInfo = jwt.verify(token, process.env.JWT_SECRET)
        req.user = userInfo // 把用户信息挂在 req 上，后面的路由直接用
        next()
      } catch (e) {
        res.fail('Token 无效或已过期', 401)
      }
    } else if (require) {
      if (!token) return res.fail('请先登录', 401)
    } else {
      next()
    }
  }
}
