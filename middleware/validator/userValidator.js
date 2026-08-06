import { body } from 'express-validator'
import { User } from '../../model/index.js'

export const registerValidator = [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail() // bail验证通过才验证后面的
    .isEmail()
    .withMessage('邮箱格式不正确')
    .bail()
    .custom(async (value) => {
      const exists = await User.findOne({ email: value })
      if (exists) return Promise.reject('邮箱已被注册')
      return true
    }),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空')
    .bail()
    .isLength({ min: 5 })
    .withMessage('密码长度不能小于5位'),
  body('phone')
    .notEmpty()
    .withMessage('手机号不能为空')
    .bail()
    .isMobilePhone('zh-CN')
    .withMessage('手机号格式不正确')
    .bail()
    .custom(async (value) => {
      const exists = await User.findOne({ phone: value })
      if (exists) return Promise.reject('手机号已被注册')
      return true
    }),
]

// 邮箱 密码登录
export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail()
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('password').notEmpty().withMessage('密码不能为空'),
]

// 更新验证
export const updateValidator = [
  body('email').custom(async (value, { req }) => {
    if (!value) return true
    const exists = await User.findOne({
      email: value,
      _id: { $ne: req.user?.userInfo?._id },
    })
    if (exists) return Promise.reject('邮箱已被注册')
    return true
  }),
  body('username').custom(async (value, { req }) => {
    if (!value) return true
    const exists = await User.findOne({
      username: value,
      _id: { $ne: req.user?.userInfo?._id },
    })
    if (exists) return Promise.reject('用户名已被注册')
    return true
  }),
  body('phone').custom(async (value, { req }) => {
    if (!value) return true
    const exists = await User.findOne({
      phone: value,
      _id: { $ne: req.user?.userInfo?._id },
    })
    if (exists) return Promise.reject('手机号已被注册')
    return true
  }),
]
