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
      const project = {
        title: projectData.title || '',
        description: projectData.description || '',
        image: projectData.image || '',
        technologies: projectData.technologies || [],
        category: projectData.category || '',
        analysis: projectData.analysis || '',
        structure: projectData.structure || '',
        estimation: projectData.estimation || '',
        status: projectData.status || 'draft',
        createdAt: now,
        updatedAt: now,
        views: 0,
        featured: projectData.featured || false
      }
      
      const docRef = await addDoc(collection(db, 'projects'), project)
      return docRef.id
    } catch (error) {
      throw error
    }
  }

  static async updateProject(id, updates) {
    try {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
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
