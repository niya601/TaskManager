import React, { useState, useRef } from 'react';
import { CheckSquare, Plus, ArrowLeft, Filter, AlertCircle, Circle, Minus, Calendar, FileText, Clock, Play, CheckCircle2, X, Loader, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../contexts/ThemeContext';
import UserMenu from './UserMenu';
import SubtaskManager from './SubtaskManager';

type Priority = 'high' | 'medium' | 'low';
type Status = 'pending' | 'in-progress' | 'done';

function Dashboard() {
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskStartDate, setNewTaskStartDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<Status>('pending');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLButtonElement>(null);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setSubmitting(true);
    const { error } = await addTask({
      title: newTask.trim(),
      priority: newTaskPriority,
      status: newTaskStatus,
      start_date: newTaskStartDate || new Date().toISOString().split('T')[0],
      notes: newTaskNotes.trim()
    });

    if (!error) {
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskStartDate('');
      setNewTaskStatus('pending');
      setNewTaskNotes('');
    }
    setSubmitting(false);
  };

  const handleToggleTask = async (id: string) => {
    await toggleTask(id);
  };

  const handleUpdateTaskStatus = async (id: string, newStatus: Status) => {
    await updateTask(id, { status: newStatus });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Circle className="w-4 h-4" />;
      case 'low':
        return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <Play className="w-4 h-4" />;
      case 'done':
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 text-gray-800 dark:text-gray-200 classic-dark:text-gray-300 border-gray-200 dark:border-gray-600 classic-dark:border-gray-700';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 classic-dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 classic-dark:text-blue-300 border-blue-200 dark:border-blue-700 classic-dark:border-blue-600';
      case 'done':
        return 'bg-green-100 dark:bg-green-900/30 classic-dark:bg-green-900/40 text-green-800 dark:text-green-200 classic-dark:text-green-300 border-green-200 dark:border-green-700 classic-dark:border-green-600';
    }
  };

  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 classic-dark:bg-red-900/40 text-red-800 dark:text-red-200 classic-dark:text-red-300 border-red-200 dark:border-red-700 classic-dark:border-red-600';
      case 'medium':
        return 'bg-orange-100 dark:bg-orange-900/30 classic-dark:bg-orange-900/40 text-orange-800 dark:text-orange-200 classic-dark:text-orange-300 border-orange-200 dark:border-orange-700 classic-dark:border-orange-600';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 classic-dark:bg-green-900/40 text-green-800 dark:text-green-200 classic-dark:text-green-300 border-green-200 dark:border-green-700 classic-dark:border-green-600';
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

  const filteredTasks = tasks.filter(task => {
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    return priorityMatch && statusMatch;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const statusOrder = { 'in-progress': 4, 'pending': 3, 'done': 1 };
    
    if (a.status !== b.status) {
      return statusOrder[b.status] - statusOrder[a.status];
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const getTaskCount = (priority: Priority | 'all') => {
    if (priority === 'all') return tasks.length;
    return tasks.filter(task => task.priority === priority).length;
  };

  const getStatusCount = (status: Status | 'all') => {
    if (status === 'all') return tasks.length;
    return tasks.filter(task => task.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-300 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 classic-dark:from-black classic-dark:via-gray-900 classic-dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 classic-dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 classic-dark:text-blue-300 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 classic-dark:text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-300 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 classic-dark:from-black classic-dark:via-gray-900 classic-dark:to-gray-800 relative overflow-hidden transition-colors duration-300">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header with proper z-index */}
      <div className="relative z-30 flex justify-between items-center p-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* User Account Display with proper positioning */}
          <div className="relative">
            <button
              ref={userMenuRef}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
            >
              <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>
            
            <UserMenu 
              isOpen={showUserMenu}
              onClose={() => setShowUserMenu(false)}
              anchorRef={userMenuRef}
            />
          </div>
        </div>
      </div>

      {/* Main Content with lower z-index */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* Logo/Icon Section */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg">
            <CheckSquare className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight">
          Your Tasks
        </h1>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-6xl mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 classic-dark:bg-red-900/30 border border-red-200 dark:border-red-800 classic-dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 classic-dark:text-red-300 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 classic-dark:text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Task Management Section */}
        <div className="w-full max-w-6xl">
          {/* Add New Task Form */}
          <form onSubmit={handleAddTask} className="bg-white/90 dark:bg-gray-800/90 classic-dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 transition-colors duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Task Name</label>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 classic-dark:placeholder-gray-500 bg-white dark:bg-gray-700 classic-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 bg-white dark:bg-gray-700 classic-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      disabled={submitting}
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Status</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as Status)}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 bg-white dark:bg-gray-700 classic-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      disabled={submitting}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newTaskStartDate}
                    onChange={(e) => setNewTaskStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 bg-white dark:bg-gray-700 classic-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Notes</label>
                  <textarea
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    placeholder="Add any additional notes or details..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 classic-dark:placeholder-gray-500 bg-white dark:bg-gray-700 classic-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    disabled={submitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Adding Task...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Add Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Filter Section */}
          <div className="bg-white/90 dark:bg-gray-800/90 classic-dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 classic-dark:text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 classic-dark:text-gray-100">Filter Tasks</h3>
            </div>
            
            {/* Priority Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-3">By Priority</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    priorityFilter === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 classic-dark:hover:bg-gray-700'
                  }`}
                >
                  <span>All Priorities</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {getTaskCount('all')}
                  </span>
                </button>
                
                {(['high', 'medium', 'low'] as Priority[]).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      priorityFilter === priority
                        ? priority === 'high' ? 'bg-red-500 text-white shadow-lg' :
                          priority === 'medium' ? 'bg-orange-500 text-white shadow-lg' :
                          'bg-green-500 text-white shadow-lg'
                        : priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 classic-dark:bg-red-900/30 text-red-700 dark:text-red-300 classic-dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/30 classic-dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 classic-dark:border-red-700' :
                          priority === 'medium' ? 'bg-orange-50 dark:bg-orange-900/20 classic-dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 classic-dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900/30 classic-dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800 classic-dark:border-orange-700' :
                          'bg-green-50 dark:bg-green-900/20 classic-dark:bg-green-900/30 text-green-700 dark:text-green-300 classic-dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/30 classic-dark:hover:bg-green-900/40 border border-green-200 dark:border-green-800 classic-dark:border-green-700'
                    }`}
                  >
                    {getPriorityIcon(priority)}
                    <span className="capitalize">{priority} Priority</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {getTaskCount(priority)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-3">By Status</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    statusFilter === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 classic-dark:hover:bg-gray-700'
                  }`}
                >
                  <span>All Status</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {getStatusCount('all')}
                  </span>
                </button>
                
                {(['pending', 'in-progress', 'done'] as Status[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      statusFilter === status
                        ? status === 'pending' ? 'bg-gray-500 text-white shadow-lg' :
                          status === 'in-progress' ? 'bg-blue-500 text-white shadow-lg' :
                          'bg-green-500 text-white shadow-lg'
                        : `${getStatusColor(status)} hover:opacity-80`
                    }`}
                  >
                    {getStatusIcon(status)}
                    <span className="capitalize">{status.replace('-', ' ')}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {getStatusCount(status)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/90 dark:bg-gray-800/90 classic-dark:bg-gray-900/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/95 dark:hover:bg-gray-800/95 classic-dark:hover:bg-gray-900/95 transition-all duration-300"
              >
                {/* Main Task Row */}
                <div className="p-4 flex items-center gap-4">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.status === 'done'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 hover:border-blue-500'
                    }`}
                  >
                    {task.status === 'done' && <CheckSquare className="w-4 h-4" />}
                  </button>
                  
                  {/* Priority Badge */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeColor(task.priority)}`}>
                    {getPriorityIcon(task.priority)}
                    <span className="capitalize">{task.priority}</span>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                    <span className="capitalize">{task.status.replace('-', ' ')}</span>
                  </div>
                  
                  <span
                    className={`flex-1 text-lg transition-all duration-300 ${
                      task.status === 'done'
                        ? 'text-gray-500 dark:text-gray-400 classic-dark:text-gray-500 line-through'
                        : 'text-gray-800 dark:text-gray-200 classic-dark:text-gray-100'
                    }`}
                  >
                    {task.title}
                  </span>

                  {/* Start Date */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 classic-dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(task.start_date)}</span>
                  </div>

                  {/* Notes Indicator */}
                  {task.notes && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 classic-dark:text-gray-300">
                      <FileText className="w-4 h-4" />
                    </div>
                  )}

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="text-gray-500 dark:text-gray-400 classic-dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 classic-dark:hover:text-gray-100 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    {expandedTask === task.id ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 classic-dark:hover:bg-red-900/30 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedTask === task.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 classic-dark:border-gray-600 p-4 bg-gray-50/50 dark:bg-gray-700/30 classic-dark:bg-gray-800/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Update Status</label>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as Status)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 classic-dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 classic-dark:text-gray-200 bg-white dark:bg-gray-700 classic-dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>

                      {/* Task Details */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Task Details</label>
                        <div className="text-sm text-gray-600 dark:text-gray-400 classic-dark:text-gray-300 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Start Date: {formatDate(task.start_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(task.priority)}
                            <span>Priority: {task.priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    {task.notes && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 classic-dark:text-gray-200 mb-2">Notes</label>
                        <div className="bg-white dark:bg-gray-700 classic-dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 classic-dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-200">
                          {task.notes}
                        </div>
                      </div>
                    )}
                  </div>
                    {/* Subtask Manager */}
                    <SubtaskManager taskId={task.id} taskTitle={task.title} />
                )}
              </div>
            ))}
          </div>

          {sortedTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">
                {priorityFilter !== 'all' || statusFilter !== 'all'
                  ? "No tasks match the selected filters."
                  : "No tasks yet. Add your first task above!"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;