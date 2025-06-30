import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Mock users data
const mockUsers = [
  { 
    id: "1", 
    role: "Admin", 
    email: "admin@entnt.in", 
    password: "admin123",
    name: "Dr. Admin"
  },
  { 
    id: "2", 
    role: "Patient", 
    email: "patient1@entnt.in", 
    password: "patient123", 
    patientId: "p1",
    name: "Patient 1"
  }
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('dentalUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    )
    
    if (foundUser) {
      const userData = { ...foundUser }
      delete userData.password 
      
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('dentalUser', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('dentalUser')
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 