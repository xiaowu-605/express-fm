import { redis } from './index.js'

// 热度
export const hotInc = async (videoId, incNum) => {
  const data = await redis.zscore('videohots', videoId)
  let inc = ''
  if (data) {
    inc = await redis.zincrby('videohots', incNum, videoId)
  } else {
    inc = await redis.zadd('videohots', incNum, videoId)
  }
  return inc
}

// 热门视频
export const hotTop = async (num) => {
  const sort = await redis.zrevrange('videohots', 0, -1, 'WITHSCORES') // 取出所有数据再截取
  const newArr = sort.slice(0, num * 2)
  let obj = {}
  for (let i = 0; i < newArr.length; i++) {
    if (i % 2 == 0) {
      obj[newArr[i]] = newArr[i + 1]
    }
  }
  return obj
}
