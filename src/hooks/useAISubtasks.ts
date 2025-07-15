import { useState } from 'react'

export function useAISubtasks() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateSubtasks = async (taskTitle: string): Promise<string[] | null> => {
    if (!taskTitle.trim()) {
      setError('Task title is required')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-subtasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ taskTitle })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate subtasks')
      }

      const data = await response.json()
      return data.subtasks || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate subtasks'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    generateSubtasks,
    loading,
    error
  }
}