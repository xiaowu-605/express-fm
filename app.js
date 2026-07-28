import express from 'express'
import { getDb, saveDb, USER_FIELDS, pick } from './utils/index.js'

const app = express()
// 中间件，处理接收到的body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// 处理返回结果
app.use((req, res, next) => {
  res.success = (data, message) =>
    res.json({ code: 0, data: data ?? null, message })
  res.fail = (message, status = 400) =>
    res.status(status).json({ code: 1, message })
  next()
})

app.get('/', async (req, res) => {
  const dbjson = await getDb()
  res.success(dbjson.users)
})

app.post('/', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.fail('缺少用户信息')
  }
  let missing = USER_FIELDS.filter((f) => req.body[f] === undefined)
  if (missing.length) return res.fail(`缺少字段: ${missing.join(', ')}`)
  // 获取到文件内容，把新增的添加进去
  const userInfo = await getDb()
  // 更新users
  const lastUser = userInfo.users[userInfo.users.length - 1]
  const id = lastUser ? lastUser.id + 1 : 1
  userInfo.users.push({ ...req.body, id })
  await saveDb(userInfo)
  res.success(null, 'success')
})

// 修改信息
app.put('/:id', async (req, res) => {
  if (!req.params?.id) return res.fail('缺少用户id')
  if (!req.body || Object.keys(req.body).length == 0)
    return res.fail('缺少要修改的信息')
  const dbjson = await getDb()
  const target = dbjson.users?.find(
    (item) => item.id == Number.parseInt(req.params.id),
  )
  if (!target) return res.fail('修改失败，当前id不存在')
  Object.assign(target, pick(req.body, USER_FIELDS))
  await saveDb(dbjson)
  res.success('修改成功')
})
// 全局错误处理中间件, 不要每个路由都要try catch捕获错误
app.use((err, req, res, next) => {
  console.log(err)
  res.fail(err.message || '服务器内部错误', 500)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Run http://localhost:${PORT}`)
})
