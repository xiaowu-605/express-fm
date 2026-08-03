import Core from '@alicloud/pop-core'
export const vod = new Core({
  accessKeyId: process.env.VOD_ACCESS_KEY_ID,
  accessKeySecret: process.env.VOD_ACCESS_KEY_SECRET,
  endpoint: 'https://vod.cn-shenzhen.aliyuncs.com', // 根据你的地域选
  apiVersion: '2017-03-21',
})
