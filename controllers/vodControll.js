import { vod } from '../utils/vod.js'
export const getvod = async (req, res) => {
  const { kind, file, videoId } = req.body
  const result = await vod.request('CreateUploadVideo', {
    Title: file?.name || '未命名视频',
    FileName: file?.name || 'video.mp4',
    Description: req.body?.description || '',
    Tags: req.body?.tags || '',
    CateId: 0,
    TemplateGroupId: '',
  })
  let data = {
    UploadAuth: result.UploadAuth,
    UploadAddress: result.UploadAddress,
    VideoId: result.VideoId,
  }
  res.success(data)
}
