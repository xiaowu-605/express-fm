import { redis } from './index.js'

// 热度（fire-and-forget，Redis 不可用时不影响主流程）
export const hotInc = (videoId, incNum) => {
  redis.zincrby('videohots', incNum, videoId).catch(() => {})
}

// 热门视频
export const hotTop = async (num) => {
  num = Math.max(1, Number(num) || 10)
  const sort = await redis.zrevrange('videohots', 0, num - 1, 'WITHSCORES')
  const result = {}
  for (let i = 0; i < sort.length; i += 2) {
    result[sort[i]] = sort[i + 1]
  }
  return result
}
