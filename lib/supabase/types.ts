export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      enrollments: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          id: string
          notes: string | null
          product_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_trainers: {
        Row: {
          product_id: string
          sort_order: number | null
          trainer_id: string
        }
        Insert: {
          product_id: string
          sort_order?: number | null
          trainer_id: string
        }
        Update: {
          product_id?: string
          sort_order?: number | null
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_trainers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_trainers_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          certifications: Json | null
          competencies: Json | null
          created_at: string | null
          curriculum: Json | null
          description: string | null
          duration: string | null
          exam_info: Json | null
          external_checkout_url: string | null
          faq: Json | null
          fees_structure: Json | null
          full_description: string | null
          highlights: Json | null
          id: string
          image_url: string | null
          included: Json | null
          language: string | null
          level: string | null
          location: string | null
          min_education: string | null
          price: number
          promo_end: string | null
          promo_price: number | null
          promo_start: string | null
          requirements_docs: Json | null
          schedule: string | null
          slug: string
          sort_order: number | null
          spots_total: number | null
          start_date: string | null
          status: string
          tags: Json | null
          testimonials: Json | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          certifications?: Json | null
          competencies?: Json | null
          created_at?: string | null
          curriculum?: Json | null
          description?: string | null
          duration?: string | null
          exam_info?: Json | null
          external_checkout_url?: string | null
          faq?: Json | null
          fees_structure?: Json | null
          full_description?: string | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          included?: Json | null
          language?: string | null
          level?: string | null
          location?: string | null
          min_education?: string | null
          price: number
          promo_end?: string | null
          promo_price?: number | null
          promo_start?: string | null
          requirements_docs?: Json | null
          schedule?: string | null
          slug: string
          sort_order?: number | null
          spots_total?: number | null
          start_date?: string | null
          status?: string
          tags?: Json | null
          testimonials?: Json | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          certifications?: Json | null
          competencies?: Json | null
          created_at?: string | null
          curriculum?: Json | null
          description?: string | null
          duration?: string | null
          exam_info?: Json | null
          external_checkout_url?: string | null
          faq?: Json | null
          fees_structure?: Json | null
          full_description?: string | null
          highlights?: Json | null
          id?: string
          image_url?: string | null
          included?: Json | null
          language?: string | null
          level?: string | null
          location?: string | null
          min_education?: string | null
          price?: number
          promo_end?: string | null
          promo_price?: number | null
          promo_start?: string | null
          requirements_docs?: Json | null
          schedule?: string | null
          slug?: string
          sort_order?: number | null
          spots_total?: number | null
          start_date?: string | null
          status?: string
          tags?: Json | null
          testimonials?: Json | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trainers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: string
          user_id: string
        }
        Insert: {
          role?: string
          user_id: string
        }
        Update: {
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
