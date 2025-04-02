import { Request } from 'express'
import multer from 'multer'
import fs from 'fs'
import { ensureFolderExists } from '~/utils/file'
import sharp from 'sharp'
import path from 'path'
import { FolderUpload } from '~/constants/upload'
import { env } from 'process'

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    const folder = 'uploads/temp'

    if (file.mimetype?.includes('image/'))
      //create folder if not exist
      ensureFolderExists(folder)

    cb(null, folder)
  },
  filename: (req: Request, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

export const uploadImages = async (files: Record<string, Express.Multer.File[]>, type: string) => {
  // convert to array
  const fileArray: Express.Multer.File[] = Object.values(files).flat()

  const _files = await Promise.all(fileArray.map((file) => processAndSaveImage(file, type)))

  return _files
}

// resize, tojpeg and save
export const processAndSaveImage = async (file: Express.Multer.File, type: string) => {
  // find folder for type images
  const fileType = type
  let folder = 'others'

  const foundFolder = Object.values(FolderUpload).filter((type) => type == fileType)
  if (foundFolder && foundFolder.length == 1) folder = foundFolder[0]

  // create folder if not exist
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true })

  const filePath = path.resolve(file.path)
  const destinationPath = path.resolve('uploads', folder)
  const newFileName = `${Date.now()}-${path.parse(file.originalname).name}.jpeg`
  const destinationFile = path.join(destinationPath, newFileName)

  const urlImage = `${env.HOST_URL}/uploads/${folder}/${newFileName}`

  console.log(filePath, destinationPath, file, destinationFile)

  await sharp(filePath).jpeg().toFile(destinationFile)

  return { filename: file.fieldname, destination: urlImage }
}

// Middleware upload
export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5Mb
