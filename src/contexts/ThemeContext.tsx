import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'classic-dark';

interface UserPreferences {
  theme: Theme;
  feature_previews: boolean;
  command_menu_enabled: boolean;
}

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'classic-dark';
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

  // Calculate actual theme based on preference
  const getActualTheme = (theme: Theme): 'light' | 'classic-dark' => {
    return theme;
  };

  const actualTheme = getActualTheme(preferences.theme);

  // Load user preferences
  const loadPreferences = async () => {
    if (!user) {
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      setLoading(false);
      return;
    }

    try {
      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured, using default preferences');
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
        setLoading(false);
        return;
      }

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured, using default preferences');
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
        setLoading(false);
        return;
      }

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured, using default preferences');
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
        setLoading(false);
        return;
      }

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('Supabase environment variables not configured. Using default preferences.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading preferences, using defaults:', error.message);
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
        setLoading(false);
        return;
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
        setLoading(false);
        return;
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
        setLoading(false);
        return;
      }

      if (data) {
        // Map database theme values to our simplified theme system
        let mappedTheme: Theme = 'light';
        if (data.theme === 'classic-dark' || data.theme === 'dark') {
          mappedTheme = 'classic-dark';
        }

        console.log('Loaded theme from database:', data.theme, '-> mapped to:', mappedTheme);

        setPreferences({
          theme: mappedTheme,
          feature_previews: data.feature_previews,
          command_menu_enabled: data.command_menu_enabled,
        });
      } else {
        // Create default preferences for new user
        await createDefaultPreferences();
      }
    } catch (error) {
      console.warn('Failed to connect to Supabase, using default preferences:', error);
      // Set default preferences when connection fails
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      // Set default preferences when connection fails
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      // Set default preferences when connection fails
      setPreferences({
        theme: 'light',
        feature_previews: false,
        command_menu_enabled: true,
      });
      // Don't throw error, just use default preferences
    } finally {
      setLoading(false);
    }
  };

  // Create default preferences
  const createDefaultPreferences = async () => {
    if (!user) return;

    // Skip if Supabase is not configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      return;
    }

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
      console.log('Created default preferences');
    } catch (error) {
      console.warn('Error creating default preferences:', error);
    }
  };

  // Update theme
  const updateTheme = async (theme: Theme) => {
    console.log('updateTheme called with:', theme);
    
    // Always update local state first
    setPreferences(prev => ({ ...prev, theme }));
    
    // Always update local state first
    setPreferences(prev => ({ ...prev, theme }));
    if (!user) {
      console.log('Updated theme for non-authenticated user');
      return;
    }

    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, theme updated locally only');
      return;
    }

    // Check if Supabase is properly configured
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme: theme,
          feature_previews: preferences.feature_previews,
          command_menu_enabled: preferences.command_menu_enabled,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      console.log('Theme updated in database and state:', theme);
    } catch (error) {
      console.warn('Failed to update theme in database, using local state only:', error);
    }
  };

  // Update preferences
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    // Always update local state first
    setPreferences(prev => ({ ...prev, ...updates }));
    
    if (!user) {
      console.log('Updated preferences for non-authenticated user');
      return;
    }

    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, preferences updated locally only');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      console.log('Preferences updated in database');
    } catch (error) {
      console.warn('Failed to update preferences in database, using local state only:', error);
    }
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    console.log('Applying theme to DOM:', actualTheme);
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'classic-dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Set data attribute for CSS
    root.setAttribute('data-theme', actualTheme);

    // Force a repaint to ensure styles are applied
    root.style.display = 'none';
    root.offsetHeight; // Trigger reflow
    root.style.display = '';

    console.log('Theme applied to DOM. Classes:', root.classList.toString());
    console.log('Data theme attribute:', root.getAttribute('data-theme'));
  }, [actualTheme]);

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