import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, logout as apiLogout } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const checkUser = async () => {
    const token = localStorage.getItem('access')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await getMe()
      setUser(res.data)
    } catch {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
    } finally {
      setLoading(false)
    }
  }

  checkUser()
}, [])

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)