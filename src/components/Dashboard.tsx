import React, { useState } from 'react';
import { CheckSquare, Plus, LogOut, ArrowLeft, Filter, AlertCircle, Circle, Minus, Calendar, FileText, Clock, Play, Pause, CheckCircle2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type Priority = 'high' | 'medium' | 'low';
type Status = 'not-started' | 'in-progress' | 'completed' | 'on-hold';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
  startDate: string;
  status: Status;
  notes: string;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      text: 'Finish homework', 
      completed: false, 
      priority: 'high',
      startDate: '2025-01-15',
      status: 'in-progress',
      notes: 'Math assignment due tomorrow'
    },
    { 
      id: 2, 
      text: 'Call John', 
      completed: true, 
      priority: 'medium',
      startDate: '2025-01-14',
      status: 'completed',
      notes: 'Discuss project timeline'
    },
    { 
      id: 3, 
      text: 'Buy groceries', 
      completed: false, 
      priority: 'low',
      startDate: '2025-01-16',
      status: 'not-started',
      notes: 'Milk, bread, eggs, vegetables'
    },
  ]);
  
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [newTaskStartDate, setNewTaskStartDate] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState<Status>('not-started');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now(), 
        text: newTask.trim(), 
        completed: newTaskStatus === 'completed',
        priority: newTaskPriority,
        startDate: newTaskStartDate || new Date().toISOString().split('T')[0],
        status: newTaskStatus,
        notes: newTaskNotes.trim()
      }]);
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskStartDate('');
      setNewTaskStatus('not-started');
      setNewTaskNotes('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        return { 
          ...task, 
          completed: newCompleted,
          status: newCompleted ? 'completed' : 'in-progress'
        };
      }
      return task;
    }));
  };

  const updateTaskStatus = (id: number, newStatus: Status) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { 
          ...task, 
          status: newStatus,
          completed: newStatus === 'completed'
        };
      }
      return task;
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
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
      case 'not-started':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'on-hold':
        return <Pause className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityBadgeColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
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
    const statusOrder = { 'in-progress': 4, 'not-started': 3, 'on-hold': 2, 'completed': 1 };
    
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-300 to-white relative overflow-hidden">
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

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>
        
        <Link 
          to="/" 
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>

      {/* Main Content */}
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

        {/* Task Management Section */}
        <div className="w-full max-w-6xl">
          {/* Add New Task Form */}
          <form onSubmit={addTask} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Name</label>
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as Status)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newTaskStartDate}
                    onChange={(e) => setNewTaskStartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    placeholder="Add any additional notes or details..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </form>

          {/* Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filter Tasks</h3>
            </div>
            
            {/* Priority Filters */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Priority</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setPriorityFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    priorityFilter === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                        : priority === 'high' ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200' :
                          priority === 'medium' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200' :
                          'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
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
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Status</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    statusFilter === 'all'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>All Status</span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {getStatusCount('all')}
                  </span>
                </button>
                
                {(['not-started', 'in-progress', 'completed', 'on-hold'] as Status[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      statusFilter === status
                        ? status === 'not-started' ? 'bg-gray-500 text-white shadow-lg' :
                          status === 'in-progress' ? 'bg-blue-500 text-white shadow-lg' :
                          status === 'completed' ? 'bg-green-500 text-white shadow-lg' :
                          'bg-yellow-500 text-white shadow-lg'
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
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white/95 transition-all duration-300"
              >
                {/* Main Task Row */}
                <div className="p-4 flex items-center gap-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {task.completed && <CheckSquare className="w-4 h-4" />}
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
                      task.completed
                        ? 'text-gray-500 line-through'
                        : 'text-gray-800'
                    }`}
                  >
                    {task.text}
                  </span>

                  {/* Start Date */}
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(task.startDate)}</span>
                  </div>

                  {/* Notes Indicator */}
                  {task.notes && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <FileText className="w-4 h-4" />
                    </div>
                  )}

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    {expandedTask === task.id ? <X className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedTask === task.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status Update */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                        </select>
                      </div>

                      {/* Task Details */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Details</label>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Start Date: {formatDate(task.startDate)}</span>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700">
                          {task.notes}
                        </div>
                      </div>
                    )}
                  </div>
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