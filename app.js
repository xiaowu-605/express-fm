import 'dotenv/config' // 引入后就可以使用process.env.
import express from 'express'
import cors from 'cors'
import morgan from 'morgan' // 日志记录 中大型项目一般用更专业的日志库，比如 winston 或 pino
import {
  responseHelper,
  handleAllError,
  handleNotFound,
} from './utils/request.js'
import router from './router/index.js'

const app = express()
// 中间件，处理接收到的body
app.use(morgan('dev')) // 开发模式 生产：app.use(morgan('combined', { stream: fs.createWriteStream('./access.log') }))
app.use(cors()) // 处理跨域   上线后限制来源（生产用）：app.use(cors({ origin: 'https://myapp.com' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(responseHelper) // 给返回结果res加success和fail

// 路由
app.use('/api/v1', router)

// 404
app.use(handleNotFound)
// 全局错误处理中间件, 不要每个路由都要try catch捕获错误
app.use(handleAllError)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Run http://localhost:${PORT}`)
})
