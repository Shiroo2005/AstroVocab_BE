import express from 'express'
import { FieldMaxCount } from '~/constants/upload'
import { uploadImagesController } from '~/controllers/upload.controller'
import { accessTokenValidation } from '~/middlewares/auth/accessToken.middleware'
import { upload } from '~/services/upload.service'
import { wrapRequestHandler } from '~/utils/handler'
const uploadRouter = express.Router()

// GET

// authenticate....
uploadRouter.use(accessTokenValidation)

/**
 * @description : Upload image
 * @method : POST
 * @path : /images
 * @header : Authorization
 * @body : {
 *  type: string
 *  images: File[]
 * }
 */
uploadRouter.post('/images', upload.fields(FieldMaxCount), wrapRequestHandler(uploadImagesController))

export default uploadRouter
