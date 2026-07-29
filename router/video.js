import { Router } from 'express'
import { list } from '../controllers/videoController.js'
const router = Router()

router.get('/', list)

export default router
