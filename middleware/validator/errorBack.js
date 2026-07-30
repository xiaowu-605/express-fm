import { validationResult } from 'express-validator'
import { handleValidationErrorToStr } from '../../utils/request.js'

// 验证结果处理
export const validator = (validator) => {
  return async (req, res, next) => {
    await Promise.all(validator.map((v) => v.run(req)))
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const errorStr = handleValidationErrorToStr(errors.array())
      return res.fail(errorStr, 422)
    }
    next()
  }
}
