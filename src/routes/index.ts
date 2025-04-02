import express from 'express'
import roleRouter from './role.route'
import authRouter from './auth.route'
import { permissionRouter } from './permission.route'
import uploadRouter from './upload.route'
const router = express.Router()

router.use('/auth', authRouter)

router.use('/roles', roleRouter)

router.use('/permissions', permissionRouter)

router.use('/upload', uploadRouter)

export default router
