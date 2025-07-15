import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Database } from '../types/database'

type Subtask = Database['public']['Tables']['subtasks']['Row']
type SubtaskInsert = Database['public']['Tables']['subtasks']['Insert']
type SubtaskUpdate = Database['public']['Tables']['subtasks']['Update']

export function useSubtasks(parentTaskId: string) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch subtasks for a specific parent task
  const fetchSubtasks = async () => {
    if (!user || !parentTaskId) {
      setSubtasks([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) throw error
      setSubtasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Add subtask
  const addSubtask = async (subtaskData: Omit<SubtaskInsert, 'user_id' | 'parent_task_id'>) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert([{ 
          ...subtaskData, 
          user_id: user.id,
          parent_task_id: parentTaskId
        }])
        .select()
        .single()

      if (error) throw error
      
      setSubtasks(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add subtask'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Update subtask
  const updateSubtask = async (id: string, updates: SubtaskUpdate) => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setSubtasks(prev => prev.map(subtask => subtask.id === id ? data : subtask))
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update subtask'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Delete subtask
  const deleteSubtask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subtasks')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSubtasks(prev => prev.filter(subtask => subtask.id !== id))
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete subtask'
      setError(errorMessage)
      return { error: errorMessage }
    }
  }

  // Toggle subtask completion
  const toggleSubtask = async (id: string) => {
    const subtask = subtasks.find(s => s.id === id)
    if (!subtask) return { error: 'Subtask not found' }

    const newStatus = subtask.status === 'done' ? 'pending' : 'done'
    return updateSubtask(id, { status: newStatus })
  }

  useEffect(() => {
    fetchSubtasks()
  }, [user, parentTaskId])

  return {
    subtasks,
    loading,
    error,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtask,
    refetch: fetchSubtasks
  }
}