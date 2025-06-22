import React, { useRef, useEffect } from 'react';
import { 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
}

function UserMenu({ isOpen, onClose, anchorRef }: UserMenuProps) {
  const { user, signOut } = useAuth();
  const { theme, updateTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleThemeChange = async (newTheme: 'light' | 'classic-dark') => {
    console.log('Changing theme to:', newTheme); // Debug log
    await updateTheme(newTheme);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, anchorRef]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'classic-dark', label: 'Classic Dark' },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu container with proper positioning */}
      <div className="absolute right-0 top-full mt-2 z-50">
        <div
          ref={menuRef}
          className="w-64 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 py-2 transform transition-all duration-200 ease-out"
          style={{
            // Ensure menu stays within viewport
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}
        >
          {/* User Email Header */}
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm text-white font-medium truncate">
              {user?.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Account Preferences */}
            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
              <Settings className="w-4 h-4 flex-shrink-0" />
              <span>Account preferences</span>
            </button>
          </div>

          {/* Theme Section */}
          <div className="py-2">
            <div className="px-4 py-2">
              <p className="text-sm text-gray-400 font-medium">
                Theme
              </p>
            </div>
            
            <div className="space-y-1">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value as any)}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                    {theme === option.value ? (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 border border-gray-500 rounded-full"></div>
                    )}
                  </div>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 my-2"></div>

          {/* Log Out */}
          <div className="py-2">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserMenu;