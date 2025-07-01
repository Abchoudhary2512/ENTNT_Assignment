import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Container,
  Paper,
  Divider,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material'
import {
  LocalHospital as HospitalIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    
    if (result.success) {
      if (result.user.role === 'Admin') {
        navigate('/')
      } else {
        navigate('/patient-view')
      }
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          {/* Logo and Title Section */}
          <Paper
            elevation={8}
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: '100%',
              maxWidth: 450,
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.22)',
              },
              animation: 'fadeIn 1s',
              '@keyframes fadeIn': {
                from: { opacity: 0, transform: 'translateY(40px)' },
                to: { opacity: 1, transform: 'none' }
              }
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <HospitalIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                ENTNT Dental
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 400,
                  letterSpacing: 1
                }}
              >
                Center Management System
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                  transition: 'background 0.3s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
                  },
                  mt: 2
                }}
              >
                {loading ? <CircularProgress size={28} sx={{ color: 'white' }} /> : 'Login'}
              </Button>
            </Box>
          </Paper>

          {/* Footer */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              mt: 2
            }}
          >
            © 2025 ENTNT Dental Center. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default Login 