// 处理接口返回数据结构，数据
export const responseHelper = (req, res, next) => {
  res.success = (data, msg) => res.json({ code: 0, data: data ?? null, msg })

  res.fail = (msg, status = 400) => res.status(status).json({ code: 1, msg })
  next()
}

// 全局api错误处理
export const handleAllError = (err, req, res, next) => {
  console.log(err)
  // Multer 文件大小超限
  if (err.code === 'LIMIT_FILE_SIZE') return res.fail('文件大小超出限制', 413)
  // Mongoose 校验错误
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
    return res.fail(msg, 400)
  }
  // CastError（无效 ID 等）
  if (err.name === 'CastError') {
    return res.fail('请求参数格式不正确', 400)
  }
  // 兜底：生产环境不泄露 message
  const isDev = process.env.NODE_ENV === 'development'
  res.status(500).json({
    code: 1,
    msg: isDev ? err.message : '服务器内部错误',
  })
}

export const handleNotFound = (req, res, next) => {
  res.fail('404 Not Found', 404)
}

// 验证错误信息处理成字符串返回
export const handleValidationErrorToStr = (error) =>
  error?.map((err) => err.msg).join(',') || ''
