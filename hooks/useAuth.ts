// hooks/useAuth.ts
import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
  country?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true
  })

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAuth({
          user: data.user,
          token,
          isLoading: false
        })
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('token')
        setAuth({
          user: null,
          token: null,
          isLoading: false
        })
      }
    } catch (error) {
      setAuth({
        user: null,
        token: null,
        isLoading: false
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setAuth({
          user: data.user,
          token: data.token,
          isLoading: false
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    name: string
    country: string
  }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setAuth({
          user: data.user,
          token: data.token,
          isLoading: false
        })
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const signOut = () => {
    localStorage.removeItem('token')
    setAuth({
      user: null,
      token: null,
      isLoading: false
    })
  }

  return {
    ...auth,
    signIn,
    signUp,
    signOut
  }
}