import Redis from 'ioredis'
const redis = new Redis()
redis.on('error', (error) => {
  console.log('Redis连接错误:', error.message)
})

redis.on('ready', () => {
  console.log('Redis连接成功')
})

export { redis }
