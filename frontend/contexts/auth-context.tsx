"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "provider" | "client"
  phone?: string
  avatarUrl?: string
  bio?: string
  location?: string
  categories?: string[]
  experienceYears?: number
  socialLinks?: {
    instagram?: string
    whatsapp?: string
    facebook?: string
  }
  ratingsAverage?: number
  ratingsCount?: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on mount
    try {
      const storedToken = localStorage.getItem("beautislot_token")
      const storedUser = localStorage.getItem("beautislot_user")

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error)
      // Clear corrupted data
      localStorage.removeItem("beautislot_token")
      localStorage.removeItem("beautislot_user")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (newToken: string, userData: User) => {
    try {
      setToken(newToken)
      setUser(userData)
      localStorage.setItem("beautislot_token", newToken)
      localStorage.setItem("beautislot_user", JSON.stringify(userData))
    } catch (error) {
      console.error("Error storing auth data:", error)
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      // Always clear local state and storage
      setToken(null)
      setUser(null)
      localStorage.removeItem("beautislot_token")
      localStorage.removeItem("beautislot_user")
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        localStorage.setItem("beautislot_user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Error updating user data:", error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
