import express from 'express'
import path from 'path'
import cors from 'cors'
import fs from 'fs'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import meetingRoutes from './routes/meetingRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import noteRoutes from './routes/noteRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import recordingRoutes from './routes/recordingRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import teamRoutes from './routes/teamRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import projectTaskRoutes from './routes/projectTaskRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import { errorMiddleware } from './middleware/errorMiddleware.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/meetings', meetingRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/notes', noteRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/recordings', recordingRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/project-tasks', projectTaskRoutes)
app.use('/api/comments', commentRoutes)

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' })
})

app.use(errorMiddleware)

export default app

// Serve client in production when built into ../client/dist
if (process.env.NODE_ENV === 'production') {
  const possiblePaths = [
    path.join(process.cwd(), 'client', 'dist'),
    path.join(process.cwd(), '..', 'client', 'dist'),
    path.join(process.cwd(), 'server', 'client', 'dist'),
    path.join(process.cwd(), '..', '..', 'client', 'dist')
  ]

  const clientDist = possiblePaths.find(p => fs.existsSync(p))

  if (clientDist) {
    app.use(express.static(clientDist))
    app.get('*', (req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'))
    })
  } else {
    console.warn('Client dist folder not found. Checked:', possiblePaths)
  }
}