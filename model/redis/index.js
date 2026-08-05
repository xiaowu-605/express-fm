import Redis from 'ioredis'
const redis = new Redis()
redis.on('error', (error) => {
  if (error) {
    console.log('Redis连接错误')
    console.log(error)
    redis.quit() // 直接退出，不用重复连接
  }
})

redis.on('ready', () => {
  console.log('Redis连接成功')
})

export { redis }
