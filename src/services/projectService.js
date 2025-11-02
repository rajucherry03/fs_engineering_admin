import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '../firebase/config.js'

export class ProjectService {
  static async getProjects(filters, lastDoc) {
    try {
      let q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
      
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }
      
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category))
      }
      
      if (filters?.priority) {
        q = query(q, where('priority', '==', filters.priority))
      }
      
      if (filters?.dateRange) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(filters.dateRange.start)))
        q = query(q, where('createdAt', '<=', Timestamp.fromDate(filters.dateRange.end)))
      }
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }
      
      q = query(q, limit(20))
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  }

  static async getProject(id) {
    try {
      const docRef = doc(db, 'projects', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      throw error
    }
  }

  static async createProject(projectData) {
    try {
      const now = new Date().toISOString()
      let imageData = projectData.image || ''
      
      // Store base64 image directly in Firestore (same technique as existing projects)
      // If it's a base64 data URI, store it as-is; if it's a URL, store the URL
      const project = {
        title: projectData.title || '',
        description: projectData.description || '',
        image: imageData, // Store base64 data URI or URL directly in Firestore
        analysis: projectData.analysis || '',
        estimation: projectData.estimation || '',
        status: projectData.status || 'draft',
        createdAt: now,
        updatedAt: now,
        views: 0
      }

      console.log('Creating project in Firestore with base64 image...')
      const docRef = await addDoc(collection(db, 'projects'), project)
      console.log('Project created successfully with ID:', docRef.id)
      
      // Image is already stored as base64 in the document above
      // No need to upload to Storage - store base64 directly like existing data
      if (imageData && imageData.startsWith('data:image/')) {
        console.log('Image stored as base64 data URI directly in Firestore')
      } else if (imageData) {
        console.log('Image URL stored in Firestore:', imageData.substring(0, 50) + '...')
      }
      
      return docRef.id
    } catch (error) {
      console.error('Error creating project:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      
      // Provide more helpful error messages
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please check your Firebase security rules and ensure you are logged in.')
      } else if (error.code === 'unavailable') {
        throw new Error('Firebase service is currently unavailable. Please try again later.')
      } else if (error.message) {
        throw new Error(`Failed to create project: ${error.message}`)
      } else {
        throw error
      }
    }
  }

  static async updateProject(id, updates) {
    try {
      const docRef = doc(db, 'projects', id)
      
      // Store base64 image directly in Firestore (same technique as existing projects)
      // If it's a base64 data URI, store it as-is; if it's a URL, store the URL
      let imageData = updates.image
      
      if (imageData && imageData.startsWith('data:image/')) {
        // Base64 data URI - store directly in Firestore (no upload to Storage)
        console.log('Storing base64 image directly in Firestore (no Storage upload)')
        updates.image = imageData
      } else if (imageData) {
        // Already a URL - store it as-is
        console.log('Storing image URL in Firestore:', imageData.substring(0, 50) + '...')
        updates.image = imageData
      }
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      
      console.log('Project updated successfully with base64 image stored directly in Firestore')
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  static async deleteProject(id) {
    try {
      const docRef = doc(db, 'projects', id)
      await deleteDoc(docRef)
    } catch (error) {
      throw error
    }
  }

  static async bulkDeleteProjects(projectIds) {
    try {
      const batch = writeBatch(db)
      
      projectIds.forEach(id => {
        const docRef = doc(db, 'projects', id)
        batch.delete(docRef)
      })
      
      await batch.commit()
    } catch (error) {
      throw error
    }
  }

  static async bulkUpdateProjects(projectIds, updates) {
    try {
      const batch = writeBatch(db)
      
      projectIds.forEach(id => {
        const docRef = doc(db, 'projects', id)
        batch.update(docRef, {
          ...updates,
          updatedAt: new Date().toISOString()
        })
      })
      
      await batch.commit()
    } catch (error) {
      throw error
    }
  }

  static async searchProjects(searchTerm) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For production, consider using Algolia or similar
      const q = query(
        collection(db, 'projects'),
        where('title', '>=', searchTerm),
        where('title', '<=', searchTerm + '\uf8ff'),
        orderBy('title'),
        limit(20)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  }

  static async getProjectStats() {
    try {
      const projectsSnapshot = await getDocs(collection(db, 'projects'))
      const projects = projectsSnapshot.docs.map(doc => doc.data())
      
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const stats = {
        total: projects.length,
        draft: projects.filter(p => p.status === 'draft').length,
        completed: projects.filter(p => p.status === 'completed').length,
        inProgress: projects.filter(p => p.status === 'in_progress').length,
        featured: projects.filter(p => p.featured === true).length,
        thisMonth: projects.filter(p => 
          new Date(p.createdAt) >= thisMonth
        ).length,
        totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0)
      }
      
      return stats
    } catch (error) {
      throw error
    }
  }

  static async getPopularProjects(limit = 5) {
    try {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', 'completed'),
        orderBy('views', 'desc'),
        limit(Number(limit))
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  }

  // New methods for the updated project format
  static async getFeaturedProjects(limit = 5) {
    try {
      const q = query(
        collection(db, 'projects'),
        where('featured', '==', true),
        orderBy('createdAt', 'desc'),
        limit(Number(limit))
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  }

  static async getProjectsByCategory(category, limit = 10) {
    try {
      const q = query(
        collection(db, 'projects'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(Number(limit))
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  }

  static async getProjectsByTechnology(technology, limit = 10) {
    try {
      const q = query(
        collection(db, 'projects'),
        where('technologies', 'array-contains', technology),
        orderBy('createdAt', 'desc'),
        limit(Number(limit))
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      throw error
    }
  }

  static async toggleFeatured(projectId) {
    try {
      const docRef = doc(db, 'projects', projectId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const currentFeatured = docSnap.data().featured || false
        await updateDoc(docRef, { 
          featured: !currentFeatured,
          updatedAt: new Date().toISOString()
        })
        return !currentFeatured
      }
      return false
    } catch (error) {
      throw error
    }
  }

  static async incrementViews(projectId) {
    try {
      const docRef = doc(db, 'projects', projectId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0
        await updateDoc(docRef, { views: currentViews + 1 })
      }
    } catch (error) {
      throw error
    }
  }
}
