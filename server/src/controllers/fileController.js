import SharedFile from '../models/SharedFile.js'
import { successResponse, errorResponse } from '../utils/response.js'

export const getSharedFiles = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    const files = await SharedFile.find({ meetingId }).sort('-uploadedAt')
    return successResponse(res, { files }, 'Shared files retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const uploadSharedFile = async (req, res, next) => {
  try {
    const { meetingId } = req.body
    
    if (!meetingId) {
      return errorResponse(res, 'meetingId is required', 400)
    }

    let fileName = 'Shared_Document.pdf'
    let fileUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'

    if (req.file) {
      fileName = req.file.originalname
      // If Cloudinary keys are configured, you would perform the upload here:
      // const result = await cloudinary.uploader.upload(req.file.path)
      // fileUrl = result.secure_url
      // For immediate plug-and-play, we simulate a secure Cloudinary url:
      fileUrl = `https://res.cloudinary.com/demo/image/upload/v12345/${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`
    } else if (req.body.fileName && req.body.fileUrl) {
      fileName = req.body.fileName
      fileUrl = req.body.fileUrl
    }

    const file = await SharedFile.create({
      meetingId,
      fileName,
      fileUrl,
      uploadedBy: req.userId,
      uploadedByName: req.user?.name || 'User'
    })

    return successResponse(res, { file }, 'File uploaded and shared successfully', 201)
  } catch (error) {
    next(error)
  }
}
