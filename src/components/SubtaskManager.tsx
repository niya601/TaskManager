import React, { useState } from 'react';
import { Sparkles, Plus, CheckSquare, Clock, Play, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { useSubtasks } from '../hooks/useSubtasks';
import { useAISubtasks } from '../hooks/useAISubtasks';

interface SubtaskManagerProps {
  taskId: string;
  taskTitle: string;
}

function SubtaskManager({ taskId, taskTitle }: SubtaskManagerProps) {
  const { subtasks, loading, addSubtask, toggleSubtask, deleteSubtask } = useSubtasks(taskId);
  const { generateSubtasks, loading: aiLoading, error: aiError } = useAISubtasks();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerateSubtasks = async () => {
    const generatedSubtasks = await generateSubtasks(taskTitle);
    if (generatedSubtasks) {
      setSuggestions(generatedSubtasks);
      setShowSuggestions(true);
    }
  };

  const handleSaveSuggestion = async (suggestion: string) => {
    const result = await addSubtask({ title: suggestion });
    if (!result.error) {
      // Remove the saved suggestion from the list
      setSuggestions(prev => prev.filter(s => s !== suggestion));
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

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-gray-50/50 dark:bg-gray-700/30 classic-dark:bg-gray-800/30 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 classic-dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-600 classic-dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Generate Subtasks Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerateSubtasks}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
        >
          {aiLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Subtasks with AI</span>
            </>
          )}
        </button>
      </div>

      {/* AI Error */}
      {aiError && (
        <div className="bg-red-50 dark:bg-red-900/20 classic-dark:bg-red-900/30 border border-red-200 dark:border-red-800 classic-dark:border-red-700 rounded-lg p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 classic-dark:text-red-300 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-300 classic-dark:text-red-200 text-sm">{aiError}</p>
        </div>
      )}

      {/* AI Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 classic-dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 classic-dark:border-purple-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 classic-dark:text-purple-300 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Suggested Subtasks
          </h4>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 classic-dark:bg-gray-900 p-3 rounded-lg border border-purple-200 dark:border-purple-700 classic-dark:border-purple-600">
                <span className="text-gray-800 dark:text-gray-200 classic-dark:text-gray-100 text-sm flex-1">
                  {suggestion}
                </span>
                <button
                  onClick={() => handleSaveSuggestion(suggestion)}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors duration-200"
                >
                  <Plus className="w-3 h-3" />
                  Save
                </button>
              </div>
            ))}
          </div>
          {suggestions.length === 0 && (
            <p className="text-purple-600 dark:text-purple-300 classic-dark:text-purple-400 text-sm text-center py-2">
              All suggestions have been saved!
            </p>
          )}
        </div>
      )}

      {/* Existing Subtasks */}
      {subtasks.length > 0 && (
        <div className="bg-gray-50/50 dark:bg-gray-700/30 classic-dark:bg-gray-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Subtasks ({subtasks.length})
          </h4>
          <div className="space-y-2">
            {subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 classic-dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-600 classic-dark:border-gray-700"
              >
                {/* Completion Toggle */}
                <button
                  onClick={() => toggleSubtask(subtask.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    subtask.status === 'done'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 hover:border-blue-500'
                  }`}
                >
                  {subtask.status === 'done' && <CheckSquare className="w-3 h-3" />}
                </button>

                {/* Status Badge */}
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subtask.status)}`}>
                  {getStatusIcon(subtask.status)}
                  <span className="capitalize">{subtask.status.replace('-', ' ')}</span>
                </div>

                {/* Subtask Title */}
                <span
                  className={`flex-1 text-sm transition-all duration-300 ${
                    subtask.status === 'done'
                      ? 'text-gray-500 dark:text-gray-400 classic-dark:text-gray-500 line-through'
                      : 'text-gray-800 dark:text-gray-200 classic-dark:text-gray-100'
                  }`}
                >
                  {subtask.title}
                </span>

                {/* Delete Button */}
                <button
                  onClick={() => deleteSubtask(subtask.id)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 classic-dark:hover:bg-red-900/30 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubtaskManager;