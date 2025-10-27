import React, { useState, useEffect, useContext, createContext } from 'react'
import { AuthService } from '../services/authService'

const AuthContext = createContext(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged(async (user) => {
      setUser(user)
      
      if (user) {
        try {
          const adminData = await AuthService.getAdminUser(user.uid)
          setAdminUser(adminData)
        } catch (error) {
          console.error('Error fetching admin user:', error)
          setAdminUser(null)
        }
      } else {
        setAdminUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email, password) => {
    try {
      const adminData = await AuthService.signIn(email, password)
      setAdminUser(adminData)
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setAdminUser(null)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email) => {
    try {
      await AuthService.resetPassword(email)
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (newPassword) => {
    try {
      await AuthService.changePassword(newPassword)
    } catch (error) {
      throw error
    }
  }

  const updateProfile = async (displayName, photoURL) => {
    try {
      await AuthService.updateProfile(displayName, photoURL)
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    adminUser,
    loading,
    signIn,
    signOut,
    resetPassword,
    changePassword,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}