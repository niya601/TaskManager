import React from 'react';
import { CheckSquare, LogIn, UserPlus, LayoutDashboard, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';

function Home() {
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const userMenuRef = React.useRef<HTMLButtonElement>(null);

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

      {/* Header with User Account */}
      {user && (
        <div className="absolute top-6 right-6 z-20">
          <div className="relative">
            <button
              ref={userMenuRef}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
            >
              <span className="font-medium">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <UserMenu 
              isOpen={showUserMenu}
              onClose={() => setShowUserMenu(false)}
              anchorRef={userMenuRef}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo/Icon Section */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg">
            <CheckSquare className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mb-4 tracking-tight">
          Welcome to
          <span className="block bg-gradient-to-r from-white via-blue-100 to-sky-200 bg-clip-text text-transparent">
            TaskFlow Pro
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 text-center mb-16 max-w-2xl leading-relaxed">
          Organize your life, boost your productivity, and achieve your goals with our intuitive task management solution.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl px-4">
          {user ? (
            // Show Dashboard button if user is logged in
            <Link to="/dashboard" className="group flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 min-h-[80px]">
              <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl">Go to Dashboard</span>
            </Link>
          ) : (
            // Show Login/Signup buttons if user is not logged in
            <>
              {/* Login Button */}
              <Link to="/login" className="group flex-1 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 min-h-[80px]">
                <LogIn className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xl">Login</span>
              </Link>

              {/* Signup Button */}
              <Link to="/signup" className="group flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 min-h-[80px]">
                <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xl">Sign Up</span>
              </Link>

              {/* Dashboard Button (Demo) */}
              <Link to="/dashboard" className="group flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 min-h-[80px]">
                <LayoutDashboard className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xl">Try Demo</span>
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full px-4">
          <div className="text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 classic-dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 hover:bg-white/90 dark:hover:bg-gray-800/90 classic-dark:hover:bg-gray-900/90 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-800 dark:text-gray-200 classic-dark:text-gray-100 font-semibold text-lg mb-2">Easy Task Creation</h3>
              <p className="text-gray-600 dark:text-gray-400 classic-dark:text-gray-300 text-sm">Create and organize tasks with just a few clicks</p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 classic-dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 hover:bg-white/90 dark:hover:bg-gray-800/90 classic-dark:hover:bg-gray-900/90 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-800 dark:text-gray-200 classic-dark:text-gray-100 font-semibold text-lg mb-2">Smart Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-400 classic-dark:text-gray-300 text-sm">Track your progress with intuitive insights</p>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 classic-dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 hover:bg-white/90 dark:hover:bg-gray-800/90 classic-dark:hover:bg-gray-900/90 transition-all duration-300 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-800 dark:text-gray-200 classic-dark:text-gray-100 font-semibold text-lg mb-2">Secure Authentication</h3>
              <p className="text-gray-600 dark:text-gray-400 classic-dark:text-gray-300 text-sm">Your data is safe with enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;