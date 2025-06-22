import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message);
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/login" 
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Login</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo/Icon Section */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg">
            <Mail className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight">
          Forgot Password
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 text-center mb-12 max-w-md leading-relaxed">
          {isSubmitted 
            ? "Check your email for password reset instructions."
            : "Enter your email address and we'll send you a link to reset your password."
          }
        </p>

        {/* Forgot Password Form */}
        <div className="w-full max-w-md">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email address"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Send Reset Link Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 flex items-center justify-center gap-3 mt-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="text-lg">Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span className="text-lg">Send Reset Link</span>
                  </>
                )}
              </button>

              {/* Additional Links */}
              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300">
                    Back to Login
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Email Sent!</h3>
                <p className="text-gray-600">
                  We've sent password reset instructions to <strong>{email}</strong>
                </p>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/login"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Back to Login
                </Link>
                
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                    setError('');
                  }}
                  className="block w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors duration-300"
                >
                  Send to a different email
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;