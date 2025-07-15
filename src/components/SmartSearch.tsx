import React, { useState } from 'react';
import { Search, Clock, Play, CheckCircle2, AlertCircle, Circle, Minus, Calendar, FileText, Loader, X } from 'lucide-react';
import { useSmartSearch } from '../hooks/useSmartSearch';

function SmartSearch() {
  const [query, setQuery] = useState('');
  const { results, loading, error, searchTasks, clearResults } = useSmartSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      await searchTasks(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    clearResults();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Circle className="w-4 h-4" />;
      case 'low':
        return <Minus className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <Play className="w-4 h-4" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 text-gray-800 dark:text-gray-200 classic-dark:text-gray-300 border-gray-200 dark:border-gray-600 classic-dark:border-gray-700';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 classic-dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 classic-dark:text-blue-300 border-blue-200 dark:border-blue-700 classic-dark:border-blue-600';
      case 'done':
        return 'bg-green-100 dark:bg-green-900/30 classic-dark:bg-green-900/40 text-green-800 dark:text-green-200 classic-dark:text-green-300 border-green-200 dark:border-green-700 classic-dark:border-green-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 text-gray-800 dark:text-gray-200 classic-dark:text-gray-300 border-gray-200 dark:border-gray-600 classic-dark:border-gray-700';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 classic-dark:bg-red-900/40 text-red-800 dark:text-red-200 classic-dark:text-red-300 border-red-200 dark:border-red-700 classic-dark:border-red-600';
      case 'medium':
        return 'bg-orange-100 dark:bg-orange-900/30 classic-dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 classic-dark:text-orange-300 border-orange-200 dark:border-orange-700 classic-dark:border-orange-600';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 classic-dark:bg-green-900/40 text-green-800 dark:text-green-200 classic-dark:text-green-300 border-green-200 dark:border-green-700 classic-dark:border-green-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 text-gray-800 dark:text-gray-200 classic-dark:text-gray-300 border-gray-200 dark:border-gray-600 classic-dark:border-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatSimilarity = (similarity: number) => {
    return Math.round(similarity * 100);
  };

  return (
    <div className="w-full max-w-6xl mb-8">
      {/* Search Input */}
      <div className="bg-sky-50 dark:bg-sky-900/20 classic-dark:bg-sky-900/30 backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-colors duration-300">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="smart-search" className="block text-sm font-semibold text-sky-800 dark:text-sky-200 classic-dark:text-sky-300 mb-2">
                Smart Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-sky-500 dark:text-sky-400 classic-dark:text-sky-300" />
                </div>
                <input
                  type="text"
                  id="smart-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tasks by meaning, not just keywords..."
                  className="block w-full pl-10 pr-10 py-3 border border-sky-200 dark:border-sky-700 classic-dark:border-sky-600 rounded-xl text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 placeholder-sky-500 dark:placeholder-sky-400 classic-dark:placeholder-sky-300 bg-white dark:bg-gray-800 classic-dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300"
                  disabled={loading}
                />
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sky-500 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-200 classic-dark:text-sky-300 classic-dark:hover:text-sky-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-900/20 classic-dark:bg-red-900/30 border border-red-200 dark:border-red-800 classic-dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 classic-dark:text-red-300 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 classic-dark:text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-sky-800 dark:text-sky-200 classic-dark:text-sky-300 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Results ({results.length})
            </h3>
            
            <div className="space-y-3">
              {results.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 classic-dark:bg-gray-900 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-sky-100 dark:border-sky-800 classic-dark:border-sky-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Priority and Status Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)}
                        <span className="capitalize">{task.priority}</span>
                      </div>
                      
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span className="capitalize">{task.status.replace('-', ' ')}</span>
                      </div>
                    </div>

                    {/* Task Title */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 font-medium truncate">
                        {task.title}
                      </h4>
                      {task.notes && (
                        <p className="text-gray-600 dark:text-gray-400 classic-dark:text-gray-300 text-sm mt-1 line-clamp-2">
                          {task.notes}
                        </p>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 classic-dark:text-gray-300 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(task.start_date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 bg-sky-100 dark:bg-sky-900/30 classic-dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 classic-dark:text-sky-200 px-2 py-1 rounded-full">
                        <span className="text-xs font-medium">{formatSimilarity(task.similarity)}% match</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {query && !loading && results.length === 0 && !error && (
          <div className="mt-6 text-center py-8">
            <Search className="w-12 h-12 text-sky-400 dark:text-sky-500 classic-dark:text-sky-600 mx-auto mb-3" />
            <p className="text-sky-700 dark:text-sky-300 classic-dark:text-sky-400 font-medium">
              No similar tasks found
            </p>
            <p className="text-sky-600 dark:text-sky-400 classic-dark:text-sky-500 text-sm mt-1">
              Try different keywords or create a new task
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartSearch;