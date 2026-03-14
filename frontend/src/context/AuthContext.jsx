/**
 * src/context/AuthContext.jsx
 * Global authentication state using React Context.
 * 
 * WHY Context: Auth state (who is logged in) is needed everywhere —
 *              Navbar, Dashboard, ChapterPage, etc.
 *              Context lets any component access it without prop drilling.
 * 
 * WHAT it provides:
 *   user        → the logged-in user object (or null)
 *   token       → the JWT token (or null)  
 *   isLoading   → true while checking auth on page load
 *   login()     → call after successful login/register
 *   logout()    → clears everything, redirects home
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [token, setToken]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app load — check if there's a stored token and validate it
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser  = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))

      // Verify token is still valid by calling /api/auth/me
      authAPI.me()
        .then((res) => {
          setUser(res.data)
          localStorage.setItem('user', JSON.stringify(res.data))
        })
        .catch(() => {
          // Token expired or invalid — clear everything
          logout()
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  // Called after successful login or register
  const login = (tokenValue, userData) => {
    setToken(tokenValue)
    setUser(userData)
    localStorage.setItem('token', tokenValue)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — components use this instead of useContext(AuthContext) directly
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
