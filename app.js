import express from 'express'
import { getDb, saveDb } from './utlis/index.js'

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
  try {
    const dbjson = await getDb()
    res.success(dbjson.users)
  } catch (e) {
    console.error(e) // 服务端自己看完整错误
    // res.status(500).json({ error: e.message })
    res.fail(e.message, 500)
  }
})

app.post('/', async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.fail('缺少用户信息')
  }
  try {
    // 获取到文件内容，把新增的添加进去
    const userInfo = await getDb()
    // 更新users
    const lastUser = userInfo.users[userInfo.users.length - 1]
    const id = lastUser ? lastUser.id + 1 : 1
    userInfo.users.push({ ...req.body.users, id })
    await saveDb(userInfo)
    res.success(null, 'success')
  } catch (e) {
    res.fail(e.message, 500)
  }
})

// 修改信息
app.put('/:id', async (req, res) => {
  if (!req.params) {
    res.fail('缺少用户id')
    return
  }
  try {
    const dbjson = await getDb()
    const users = dbjson.users
    const index = users.findIndex((item) => item.id == req.params.id)
    if (index != -1) {
      users[index] = {
        ...users[index],
        ...req.body,
      }
      await saveDb(dbjson)
      res.success('修改成功')
    } else {
      res.fail('修改失败，当前id不存在')
    }
  } catch (e) {
    console.log('修改用户信息错误：', e)
    res.fail(e.message, 500)
  }
})

app.listen(3000, () => {
  console.log('Run http://localhost:3000')
})
