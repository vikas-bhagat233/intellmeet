import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../common/Input'
import Button from '../common/Button'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      toast.success('Welcome back to IntellMeet!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="card card--form">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--accent-gradient)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          marginBottom: 16,
          boxShadow: '0 8px 20px var(--accent-glow)'
        }}>
          ⚡
        </div>
        <h2 className="form-title" style={{ marginBottom: 8 }}>Sign In</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: '1.5' }}>
          Enter your credentials to access your collaborative AI-powered meeting workspaces.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="name@company.com"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <Button type="submit" variant="primary" style={{ marginTop: 12, width: '100%' }}>
          Sign In 🚀
        </Button>
      </form>

      <div style={{ 
        textAlign: 'center', 
        marginTop: 24, 
        paddingTop: 16, 
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: 13, 
        color: 'var(--muted)' 
      }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#8b5cf6'} onMouseLeave={e => e.target.style.color = 'var(--accent)'}>
          Register here
        </Link>
      </div>
    </div>
  )
}