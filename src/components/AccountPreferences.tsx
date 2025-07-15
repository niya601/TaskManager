import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, User, Camera, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function AccountPreferences() {
  const { user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing profile picture on component mount
  useEffect(() => {
    if (user?.user_metadata?.avatar_url) {
      setProfilePicture(user.user_metadata.avatar_url);
    }
  }, [user]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Convert file to base64 data URL for storage in user metadata
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        try {
          // Update user metadata with base64 image data
          const { error: updateError } = await supabase.auth.updateUser({
            data: { avatar_url: dataUrl }
          });

          if (updateError) throw updateError;

          setProfilePicture(dataUrl);
          setUploadSuccess(true);
          
          // Clear success message after 3 seconds
          setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
          console.error('Error updating profile picture:', error);
          setUploadError(error instanceof Error ? error.message : 'Failed to update profile picture');
        } finally {
          setUploading(false);
        }
      };
      
      reader.onerror = () => {
        setUploadError('Failed to read the selected file');
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing profile picture:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to process profile picture');
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

      {/* Header */}
      <div className="relative z-30 flex justify-between items-center p-6">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Account Preferences
          </h1>
          <p className="text-lg text-white/90 max-w-md">
            Customize your profile and account settings
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 dark:bg-gray-800/90 classic-dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 classic-dark:text-gray-100 mb-6 text-center">
              Profile Picture
            </h2>

            {/* Status Messages */}
            {uploadError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 classic-dark:bg-red-900/30 border border-red-200 dark:border-red-800 classic-dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 classic-dark:text-red-300 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 classic-dark:text-red-200 text-sm">{uploadError}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 classic-dark:bg-green-900/30 border border-green-200 dark:border-green-800 classic-dark:border-green-700 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 classic-dark:text-green-300 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 classic-dark:text-green-200 text-sm">Profile picture updated successfully!</p>
              </div>
            )}

            {/* Profile Picture Display and Upload */}
            <div className="flex flex-col items-center space-y-6">
              {/* Current Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 border-4 border-white dark:border-gray-600 classic-dark:border-gray-700 shadow-lg">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400 dark:text-gray-500 classic-dark:text-gray-600" />
                    </div>
                  )}
                </div>
                
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={handleUploadClick}>
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 classic-dark:text-gray-100">
                  {user?.user_metadata?.full_name || 'User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 classic-dark:text-gray-300">
                  {user?.email}
                </p>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Profile Picture</span>
                  </>
                )}
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload Guidelines */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 classic-dark:text-gray-500 space-y-1">
                <p>Supported formats: JPG, PNG, GIF</p>
                <p>Maximum file size: 5MB</p>
                <p>Recommended size: 400x400 pixels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
      setUploadSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);

    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

      {/* Header */}
      <div className="relative z-30 flex justify-between items-center p-6">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors duration-300 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Account Preferences
          </h1>
          <p className="text-lg text-white/90 max-w-md">
            Customize your profile and account settings
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="w-full max-w-2xl">
          <div className="bg-white/90 dark:bg-gray-800/90 classic-dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-colors duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 classic-dark:text-gray-100 mb-6 text-center">
              Profile Picture
            </h2>

            {/* Status Messages */}
            {uploadError && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 classic-dark:bg-red-900/30 border border-red-200 dark:border-red-800 classic-dark:border-red-700 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 classic-dark:text-red-300 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-300 classic-dark:text-red-200 text-sm">{uploadError}</p>
              </div>
            )}

            {uploadSuccess && (
              <div className="mb-6 bg-green-50 dark:bg-green-900/20 classic-dark:bg-green-900/30 border border-green-200 dark:border-green-800 classic-dark:border-green-700 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 classic-dark:text-green-300 flex-shrink-0" />
                <p className="text-green-700 dark:text-green-300 classic-dark:text-green-200 text-sm">Profile picture updated successfully!</p>
              </div>
            )}

            {/* Profile Picture Display and Upload */}
            <div className="flex flex-col items-center space-y-6">
              {/* Current Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 classic-dark:bg-gray-800 border-4 border-white dark:border-gray-600 classic-dark:border-gray-700 shadow-lg">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400 dark:text-gray-500 classic-dark:text-gray-600" />
                    </div>
                  )}
                </div>
                
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={handleUploadClick}>
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 classic-dark:text-gray-100">
                  {user?.user_metadata?.full_name || 'User'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 classic-dark:text-gray-300">
                  {user?.email}
                </p>
              </div>

              {/* Upload Button */}
              <button
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300"
              >
                {uploading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload Profile Picture</span>
                  </>
                )}
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Upload Guidelines */}
              <div className="text-center text-sm text-gray-500 dark:text-gray-400 classic-dark:text-gray-500 space-y-1">
                <p>Supported formats: JPG, PNG, GIF</p>
                <p>Maximum file size: 5MB</p>
                <p>Recommended size: 400x400 pixels</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPreferences;