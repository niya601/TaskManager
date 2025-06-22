export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          priority: 'high' | 'medium' | 'low'
          status: 'pending' | 'in-progress' | 'done'
          start_date: string
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          priority: 'high' | 'medium' | 'low'
          status?: 'pending' | 'in-progress' | 'done'
          start_date?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          priority?: 'high' | 'medium' | 'low'
          status?: 'pending' | 'in-progress' | 'done'
          start_date?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'classic-dark'
          feature_previews: boolean
          command_menu_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'classic-dark'
          feature_previews?: boolean
          command_menu_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'classic-dark'
          feature_previews?: boolean
          command_menu_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}