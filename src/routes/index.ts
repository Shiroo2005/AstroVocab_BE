import express from 'express'
import roleRouter from './role.route'
import authRouter from './auth.route'
const router = express.Router()

router.use('/auth', authRouter)

router.use('/roles', roleRouter)

export default router
