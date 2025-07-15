import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface SearchResult {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'done'
  start_date: string
  notes: string
  created_at: string
  similarity: number
}

export function useSmartSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  const searchTasks = async (query: string): Promise<SearchResult[] | null> => {
    if (!query.trim() || !user) {
      setResults([])
      return []
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          query: query.trim(),
          userId: user.id 
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Search failed')
      }

      const data = await response.json()
      const searchResults = data.results || []
      
      setResults(searchResults)
      return searchResults
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      setResults([])
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setError(null)
  }

  return {
    results,
    loading,
    error,
    searchTasks,
    clearResults
  }
}