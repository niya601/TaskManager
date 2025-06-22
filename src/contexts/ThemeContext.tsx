import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark' | 'classic-dark' | 'system';

interface UserPreferences {
  theme: Theme;
  feature_previews: boolean;
  command_menu_enabled: boolean;
}

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark' | 'classic-dark';
  preferences: UserPreferences;
  loading: boolean;
  updateTheme: (theme: Theme) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    feature_previews: false,
    command_menu_enabled: true,
  });
  const [loading, setLoading] = useState(true);

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Calculate actual theme based on preference
  const getActualTheme = (theme: Theme): 'light' | 'dark' | 'classic-dark' => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };

  const actualTheme = getActualTheme(preferences.theme);

  // Load user preferences
  const loadPreferences = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          theme: data.theme,
          feature_previews: data.feature_previews,
          command_menu_enabled: data.command_menu_enabled,
        });
      } else {
        // Create default preferences for new user
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create default preferences
  const createDefaultPreferences = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .insert([{
          user_id: user.id,
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  // Update theme
  const updateTheme = async (theme: Theme) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ theme })
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(prev => ({ ...prev, theme }));
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  // Update preferences
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'classic-dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Set data attribute for CSS
    root.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Force re-render to update actualTheme
        setPreferences(prev => ({ ...prev }));
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  // Load preferences when user changes
  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      setLoading(false);
    }
  }, [user]);

  const value = {
    theme: preferences.theme,
    actualTheme,
    preferences,
    loading,
    updateTheme,
    updatePreferences,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}