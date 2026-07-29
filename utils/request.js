// 处理接口返回数据结构，数据
export const handleRes = (req, res, next) => {
  res.success = (data, message) =>
    res.json({ code: 0, data: data ?? null, message })
  res.fail = (message, status = 400) =>
    res.status(status).json({ code: 1, message })
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
