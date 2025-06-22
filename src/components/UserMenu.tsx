import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Eye, 
  Terminal, 
  Sun, 
  Moon, 
  Monitor, 
  Palette,
  LogOut,
  ChevronRight,
  Check,
  MessageSquare
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
  const { theme, preferences, updateTheme, updatePreferences } = useTheme();
  const [showThemeSubmenu, setShowThemeSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'classic-dark' | 'system') => {
    await updateTheme(newTheme);
    setShowThemeSubmenu(false);
  };

  const toggleFeaturePreviews = async () => {
    await updatePreferences({ feature_previews: !preferences.feature_previews });
  };

  const toggleCommandMenu = async () => {
    await updatePreferences({ command_menu_enabled: !preferences.command_menu_enabled });
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
        setShowThemeSubmenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, anchorRef]);

  // Close submenu when main menu closes
  useEffect(() => {
    if (!isOpen) {
      setShowThemeSubmenu(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'classic-dark':
        return <Palette className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'classic-dark', label: 'Classic Dark', icon: <Palette className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="relative">
      {/* Main Menu */}
      <div
        ref={menuRef}
        className="absolute right-0 top-2 w-72 bg-white dark:bg-gray-800 classic-dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 classic-dark:border-gray-700 py-2 z-50"
      >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 classic-dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white classic-dark:text-gray-100 truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 classic-dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="px-2 py-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 rounded-lg transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 classic-dark:border-gray-700 my-1"></div>

        {/* Menu Items */}
        <div className="px-2 py-1 space-y-1">
          {/* Account Preferences */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span>Account preferences</span>
          </button>

          {/* Feature Previews */}
          <button 
            onClick={toggleFeaturePreviews}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Feature previews</span>
            {preferences.feature_previews && (
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </button>

          {/* Command Menu */}
          <button 
            onClick={toggleCommandMenu}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Terminal className="w-4 h-4" />
            <span>Command menu</span>
            {preferences.command_menu_enabled && (
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Theme Section */}
        <div className="px-2 py-1 mt-2">
          <div className="px-3 py-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 classic-dark:text-gray-400 uppercase tracking-wider">
              Theme
            </p>
          </div>
          
          <div className="space-y-1">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value as any)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {theme === option.value ? (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 border border-gray-400 dark:border-gray-500 classic-dark:border-gray-500 rounded-full"></div>
                  )}
                </div>
                {option.icon}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 classic-dark:border-gray-700 my-2"></div>

        {/* Log Out */}
        <div className="px-2 py-1">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 classic-dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 classic-dark:hover:bg-gray-800 rounded-lg transition-colors"
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