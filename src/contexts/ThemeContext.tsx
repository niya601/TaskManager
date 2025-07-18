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
      console.log('ThemeContext: No user, skipping preferences load');
      setLoading(false);
      return;
    }

    console.log('ThemeContext: Loading preferences for user:', user.id);
    
    try {
      
      // Test basic connectivity first
      console.log('ThemeContext: Testing Supabase connection...');
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('ThemeContext: Supabase query error:', error);
        throw error;
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
        console.log('ThemeContext: No existing preferences found, creating defaults');
        // Create default preferences for new user
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('ThemeContext: Error loading preferences:', error);
      
      // If it's a network error, fall back to default preferences without trying to create them
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.warn('ThemeContext: Network error detected, using default preferences without database');
        setPreferences({
          theme: 'light',
          feature_previews: false,
          command_menu_enabled: true,
        });
      }
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
      console.log('Created default preferences');
    } catch (error) {
      console.error('Error creating default preferences:', error);
    }
  };

  // Update theme
  const updateTheme = async (theme: Theme) => {
    console.log('updateTheme called with:', theme);
    
    if (!user) {
      // For non-authenticated users, just update local state
      setPreferences(prev => ({ ...prev, theme }));
      console.log('Updated theme for non-authenticated user');
      return;
    }

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

      setPreferences(prev => ({ ...prev, theme }));
      console.log('Theme updated in database and state:', theme);
    } catch (error) {
      console.error('Error updating theme:', error);
      // Still update local state even if database update fails
      setPreferences(prev => ({ ...prev, theme }));
      console.log('Theme updated in local state only:', theme);
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