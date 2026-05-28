import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../common/Input'
import Button from '../common/Button'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState("What is your mother's name?")
  const [securityAnswer, setSecurityAnswer] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password, securityQuestion, securityAnswer)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="card card--form">
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--accent-2-gradient)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          marginBottom: 16,
          boxShadow: '0 8px 20px var(--accent-2-glow)'
        }}>
          ✨
        </div>
        <h2 className="form-title" style={{ marginBottom: 8 }}>Get Started</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: '1.5' }}>
          Create an account to start hosting immersive video sessions and collaborative workboards.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Input 
          label="Full Name" 
          type="text" 
          placeholder="John Doe"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
          placeholder="Min. 6 characters"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        
        <Input 
          label="Security Question (for password recovery)" 
          type="text" 
          placeholder="e.g. What is your mother's name?"
          value={securityQuestion} 
          onChange={(e) => setSecurityQuestion(e.target.value)} 
          required 
        />

        <Input 
          label="Security Answer" 
          type="text" 
          placeholder="Type your security answer..."
          value={securityAnswer} 
          onChange={(e) => setSecurityAnswer(e.target.value)} 
          required 
        />
        
        <Button type="submit" variant="primary" style={{ marginTop: 12, width: '100%', background: 'var(--accent-2-gradient)', boxShadow: '0 8px 24px var(--accent-2-glow)' }}>
          Create Account 🚀
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
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent-2)', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#0d9488'} onMouseLeave={e => e.target.style.color = 'var(--accent-2)'}>
          Sign In
        </Link>
      </div>
    </div>
  )
}