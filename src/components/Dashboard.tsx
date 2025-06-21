import React, { useState } from 'react';
import { CheckSquare, Plus, LogOut, ArrowLeft, Filter, AlertCircle, Circle, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

type Priority = 'high' | 'medium' | 'low';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
}

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Finish homework', completed: false, priority: 'high' },
    { id: 2, text: 'Call John', completed: true, priority: 'medium' },
    { id: 3, text: 'Buy groceries', completed: false, priority: 'low' },
    { id: 4, text: 'Prepare presentation', completed: false, priority: 'high' },
    { id: 5, text: 'Schedule dentist appointment', completed: false, priority: 'medium' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { 
        id: Date.now(), 
        text: newTask.trim(), 
        completed: false,
        priority: newTaskPriority
      }]);
      setNewTask('');
      setNewTaskPriority('medium');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
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

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-green-500 bg-green-50 border-green-200';
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

  const filteredTasks = priorityFilter === 'all' 
    ? tasks 
    : tasks.filter(task => task.priority === priorityFilter);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const getTaskCount = (priority: Priority | 'all') => {
    if (priority === 'all') return tasks.length;
    return tasks.filter(task => task.priority === priority).length;
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
        <div className="w-full max-w-4xl">
          {/* Add New Task Form */}
          <form onSubmit={addTask} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add New Task"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              
              {/* Priority Selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Priority:</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="px-3 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>
          </form>

          {/* Priority Filter Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Filter by Priority</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setPriorityFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  priorityFilter === 'all'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>All Tasks</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {getTaskCount('all')}
                </span>
              </button>
              
              <button
                onClick={() => setPriorityFilter('high')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  priorityFilter === 'high'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>High Priority</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {getTaskCount('high')}
                </span>
              </button>
              
              <button
                onClick={() => setPriorityFilter('medium')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  priorityFilter === 'medium'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                }`}
              >
                <Circle className="w-4 h-4" />
                <span>Medium Priority</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {getTaskCount('medium')}
                </span>
              </button>
              
              <button
                onClick={() => setPriorityFilter('low')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  priorityFilter === 'low'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                <Minus className="w-4 h-4" />
                <span>Low Priority</span>
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                  {getTaskCount('low')}
                </span>
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 flex items-center gap-4 hover:bg-white/95 transition-all duration-300"
              >
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
                
                <span
                  className={`flex-1 text-lg transition-all duration-300 ${
                    task.completed
                      ? 'text-gray-500 line-through'
                      : 'text-gray-800'
                  }`}
                >
                  {task.text}
                </span>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {sortedTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">
                {priorityFilter === 'all' 
                  ? "No tasks yet. Add your first task above!" 
                  : `No ${priorityFilter} priority tasks found.`
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