export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      responses: {
        Row: {
          access_ease: string
          casino_experience: string
          created_at: string
          cs_service: string
          data_security: string
          deposit_speed: string
          id: string
          overall_rating: number
          preferred_cs_media: string
          referral_other: string | null
          referral_source: string
          registration_ease: string
          response_number: number
          slot_experience: string
          suggestions: string | null
          togel_experience: string
          user_id: string
          whatsapp: string
          withdraw_issue: string
          withdraw_speed: string
          would_recommend: string
        }
        Insert: {
          access_ease: string
          casino_experience: string
          created_at?: string
          cs_service: string
          data_security: string
          deposit_speed: string
          id?: string
          overall_rating?: number
          preferred_cs_media: string
          referral_other?: string | null
          referral_source: string
          registration_ease: string
          response_number?: number
          slot_experience: string
          suggestions?: string | null
          togel_experience: string
          user_id: string
          whatsapp: string
          withdraw_issue: string
          withdraw_speed: string
          would_recommend: string
        }
        Update: {
          access_ease?: string
          casino_experience?: string
          created_at?: string
          cs_service?: string
          data_security?: string
          deposit_speed?: string
          id?: string
          overall_rating?: number
          preferred_cs_media?: string
          referral_other?: string | null
          referral_source?: string
          registration_ease?: string
          response_number?: number
          slot_experience?: string
          suggestions?: string | null
          togel_experience?: string
          user_id?: string
          whatsapp?: string
          withdraw_issue?: string
          withdraw_speed?: string
          would_recommend?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string | null
          background_color: string | null
          background_url: string | null
          cs_contact: string | null
          favicon_url: string | null
          header_color: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          progress_color: string | null
          site_description: string
          site_name: string
          site_title: string
          updated_at: string
        }
        Insert: {
          accent_color?: string | null
          background_color?: string | null
          background_url?: string | null
          cs_contact?: string | null
          favicon_url?: string | null
          header_color?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          progress_color?: string | null
          site_description?: string
          site_name?: string
          site_title?: string
          updated_at?: string
        }
        Update: {
          accent_color?: string | null
          background_color?: string | null
          background_url?: string | null
          cs_contact?: string | null
          favicon_url?: string | null
          header_color?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          progress_color?: string | null
          site_description?: string
          site_name?: string
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_survey: {
        Args: {
          p_access_ease?: string
          p_casino_experience?: string
          p_cs_service?: string
          p_data_security?: string
          p_deposit_speed?: string
          p_overall_rating?: number
          p_preferred_cs_media?: string
          p_referral_other?: string
          p_referral_source: string
          p_registration_ease?: string
          p_slot_experience?: string
          p_suggestions?: string
          p_togel_experience?: string
          p_user_id: string
          p_whatsapp: string
          p_withdraw_issue?: string
          p_withdraw_speed?: string
          p_would_recommend?: string
        }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
