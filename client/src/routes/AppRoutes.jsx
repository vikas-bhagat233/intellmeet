import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Dashboard from '../pages/Dashboard/Dashboard'
import Profile from '../pages/Profile/Profile'
import CreateMeeting from '../pages/CreateMeeting/CreateMeeting'
import JoinMeeting from '../pages/JoinMeeting/JoinMeeting'
import MeetingRoom from '../pages/MeetingRoom/MeetingRoom'
import MeetingHistory from '../pages/MeetingHistory/MeetingHistory'
import MeetingDetails from '../pages/MeetingDetails/MeetingDetails'
import Reports from '../pages/Reports/Reports'
import Teams from '../pages/Teams/Teams'
import TeamWorkspace from '../pages/TeamWorkspace/TeamWorkspace'
import Projects from '../pages/Projects/Projects'
import ProjectBoard from '../pages/ProjectBoard/ProjectBoard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/create-meeting" element={<PrivateRoute><CreateMeeting /></PrivateRoute>} />
      <Route path="/join-meeting" element={<PrivateRoute><JoinMeeting /></PrivateRoute>} />
      <Route path="/meeting/:meetingId" element={<PrivateRoute><MeetingRoom /></PrivateRoute>} />
      <Route path="/meeting-history" element={<PrivateRoute><MeetingHistory /></PrivateRoute>} />
      <Route path="/meeting-details/:meetingId" element={<PrivateRoute><MeetingDetails /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
      <Route path="/team-workspace/:id" element={<PrivateRoute><TeamWorkspace /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Projects /></PrivateRoute>} />
      <Route path="/project-board/:id" element={<PrivateRoute><ProjectBoard /></PrivateRoute>} />
    </Routes>
  )
}