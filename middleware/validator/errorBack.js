import { validationResult } from 'express-validator'
import { handleValidationErrorToStr } from '../../utils/request.js'

// 验证结果处理---一次返回所有错误
// export const validator = (validator) => {
//   return async (req, res, next) => {
//     await Promise.all(validator.map((v) => v.run(req)))
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       const errorStr = handleValidationErrorToStr(errors.array())
//       return res.fail(errorStr, 422)
//     }
//     next()
//   }
// }

// 一次只返回一个错误
export const validator = (validators) => {
  return async (req, res, next) => {
    for (const v of validators) {
      await v.run(req)
      const errors = validationResult(req)
      if (!errors.isEmpty()) break // 出错了就不继续验证后面的
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorStr = handleValidationErrorToStr(errors.array())
      return res.fail(errorStr, 422)
    }
    next()
  }
}
