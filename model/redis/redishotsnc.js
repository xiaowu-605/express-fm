import { redis } from './index.js'

// 热度
export const hotInc = async (videoId, incNum) => {
  return redis.zincrby('videohots', incNum, videoId)
}

// 热门视频
export const hotTop = async (num) => {
  const sort = await redis.zrevrange('videohots', 0, num - 1, 'WITHSCORES')
  const result = {}
  for (let i = 0; i < sort.length; i += 2) {
    result[sort[i]] = sort[i + 1]
  }
  return result
}
