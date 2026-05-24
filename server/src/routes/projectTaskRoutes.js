import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import cloudinary from '../config/cloudinary.js'
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/projectTaskController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads'
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'))
  }
})
const upload = multer({ storage })

const router = express.Router()

router.use(authMiddleware)

router.post('/', createTask)
router.get('/', getTasks)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

router.post('/:id/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    
    // Check if Cloudinary upload is enabled (defaults to true in production hosting, false in local development)
    const useCloudinary = process.env.USE_CLOUDINARY_FOR_ATTACHMENTS === 'true' || process.env.NODE_ENV === 'production';
    
    if (useCloudinary) {
      // Determine resource type to prevent Cloudinary 401 delivery restrictions on raw assets like PDFs
      const ext = path.extname(req.file.originalname).toLowerCase();
      const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext);
      const resourceType = isImage ? 'image' : 'raw';

      // Upload temporary file directly to user's Cloudinary storage
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'intellmeet_attachments',
        resource_type: resourceType
      });
      
      // Clean up temporary local file safely
      try {
        fs.unlinkSync(req.file.path)
      } catch (err) {
        console.warn('Failed to delete temporary local file:', err.message)
      }
      
      return res.status(200).json({
        url: result.secure_url,
        name: req.file.originalname,
        size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    } else {
      // Local storage upload for development testing (fully stable, zero-auth setup)
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const fileUrl = `${protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      
      return res.status(200).json({
        url: fileUrl,
        name: req.file.originalname,
        size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  } catch (error) {
    next(error)
  }
})

export default router
