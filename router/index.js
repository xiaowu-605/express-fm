import { Router } from 'express'
import userRouter from './user.js'
import videoRouter from './video.js'

const router = Router()

router.use('/user', userRouter)
router.use('/video', videoRouter)

export default router
