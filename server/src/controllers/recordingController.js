import { recordingService } from '../services/recordingService.js'
import { successResponse, errorResponse } from '../utils/response.js'
import Recording from '../models/Recording.js'
import cloudinary from '../config/cloudinary.js'

export const getRecording = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    const recording = await recordingService.getRecordingByMeetingId(meetingId)
    return successResponse(res, { recording }, 'Recording details retrieved successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const deleteRecordingController = async (req, res, next) => {
  try {
    const { meetingId } = req.params
    await recordingService.deleteRecording(meetingId)
    return successResponse(res, null, 'Recording deleted successfully', 200)
  } catch (error) {
    next(error)
  }
}

export const saveRecordingController = async (req, res, next) => {
  try {
    const { meetingId, recordingUrl, size, duration } = req.body
    
    let recording = await Recording.findOne({ meetingId })
    if (recording) {
      return successResponse(res, { recording }, 'Recording already saved', 200)
    }

    recording = await Recording.create({
      meetingId,
      recordingUrl: recordingUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
      size: size || 15420104,
      duration: duration || 360
    })

    return successResponse(res, { recording }, 'Recording saved successfully', 201)
  } catch (error) {
    next(error)
  }
}

export const uploadRecordingController = async (req, res, next) => {
  try {
    const { meetingId } = req.body
    
    if (!meetingId) {
      return errorResponse(res, 'meetingId is required', 400)
    }
    if (!req.file) {
      return errorResponse(res, 'No recording file uploaded', 400)
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      const simulatedUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'
      const recording = await Recording.create({
        meetingId,
        recordingUrl: simulatedUrl,
        size: req.file.size || 15420104,
        duration: 360
      })
      return successResponse(res, { recording }, 'Cloudinary keys not configured. Saved with fallback URL successfully.', 201)
    }

    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'intellmeet_recordings',
            public_id: `meeting_${meetingId}_${Date.now()}`
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        stream.end(fileBuffer)
      })
    }

    const cloudinaryResult = await uploadToCloudinary(req.file.buffer)

    let recording = await Recording.findOne({ meetingId })
    if (recording) {
      recording.recordingUrl = cloudinaryResult.secure_url
      recording.size = req.file.size || cloudinaryResult.bytes || 0
      recording.duration = Math.round(cloudinaryResult.duration) || 360
      await recording.save()
    } else {
      recording = await Recording.create({
        meetingId,
        recordingUrl: cloudinaryResult.secure_url,
        size: req.file.size || cloudinaryResult.bytes || 0,
        duration: Math.round(cloudinaryResult.duration) || 360
      })
    }

    return successResponse(res, { recording }, 'Recording uploaded and saved to Cloudinary successfully', 201)
  } catch (error) {
    next(error)
  }
}
