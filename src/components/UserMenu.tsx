import React, { useRef, useEffect } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Palette,
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

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'classic-dark' | 'system') => {
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

  if (!isOpen) return null;

  const themeOptions = [
    { value: 'dark', label: 'Dark', icon: <div className="w-2 h-2 bg-current rounded-full" /> },
    { value: 'light', label: 'Light', icon: <div className="w-2 h-2 border border-current rounded-full" /> },
    { value: 'classic-dark', label: 'Classic Dark', icon: <div className="w-2 h-2 border border-current rounded-full" /> },
    { value: 'system', label: 'System', icon: <div className="w-2 h-2 border border-current rounded-full" /> },
  ];

  return (
    <div className="relative">
      <div
        ref={menuRef}
        className="absolute right-0 top-2 w-64 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
      >
        {/* User Email Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <p className="text-sm text-white font-medium">
            {user?.email}
          </p>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {/* Account Preferences */}
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">
            <Settings className="w-4 h-4" />
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
                <div className="w-4 h-4 flex items-center justify-center">
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
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;