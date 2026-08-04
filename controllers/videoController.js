import fs from 'fs-extra'
import { join } from 'path'
import { User, Video, VideoComment, VideoLike } from '../model/index.js'
import { pick } from 'lodash-es'
import { PICK_FIELD } from '../utils/index.js'

const __dirname = import.meta.dirname
export const uploadVideo = async (req, res) => {
  try {
    const nameArr = req.file.originalname.split('.')
    const fileType = nameArr[nameArr.length - 1]
    let path = join(__dirname, '../uploads/videos')
    await fs.rename(
      `${path}\\${req.file.filename}`,
      `${path}\\${req.file.filename}.${fileType}`,
    )
    const id = req.user?.userInfo?._id
    if (!id) return res.fail('未获取到用户信息')
    const image = `${req.file.filename}.${fileType}`
    const relativePath = `/uploads/videos/${image}`
    const fullUrl = `${req.protocol}://${req.get('host')}${relativePath}`
    await User.findByIdAndUpdate(id, { cover: relativePath }, { new: true }) // new: true获取更新后的
    res.success({ url: fullUrl }, '上传成功')
  } catch (e) {
    console.log('e---', e)
    res.fail('上传失败', 500)
  }
}

export const createVideo = async (req, res) => {
  const id = req.user?.userInfo?._id
  if (!id) return res.fail('未获取到用户信息', 401)
  try {
    const body = req.body
    body.user = id
    const videoModel = new Video(body)
    const dbBack = await videoModel.save()
    res.success(dbBack, '视频上传成功')
  } catch (e) {
    res.fail(e, 500)
  }
}

// 分页返回数据
export const videoList = async (req, res) => {
  const { pageNum = 1, pageSize = 10 } = req.body
  const videolist = await Video.find()
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ creatAt: -1 })
    .populate('user', '_id username image cover channeldes') // 把关联的用户信息也查询出来
  const total = await Video.countDocuments() // 获取总条数
  res.success({ videolist, total })
}

// 获取视频详情
export const videoDetail = async (req, res) => {
  let { videoId } = req.query
  if (!videoId) res.fail('请传入视频id')
  const dbBack = await Video.findById(videoId).populate(
    'user',
    '_id username image cover channeldes', // 需要返回的数据
  )
  res.success(dbBack)
}

// 提交评论
export const comment = async (req, res) => {
  const id = req.user?.userInfo?._id
  const { videoId, content } = req.body
  if (!content) return res.fail('请传入评论内容', 422)
  const videoInfo = await Video.findById(videoId)
  if (!videoInfo) return res.fail('视频不存在', 404)
  const dbBack = await new VideoComment({
    content,
    video: videoId,
    user: id,
  }).save()
  videoInfo.commentCount++
  await videoInfo.save()
  res.success(dbBack, '评论成功')
}

// 获取评论列表
export const commentList = async (req, res) => {
  let { videoId, pageNum = 1, pageSize = 10 } = req.query
  if (!videoId) res.fail('请传入视频id')
  let list = await VideoComment.find({ video: videoId })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ creatAt: -1 })
    .populate('user')
  list = list.map((item) => {
    item.user = pick(item.user, PICK_FIELD)
    return item
  })
  const total = await VideoComment.countDocuments({ video: videoId }) // 获取总条数
  res.success({ commentList: list, total })
}

// 删除评论
export const delComment = async (req, res) => {
  let { videoId, commentId } = req.query
  const videoInfo = await Video.findById(videoId)
  if (!videoInfo) return res.fail('视频不存在', 404)
  const commentInfo = await VideoComment.findById(commentId)
  if (!commentInfo) return res.fail('评论不存在', 404)
  if (!commentInfo.user.equals(req.user.userInfo._id))
    return res.fail('评论不可删除', 403)
  const dbBack = await commentInfo.deleteOne()
  videoInfo.commentCount--
  await videoInfo.save()
  res.success(dbBack, '删除成功')
}

// 喜欢视频
export const likeVideo = async (req, res) => {
  const userId = req.user?.userInfo?._id
  let { videoId } = req.query
  const videoInfo = await Video.findById(videoId)
  if (!videoInfo) res.fail('视频不存在', 404)
  const videolike = await VideoLike.findOne({
    user: userId,
    video: videoId,
  })
  let isLike = true
  if (!videolike) {
    await new VideoLike({
      user: userId,
      video: videoId,
      like: 1,
    }).save()
  } else {
    if (videolike.like === 1) {
      // 之前是点赞状态
      await videolike.deleteOne()
      isLike = false
    } else {
      videolike.like = 1
      await videolike.save()
    }
  }
  videoInfo.likeCount = await VideoLike.countDocuments({
    video: videoId,
    like: 1,
  })
  videoInfo.dislikeCount = await VideoLike.countDocuments({
    video: videoId,
    like: -1,
  })
  await videoInfo.save()
  res.success({ ...videoInfo.toObject(), isLike }, '操作成功')
}

// 喜欢视频列表
export const likeVideoList = async (req, res) => {
  const userId = req.user?.userInfo?._id
  const likeVideo = await VideoLike.find({ user: userId, like: 1 }).populate(
    'video',
  )
  res.success(likeVideo)
}
