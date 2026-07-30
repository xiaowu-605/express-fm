// 处理接口返回数据结构，数据
export const handleRes = (req, res, next) => {
  res.success = (data, msg) => res.json({ code: 0, data: data ?? null, msg })

  res.fail = (msg, status = 400) => res.status(status).json({ code: 1, msg })
  next()
}

// 全局api错误处理
export const handleAllError = (err, req, res, next) => {
  console.log(err)
  res.fail(err.message || '服务器内部错误', 500)
}

export const handleNotFound = (req, res, next) => {
  res.fail('404 Not Found', 404)
}

// 验证错误信息处理成字符串返回
export const handleValidationErrorToStr = (error) =>
  error?.map((err) => err.msg).join(',') || ''
