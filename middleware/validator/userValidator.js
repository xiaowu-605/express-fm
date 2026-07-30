import { body } from 'express-validator'

export const registerValidator = [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('email')
    .notEmpty()
    .withMessage('邮箱不能为空')
    .bail() // bail验证通过才验证后面的
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('password').notEmpty().withMessage('密码不能为空'),
  body('phone')
    .notEmpty()
    .withMessage('手机号不能为空')
    .bail()
    .isMobilePhone('zh-CN')
    .withMessage('手机号格式不正确'),
]
