import { Router } from 'express'
import { list } from '../controllers/userController.js'
const router = Router()

router.get('/', list)

export default router
