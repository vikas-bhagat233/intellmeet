import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import api from '../../services/api';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password Recovery Flow State variables
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: Verify Email, 2: Submit security answer
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back to IntellMeet!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  // Step 1: Fetch the user's security question
  const handleFetchQuestion = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error('Please enter your email address');

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password/question', { email: forgotEmail });
      const question = response.data?.data?.question;
      setSecurityQuestion(question || "What is your mother's name?");
      setForgotStep(2);
      toast.success('Security question found!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to locate user with this email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Validate the security answer and set the new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!securityAnswer || !newPassword) return toast.error('All fields are required');

    setLoading(true);
    try {
      await api.post('/auth/forgot-password/reset', {
        email: forgotEmail,
        securityAnswer,
        newPassword
      });
      toast.success('Password reset successfully! Please sign in.');
      setIsForgotPassword(false);
      setForgotStep(1);
      setForgotEmail('');
      setSecurityAnswer('');
      setNewPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Incorrect security answer. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render Password Recovery Panel
  if (isForgotPassword) {
    return (
      <div className="card card--form" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
            🔑
          </div>
          <h2 className="form-title" style={{ marginBottom: 8 }}>Password Recovery</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: '1.5' }}>
            {forgotStep === 1 
              ? 'Provide your account email address to retrieve your registered recovery question.'
              : 'Answer your recovery question below to update your key credentials.'
            }
          </p>
        </div>

        {forgotStep === 1 ? (
          <form onSubmit={handleFetchQuestion} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com"
              value={forgotEmail} 
              onChange={(e) => setForgotEmail(e.target.value)} 
              required 
            />
            <Button type="submit" variant="primary" style={{ marginTop: 6, width: '100%' }} disabled={loading}>
              {loading ? 'Checking records...' : 'Fetch Question 🔍'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '14px 18px',
              borderRadius: 12,
              fontSize: 14,
              color: '#fff',
              marginBottom: 4,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 11, display: 'block', textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.5px' }}>Security Question</span>
              {securityQuestion}
            </div>

            <Input 
              label="Your Answer" 
              type="text" 
              placeholder="Type your security answer..."
              value={securityAnswer} 
              onChange={(e) => setSecurityAnswer(e.target.value)} 
              required 
            />

            <Input 
              label="New Password" 
              type="password" 
              placeholder="Min. 6 characters"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />

            <Button type="submit" variant="primary" style={{ marginTop: 6, width: '100%' }} disabled={loading}>
              {loading ? 'Resetting key...' : 'Update Password ⚙️'}
            </Button>
          </form>
        )}

        <div style={{ 
          textAlign: 'center', 
          marginTop: 24, 
          paddingTop: 16, 
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 13, 
          color: 'var(--muted)' 
        }}>
          Remembered your key?{' '}
          <button 
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setForgotStep(1);
              setForgotEmail('');
              setSecurityAnswer('');
              setNewPassword('');
            }}
            style={{ 
              background: 'none',
              border: 'none',
              color: 'var(--accent)', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
              transition: 'color 0.2s' 
            }} 
            onMouseEnter={e => e.target.style.color = '#8b5cf6'} 
            onMouseLeave={e => e.target.style.color = 'var(--accent)'}
          >
            Sign In here
          </button>
        </div>
      </div>
    );
  }

  // Standard Login Panel
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
        
        {/* Forgot Password Trigger */}
        <div style={{ textAlign: 'right', marginTop: -2, marginBottom: 12 }}>
          <button
            type="button"
            onClick={() => setIsForgotPassword(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--muted)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'color 0.2s',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 500
            }}
            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}
          >
            Forgot Password? Key Recovery
          </button>
        </div>
        
        <Button type="submit" variant="primary" style={{ width: '100%' }}>
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
  );
}