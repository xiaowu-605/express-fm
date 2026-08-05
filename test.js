// import { MongoClient } from 'mongodb'
// const client = new MongoClient('mongodb://127.0.0.1:27017')
//
// async function clientFn(c) {
//   await client.connect()
//   const db = client.db('test')
//   return db.collection(c)
// }
//
// const main = async () => {
//   const user = await clientFn('user')
// const d = await user.find()
// console.log('d---', await d.toArray()) // 返回的游标，需要await   toArray
// const d = await user.findOne({ age: { $gt: 30 } })
// console.log('d--1', d)
// const i = await user.insertOne({ name: 'monika', age: 32 })
// console.log('i--', i)
// const is = await user.insertMany([
//   { name: 'monika1', age: 34 },
//   { name: 'kaka', age: 29 },
// ])
// console.log('is--', is)

// 更新
// const u = await user.updateOne({ name: 'kaka' }, { $set: { age: 60 } })
// console.log('u---', u)
// const us = await user.updateMany({ age: { $gt: 30 } }, { $set: { age: 18 } })

// 删除
// const d = await user.deleteOne({ name: 'kaka' })
// console.log('d--', d)
// const ds = await user.deleteMany({ age: { $lt: 20 } })
// }
// main().finally(() => client.close())

import Redis from 'ioredis'
const redis = new Redis()

await redis.set('a', '1', 'EX', 600)
const value = await redis.get('a')
redis.keys('*').then((res) => {
  console.log(res)
})
