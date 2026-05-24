import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

export default function Home() {
  return (
    <div className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">Welcome to IntellMeet</h1>
        <p className="hero__subtitle">AI-Powered Video Conferencing Platform</p>
        <div className="hero__actions">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}