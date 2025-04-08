import express from 'express'
import roleRouter from './role.route'
import authRouter from './auth.route'
import { permissionRouter } from './permission.route'
import uploadRouter from './upload.route'
import { userRouter } from './user.route'
import { wordRouter } from './word.route'
import { topicRouter } from './topic.route'
const router = express.Router()

router.use('/auth', authRouter)

router.use('/roles', roleRouter)

router.use('/permissions', permissionRouter)

router.use('/upload', uploadRouter)

router.use('/users', userRouter)

router.use('/words', wordRouter)

router.use('/topics', topicRouter)
export default router
