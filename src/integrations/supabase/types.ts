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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          created_at: string
          direct_mode: boolean | null
          id: string
          mode: string | null
          title: string | null
          updated_at: string
          use_context: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          direct_mode?: boolean | null
          id?: string
          mode?: string | null
          title?: string | null
          updated_at?: string
          use_context?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          direct_mode?: boolean | null
          id?: string
          mode?: string | null
          title?: string | null
          updated_at?: string
          use_context?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      control_exercises: {
        Row: {
          acceptance_needed: string | null
          assumptions: string | null
          created_at: string
          expectations: string | null
          facts: string | null
          fears: string | null
          id: string
          outside_control: string | null
          possible_actions: string | null
          practical_action: string | null
          rational_conclusion: string | null
          related_decision_id: string | null
          related_journal_id: string | null
          situation: string
          under_control: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acceptance_needed?: string | null
          assumptions?: string | null
          created_at?: string
          expectations?: string | null
          facts?: string | null
          fears?: string | null
          id?: string
          outside_control?: string | null
          possible_actions?: string | null
          practical_action?: string | null
          rational_conclusion?: string | null
          related_decision_id?: string | null
          related_journal_id?: string | null
          situation: string
          under_control?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acceptance_needed?: string | null
          assumptions?: string | null
          created_at?: string
          expectations?: string | null
          facts?: string | null
          fears?: string | null
          id?: string
          outside_control?: string | null
          possible_actions?: string | null
          practical_action?: string | null
          rational_conclusion?: string | null
          related_decision_id?: string | null
          related_journal_id?: string | null
          situation?: string
          under_control?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "control_exercises_related_decision_id_fkey"
            columns: ["related_decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "control_exercises_related_journal_id_fkey"
            columns: ["related_journal_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_options: {
        Row: {
          cons: string | null
          created_at: string
          decision_id: string
          id: string
          option_text: string
          pros: string | null
        }
        Insert: {
          cons?: string | null
          created_at?: string
          decision_id: string
          id?: string
          option_text: string
          pros?: string | null
        }
        Update: {
          cons?: string | null
          created_at?: string
          decision_id?: string
          id?: string
          option_text?: string
          pros?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decision_options_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          best_scenario: string | null
          category: string | null
          context: string | null
          core_problem: string | null
          cost_of_action: string | null
          cost_of_inaction: string | null
          created_at: string
          deadline: string | null
          decision_date: string | null
          deleted_at: string | null
          desire_involved: string | null
          emotional_noise: string | null
          fear_involved: string | null
          final_decision: string | null
          id: string
          impact: string | null
          impulsive_scenario: string | null
          notes: string | null
          outside_control: string | null
          provisional_verdict: string | null
          rational_scenario: string | null
          status: Database["public"]["Enums"]["decision_status"] | null
          title: string
          under_control: string | null
          updated_at: string
          urgency: string | null
          user_id: string
          values_involved: string | null
          virtues_involved: string | null
          worst_scenario: string | null
        }
        Insert: {
          best_scenario?: string | null
          category?: string | null
          context?: string | null
          core_problem?: string | null
          cost_of_action?: string | null
          cost_of_inaction?: string | null
          created_at?: string
          deadline?: string | null
          decision_date?: string | null
          deleted_at?: string | null
          desire_involved?: string | null
          emotional_noise?: string | null
          fear_involved?: string | null
          final_decision?: string | null
          id?: string
          impact?: string | null
          impulsive_scenario?: string | null
          notes?: string | null
          outside_control?: string | null
          provisional_verdict?: string | null
          rational_scenario?: string | null
          status?: Database["public"]["Enums"]["decision_status"] | null
          title: string
          under_control?: string | null
          updated_at?: string
          urgency?: string | null
          user_id: string
          values_involved?: string | null
          virtues_involved?: string | null
          worst_scenario?: string | null
        }
        Update: {
          best_scenario?: string | null
          category?: string | null
          context?: string | null
          core_problem?: string | null
          cost_of_action?: string | null
          cost_of_inaction?: string | null
          created_at?: string
          deadline?: string | null
          decision_date?: string | null
          deleted_at?: string | null
          desire_involved?: string | null
          emotional_noise?: string | null
          fear_involved?: string | null
          final_decision?: string | null
          id?: string
          impact?: string | null
          impulsive_scenario?: string | null
          notes?: string | null
          outside_control?: string | null
          provisional_verdict?: string | null
          rational_scenario?: string | null
          status?: Database["public"]["Enums"]["decision_status"] | null
          title?: string
          under_control?: string | null
          updated_at?: string
          urgency?: string | null
          user_id?: string
          values_involved?: string | null
          virtues_involved?: string | null
          worst_scenario?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          actual_response: string | null
          automatic_thought: string | null
          context: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          emotional_intensity: number | null
          entry_date: string | null
          entry_type: string | null
          final_note: string | null
          id: string
          ideal_response: string | null
          initial_impulse: string | null
          interpretation: string | null
          is_draft: boolean | null
          is_quick: boolean | null
          observable_fact: string | null
          outside_control: string | null
          pattern_noticed: string | null
          primary_emotion: string | null
          related_decision_id: string | null
          related_person: string | null
          secondary_emotions: string[] | null
          title: string | null
          trigger_event: string | null
          under_control: string | null
          updated_at: string
          user_id: string
          virtue_tested: string | null
        }
        Insert: {
          actual_response?: string | null
          automatic_thought?: string | null
          context?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          emotional_intensity?: number | null
          entry_date?: string | null
          entry_type?: string | null
          final_note?: string | null
          id?: string
          ideal_response?: string | null
          initial_impulse?: string | null
          interpretation?: string | null
          is_draft?: boolean | null
          is_quick?: boolean | null
          observable_fact?: string | null
          outside_control?: string | null
          pattern_noticed?: string | null
          primary_emotion?: string | null
          related_decision_id?: string | null
          related_person?: string | null
          secondary_emotions?: string[] | null
          title?: string | null
          trigger_event?: string | null
          under_control?: string | null
          updated_at?: string
          user_id: string
          virtue_tested?: string | null
        }
        Update: {
          actual_response?: string | null
          automatic_thought?: string | null
          context?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          emotional_intensity?: number | null
          entry_date?: string | null
          entry_type?: string | null
          final_note?: string | null
          id?: string
          ideal_response?: string | null
          initial_impulse?: string | null
          interpretation?: string | null
          is_draft?: boolean | null
          is_quick?: boolean | null
          observable_fact?: string | null
          outside_control?: string | null
          pattern_noticed?: string | null
          primary_emotion?: string | null
          related_decision_id?: string | null
          related_person?: string | null
          secondary_emotions?: string[] | null
          title?: string | null
          trigger_event?: string | null
          under_control?: string | null
          updated_at?: string
          user_id?: string
          virtue_tested?: string | null
        }
        Relationships: []
      }
      journal_entry_tags: {
        Row: {
          entry_id: string
          id: string
          tag_id: string
        }
        Insert: {
          entry_id: string
          id?: string
          tag_id: string
        }
        Update: {
          entry_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entry_tags_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entry_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_logs: {
        Row: {
          anxiety_level: number | null
          clarity_level: number | null
          created_at: string
          id: string
          log_date: string | null
          mood: string | null
          next_lucid_action: string | null
          note: string | null
          under_control_today: string | null
          user_id: string
          weighing_today: string | null
        }
        Insert: {
          anxiety_level?: number | null
          clarity_level?: number | null
          created_at?: string
          id?: string
          log_date?: string | null
          mood?: string | null
          next_lucid_action?: string | null
          note?: string | null
          under_control_today?: string | null
          user_id: string
          weighing_today?: string | null
        }
        Update: {
          anxiety_level?: number | null
          clarity_level?: number | null
          created_at?: string
          id?: string
          log_date?: string | null
          mood?: string | null
          next_lucid_action?: string | null
          note?: string | null
          under_control_today?: string | null
          user_id?: string
          weighing_today?: string | null
        }
        Relationships: []
      }
      nightly_reviews: {
        Row: {
          answers: Json | null
          checklist: Json | null
          created_at: string
          day_rating: number | null
          final_mood: string | null
          free_text: string | null
          id: string
          is_completed: boolean | null
          learning: string | null
          review_date: string
          tomorrow_commitment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          checklist?: Json | null
          created_at?: string
          day_rating?: number | null
          final_mood?: string | null
          free_text?: string | null
          id?: string
          is_completed?: boolean | null
          learning?: string | null
          review_date?: string
          tomorrow_commitment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          checklist?: Json | null
          created_at?: string
          day_rating?: number | null
          final_mood?: string | null
          free_text?: string | null
          id?: string
          is_completed?: boolean | null
          learning?: string | null
          review_date?: string
          tomorrow_commitment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      relationship_reflections: {
        Row: {
          bond_type: string | null
          created_at: string
          dignified_conduct: string | null
          emotion: string | null
          id: string
          ideal_communication: string | null
          interpretation: string | null
          learning: string | null
          my_expectation: string | null
          needs_acceptance: boolean | null
          needs_conversation: boolean | null
          needs_distance: boolean | null
          observed_fact: string | null
          outside_control: string | null
          person_or_context: string
          problem: string | null
          their_expectation: string | null
          under_control: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bond_type?: string | null
          created_at?: string
          dignified_conduct?: string | null
          emotion?: string | null
          id?: string
          ideal_communication?: string | null
          interpretation?: string | null
          learning?: string | null
          my_expectation?: string | null
          needs_acceptance?: boolean | null
          needs_conversation?: boolean | null
          needs_distance?: boolean | null
          observed_fact?: string | null
          outside_control?: string | null
          person_or_context: string
          problem?: string | null
          their_expectation?: string | null
          under_control?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bond_type?: string | null
          created_at?: string
          dignified_conduct?: string | null
          emotion?: string | null
          id?: string
          ideal_communication?: string | null
          interpretation?: string | null
          learning?: string | null
          my_expectation?: string | null
          needs_acceptance?: boolean | null
          needs_conversation?: boolean | null
          needs_distance?: boolean | null
          observed_fact?: string | null
          outside_control?: string | null
          person_or_context?: string
          problem?: string | null
          their_expectation?: string | null
          under_control?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      triggers: {
        Row: {
          actual_reaction: string | null
          associated_person: string | null
          context: string | null
          created_at: string
          emotion: string | null
          frequency: string | null
          id: string
          ideal_reaction: string | null
          impulse: string | null
          intensity: number | null
          is_recurring: boolean | null
          observation: string | null
          time_period: string | null
          trigger_description: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_reaction?: string | null
          associated_person?: string | null
          context?: string | null
          created_at?: string
          emotion?: string | null
          frequency?: string | null
          id?: string
          ideal_reaction?: string | null
          impulse?: string | null
          intensity?: number | null
          is_recurring?: boolean | null
          observation?: string | null
          time_period?: string | null
          trigger_description: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_reaction?: string | null
          associated_person?: string | null
          context?: string | null
          created_at?: string
          emotion?: string | null
          frequency?: string | null
          id?: string
          ideal_reaction?: string | null
          impulse?: string | null
          intensity?: number | null
          is_recurring?: boolean | null
          observation?: string | null
          time_period?: string | null
          trigger_description?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          ai_model: string | null
          ai_provider: string | null
          assistant_mode: string | null
          assistant_tone: string | null
          created_at: string
          focus_areas: string[] | null
          id: string
          main_difficulty: string | null
          main_goal: string | null
          onboarding_completed: boolean | null
          theme: string | null
          updated_at: string
          use_auto_context: boolean | null
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          ai_provider?: string | null
          assistant_mode?: string | null
          assistant_tone?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          main_difficulty?: string | null
          main_goal?: string | null
          onboarding_completed?: boolean | null
          theme?: string | null
          updated_at?: string
          use_auto_context?: boolean | null
          user_id: string
        }
        Update: {
          ai_model?: string | null
          ai_provider?: string | null
          assistant_mode?: string | null
          assistant_tone?: string | null
          created_at?: string
          focus_areas?: string[] | null
          id?: string
          main_difficulty?: string | null
          main_goal?: string | null
          onboarding_completed?: boolean | null
          theme?: string | null
          updated_at?: string
          use_auto_context?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      virtues_log: {
        Row: {
          actual_response: string | null
          created_at: string
          id: string
          ideal_response: string | null
          learning: string | null
          log_date: string | null
          progress_rating: number | null
          situation: string | null
          user_id: string
          virtue: string
        }
        Insert: {
          actual_response?: string | null
          created_at?: string
          id?: string
          ideal_response?: string | null
          learning?: string | null
          log_date?: string | null
          progress_rating?: number | null
          situation?: string | null
          user_id: string
          virtue: string
        }
        Update: {
          actual_response?: string | null
          created_at?: string
          id?: string
          ideal_response?: string | null
          learning?: string | null
          log_date?: string | null
          progress_rating?: number | null
          situation?: string | null
          user_id?: string
          virtue?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      decision_status:
        | "aberta"
        | "maturando"
        | "decidida"
        | "revisando"
        | "encerrada"
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
      decision_status: [
        "aberta",
        "maturando",
        "decidida",
        "revisando",
        "encerrada",
      ],
    },
  },
} as const
