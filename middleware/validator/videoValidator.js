import { body } from 'express-validator'
import { Video } from '../../model/index.js'

export const videoValidator = [
  body('title')
    .notEmpty()
    .withMessage('视频名不能为空')
    .bail()
    .isLength({ max: 20 })
    .withMessage('视频名的长度不能超过20'),
  body('vodvideoId').notEmpty().withMessage('Vod不能为空').bail(),
]
