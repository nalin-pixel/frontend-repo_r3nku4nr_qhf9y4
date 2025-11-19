import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const login = async (email, password) => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()
    setToken(data.access_token)
    localStorage.setItem('token', data.access_token)
    await fetchMe(data.access_token)
  }

  const signup = async (name, email, role, password) => {
    const res = await fetch(`${baseUrl}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role, password })
    })
    if (!res.ok) throw new Error('Sign up failed')
    const data = await res.json()
    setToken(data.access_token)
    localStorage.setItem('token', data.access_token)
    await fetchMe(data.access_token)
  }

  const fetchMe = async (tk = token) => {
    if (!tk) return
    const res = await fetch(`${baseUrl}/me`, { headers: { Authorization: `Bearer ${tk}` } })
    if (res.ok) {
      const u = await res.json()
      setUser(u)
      localStorage.setItem('user', JSON.stringify(u))
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  useEffect(() => { if (token && !user) fetchMe() }, [])

  const authFetch = async (url, options = {}) => {
    const headers = { ...(options.headers || {}) }
    if (token) headers.Authorization = `Bearer ${token}`
    return fetch(url, { ...options, headers })
  }

  return (
    <AuthContext.Provider value={{ token, user, login, signup, logout, authFetch, baseUrl }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
