import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config.js'

export class AuthService {
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get admin user data
      const adminUser = await this.getAdminUser(user.uid)
      if (!adminUser) {
        throw new Error('User not found in admin database')
      }
      
      if (!adminUser.isActive) {
        throw new Error('Account is deactivated')
      }
      
      // Update last login
      await updateDoc(doc(db, 'adminUsers', user.uid), {
        lastLogin: Timestamp.now()
      })
      
      return adminUser
    } catch (error) {
      throw error
    }
  }

  static async signOut() {
    try {
      await signOut(auth)
    } catch (error) {
      throw error
    }
  }

  static async getAdminUser(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'adminUsers', uid))
      if (userDoc.exists()) {
        return { id: uid, ...userDoc.data() }
      }
      
      // If user doesn't exist in adminUsers, create a default admin user
      const currentUser = auth.currentUser
      const defaultAdminUser = {
        id: uid,
        email: currentUser?.email || 'admin@example.com',
        role: 'super_admin',
        permissions: ['all'],
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        isActive: true,
        name: currentUser?.displayName || 'Admin User'
      }
      
      await this.createAdminUser(defaultAdminUser)
      return defaultAdminUser
    } catch (error) {
      throw error
    }
  }

  static async createAdminUser(userData) {
    try {
      await setDoc(doc(db, 'adminUsers', userData.id), userData)
    } catch (error) {
      throw error
    }
  }

  static async updateAdminUser(uid, updates) {
    try {
      await updateDoc(doc(db, 'adminUsers', uid), updates)
    } catch (error) {
      throw error
    }
  }

  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      throw error
    }
  }

  static async changePassword(newPassword) {
    try {
      const user = auth.currentUser
      if (user) {
        await updatePassword(user, newPassword)
      }
    } catch (error) {
      throw error
    }
  }

  static async updateProfile(displayName, photoURL) {
    try {
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, { displayName, photoURL })
      }
    } catch (error) {
      throw error
    }
  }

  static onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  }

  static getUserPermissions(role) {
    const permissions = {
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false,
      canManageUsers: false,
      canViewAnalytics: false,
      canManageContent: false,
      canUploadFiles: false,
      canManageSettings: false
    }

    switch (role) {
      case 'super_admin':
        return {
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canManageUsers: true,
          canViewAnalytics: true,
          canManageContent: true,
          canUploadFiles: true,
          canManageSettings: true
        }
      case 'admin':
        return {
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: true,
          canManageUsers: false,
          canViewAnalytics: true,
          canManageContent: true,
          canUploadFiles: true,
          canManageSettings: false
        }
      case 'editor':
        return {
          canCreateProjects: true,
          canEditProjects: true,
          canDeleteProjects: false,
          canManageUsers: false,
          canViewAnalytics: false,
          canManageContent: true,
          canUploadFiles: true,
          canManageSettings: false
        }
      default:
        return permissions
    }
  }
}
