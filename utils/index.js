import fs from 'fs-extra'

export const PICK_FIELD = [
  '_id',
  'username',
  'image',
  'cover',
  'channeldes',
  'subscribeCount',
  'isSubscribe',
]
// 热度：观看+1----点赞+2----评论+2----收藏+3
export const HOT_NUM = {
  collect: 3,
  watch: 1,
  like: 2,
  comment: 2,
}

export const readFileOrDefault = async (filePath, defaultVal = '') => {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch (e) {
    if (e.code == 'ENOENT') return defaultVal
    throw e // 其他错误（权限等）继续抛出
  }
}

export const getDb = async () => {
  const defaultData = { users: [], video: [] }
  let userInfo =
    (await fs.readJSON('./db.json', { throws: false })) || defaultData
  return userInfo
}
export const saveDb = async (data) => {
  return await fs.writeJson('./db.json', data)
}

export const USER_FIELDS = ['username', 'age']
export const pick = (obj, keys) => {
  Object.fromEntries(Object.entries(obj).filter((key) => keys.includes(key)))
}
