import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__logo">
          IntellMeet
        </Link>
        <div className="nav__links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav__link">Dashboard</Link>
              <Link to="/teams" className="nav__link">👥 Workspaces</Link>
              <Link to="/reports" className="nav__link">📊 Reports</Link>
              <Link to="/profile" className="nav__link">Profile</Link>
              <button 
                onClick={handleLogout} 
                className="nav__link"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__link">Login</Link>
              <Link to="/register" className="nav__cta">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}