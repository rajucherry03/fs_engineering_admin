import { useState, useEffect } from 'react'
import { ProjectService } from '../services/projectService'
import { Project } from '../types/admin'
import { ProjectFilters, ProjectStats } from '../types/project'

export const useProjects = (filters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ProjectService.getProjects(filters)
        setProjects(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filters])

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'views'>) => {
    try {
      const id = await ProjectService.createProject(projectData)
      const newProject = { ...projectData, id, createdAt: new Date(), updatedAt: new Date(), views: 0 } as Project
      setProjects(prev => [newProject, ...prev])
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
      throw err
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await ProjectService.updateProject(id, updates)
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update project')
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    try {
      await ProjectService.deleteProject(id)
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
      throw err
    }
  }

  const bulkDeleteProjects = async (projectIds: string[]) => {
    try {
      await ProjectService.bulkDeleteProjects(projectIds)
      setProjects(prev => prev.filter(p => !projectIds.includes(p.id)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete projects')
      throw err
    }
  }

  const bulkUpdateProjects = async (projectIds: string[], updates: Partial<Project>) => {
    try {
      await ProjectService.bulkUpdateProjects(projectIds, updates)
      setProjects(prev => prev.map(p => 
        projectIds.includes(p.id) ? { ...p, ...updates } : p
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update projects')
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    bulkDeleteProjects,
    bulkUpdateProjects
  }
}

export const useProjectStats = () => {
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await ProjectService.getProjectStats()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
