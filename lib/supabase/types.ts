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
      audiences: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id?: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          description: string | null
          id: string
          issuer: string | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          issuer?: string | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          issuer?: string | null
          name?: string
        }
        Relationships: []
      }
      course_audiences: {
        Row: {
          audience_id: string
          course_id: string
        }
        Insert: {
          audience_id: string
          course_id: string
        }
        Update: {
          audience_id?: string
          course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_audiences_audience_id_fkey"
            columns: ["audience_id"]
            isOneToOne: false
            referencedRelation: "audiences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_audiences_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_certifications: {
        Row: {
          certification_id: string
          course_id: string
        }
        Insert: {
          certification_id: string
          course_id: string
        }
        Update: {
          certification_id?: string
          course_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_certifications_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_requirements: {
        Row: {
          course_id: string
          requirement_id: string
        }
        Insert: {
          course_id: string
          requirement_id: string
        }
        Update: {
          course_id?: string
          requirement_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_requirements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_requirements_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sessions: {
        Row: {
          course_id: string
          created_at: string
          end_date: string | null
          id: string
          location_id: string | null
          note: string | null
          sort_order: number
          start_date: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          location_id?: string | null
          note?: string | null
          sort_order?: number
          start_date?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          location_id?: string | null
          note?: string | null
          sort_order?: number
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_trainers: {
        Row: {
          course_id: string
          is_featured: boolean
          role: Database["public"]["Enums"]["trainer_role"]
          sort_order: number
          trainer_id: string
        }
        Insert: {
          course_id: string
          is_featured?: boolean
          role?: Database["public"]["Enums"]["trainer_role"]
          sort_order?: number
          trainer_id: string
        }
        Update: {
          course_id?: string
          is_featured?: boolean
          role?: Database["public"]["Enums"]["trainer_role"]
          sort_order?: number
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_trainers_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_trainers_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          announcement_bar_text: string | null
          cover_image_alt: string | null
          cover_image_path: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          description: string | null
          duration_hours: number
          full_payment_price: number | null
          hero_image_path: string | null
          hero_sort_order: number | null
          id: string
          klarna_enabled: boolean
          language: string
          launch_date: string | null
          min_age: number
          motto: string | null
          price_amount: number
          requires_bacalaureat: boolean
          show_in_hero: boolean
          skills_description: string | null
          slug: string
          status: Database["public"]["Enums"]["course_status"]
          title: string
          type: Database["public"]["Enums"]["course_type"]
          updated_at: string
        }
        Insert: {
          announcement_bar_text?: string | null
          cover_image_alt?: string | null
          cover_image_path?: string | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          duration_hours: number
          full_payment_price?: number | null
          hero_image_path?: string | null
          hero_sort_order?: number | null
          id?: string
          klarna_enabled?: boolean
          language?: string
          launch_date?: string | null
          min_age?: number
          motto?: string | null
          price_amount: number
          requires_bacalaureat?: boolean
          show_in_hero?: boolean
          skills_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["course_status"]
          title: string
          type: Database["public"]["Enums"]["course_type"]
          updated_at?: string
        }
        Update: {
          announcement_bar_text?: string | null
          cover_image_alt?: string | null
          cover_image_path?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          description?: string | null
          duration_hours?: number
          full_payment_price?: number | null
          hero_image_path?: string | null
          hero_sort_order?: number | null
          id?: string
          klarna_enabled?: boolean
          language?: string
          launch_date?: string | null
          min_age?: number
          motto?: string | null
          price_amount?: number
          requires_bacalaureat?: boolean
          show_in_hero?: boolean
          skills_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["course_status"]
          title?: string
          type?: Database["public"]["Enums"]["course_type"]
          updated_at?: string
        }
        Relationships: []
      }
      curriculum_items: {
        Row: {
          content: string
          id: string
          section_id: string
          sort_order: number
        }
        Insert: {
          content: string
          id?: string
          section_id: string
          sort_order?: number
        }
        Update: {
          content?: string
          id?: string
          section_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "curriculum_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_sections: {
        Row: {
          course_id: string
          id: string
          sort_order: number
          subtitle: string | null
          title: string
        }
        Insert: {
          course_id: string
          id?: string
          sort_order?: number
          subtitle?: string | null
          title: string
        }
        Update: {
          course_id?: string
          id?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "curriculum_sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: string
          created_at: string
          created_by_admin: boolean
          email: string
          full_name: string
          gdpr_accepted_at: string
          id: string
          internal_notes: string | null
          invoice_number: string | null
          message: string | null
          paid_amount: number | null
          paid_at: string | null
          paid_currency: Database["public"]["Enums"]["currency_code"] | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_plan: Database["public"]["Enums"]["payment_plan"] | null
          phone: string
          session_id: string | null
          status: Database["public"]["Enums"]["enrollment_status"]
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by_admin?: boolean
          email: string
          full_name: string
          gdpr_accepted_at: string
          id?: string
          internal_notes?: string | null
          invoice_number?: string | null
          message?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          paid_currency?: Database["public"]["Enums"]["currency_code"] | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_plan?: Database["public"]["Enums"]["payment_plan"] | null
          phone: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by_admin?: boolean
          email?: string
          full_name?: string
          gdpr_accepted_at?: string
          id?: string
          internal_notes?: string | null
          invoice_number?: string | null
          message?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          paid_currency?: Database["public"]["Enums"]["currency_code"] | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_plan?: Database["public"]["Enums"]["payment_plan"] | null
          phone?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          id: string
          map_url: string | null
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          map_url?: string | null
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          map_url?: string | null
          name?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          completed_at: string | null
          course_id: string
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          enrollment_id: string | null
          error_message: string | null
          id: string
          invoice_error: string | null
          invoice_issued_at: string | null
          invoice_number: string | null
          invoice_series: string | null
          invoice_status: Database["public"]["Enums"]["invoice_status"]
          invoice_url: string | null
          metadata: Json
          payment_plan: Database["public"]["Enums"]["payment_plan"] | null
          session_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id: string | null
          stripe_payment_method_type: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          course_id: string
          created_at?: string
          currency: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          enrollment_id?: string | null
          error_message?: string | null
          id?: string
          invoice_error?: string | null
          invoice_issued_at?: string | null
          invoice_number?: string | null
          invoice_series?: string | null
          invoice_status?: Database["public"]["Enums"]["invoice_status"]
          invoice_url?: string | null
          metadata?: Json
          payment_plan?: Database["public"]["Enums"]["payment_plan"] | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string | null
          stripe_payment_method_type?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          course_id?: string
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          enrollment_id?: string | null
          error_message?: string | null
          id?: string
          invoice_error?: string | null
          invoice_issued_at?: string | null
          invoice_number?: string | null
          invoice_series?: string | null
          invoice_status?: Database["public"]["Enums"]["invoice_status"]
          invoice_url?: string | null
          metadata?: Json
          payment_plan?: Database["public"]["Enums"]["payment_plan"] | null
          session_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent_id?: string | null
          stripe_payment_method_type?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "course_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      requirements: {
        Row: {
          category: Database["public"]["Enums"]["requirement_category"]
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          category: Database["public"]["Enums"]["requirement_category"]
          id?: string
          label: string
          sort_order?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["requirement_category"]
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      shop_product_colors: {
        Row: {
          created_at: string
          hex: string | null
          id: string
          image_id: string | null
          name: string
          product_id: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          hex?: string | null
          id?: string
          image_id?: string | null
          name: string
          product_id: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          hex?: string | null
          id?: string
          image_id?: string | null
          name?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_product_colors_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "shop_product_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_product_colors_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          path: string
          product_id: string
          sort_order: number
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          path: string
          product_id: string
          sort_order?: number
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          path?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "shop_product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_product_variants: {
        Row: {
          color_id: string | null
          created_at: string
          id: string
          price: number | null
          product_id: string
          sort_order: number
          stock: number
          weight_kg: number | null
        }
        Insert: {
          color_id?: string | null
          created_at?: string
          id?: string
          price?: number | null
          product_id: string
          sort_order?: number
          stock?: number
          weight_kg?: number | null
        }
        Update: {
          color_id?: string | null
          created_at?: string
          id?: string
          price?: number | null
          product_id?: string
          sort_order?: number
          stock?: number
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shop_product_variants_color_id_fkey"
            columns: ["color_id"]
            isOneToOne: false
            referencedRelation: "shop_product_colors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shop_product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          delivery_options: Database["public"]["Enums"]["shop_delivery_option"][]
          description: string | null
          id: string
          name: string
          price: number
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["course_status"]
          stock: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          delivery_options?: Database["public"]["Enums"]["shop_delivery_option"][]
          description?: string | null
          id?: string
          name: string
          price: number
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["course_status"]
          stock?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          delivery_options?: Database["public"]["Enums"]["shop_delivery_option"][]
          description?: string | null
          id?: string
          name?: string
          price?: number
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["course_status"]
          stock?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      trainers: {
        Row: {
          bio: string | null
          created_at: string
          credentials: string | null
          id: string
          instagram_url: string | null
          name: string
          photo_alt: string | null
          photo_path: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          credentials?: string | null
          id?: string
          instagram_url?: string | null
          name: string
          photo_alt?: string | null
          photo_path?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          credentials?: string | null
          id?: string
          instagram_url?: string | null
          name?: string
          photo_alt?: string | null
          photo_path?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin"
      course_status: "draft" | "published" | "archived"
      course_type: "curs_acreditat" | "workshop"
      currency_code: "RON" | "EUR"
      enrollment_status: "nou" | "contactat" | "confirmat" | "platit" | "anulat"
      invoice_status: "pending" | "issued" | "failed" | "skipped"
      payment_method: "stripe" | "transfer" | "cash" | "other"
      payment_plan: "integral" | "rate_klarna"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refunded"
        | "expired"
      requirement_category: "inscriere" | "acte" | "participare" | "examen"
      shop_delivery_option: "summit_pickup" | "courier"
      trainer_role: "principal" | "secundar"
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
      app_role: ["admin"],
      course_status: ["draft", "published", "archived"],
      course_type: ["curs_acreditat", "workshop"],
      currency_code: ["RON", "EUR"],
      enrollment_status: ["nou", "contactat", "confirmat", "platit", "anulat"],
      invoice_status: ["pending", "issued", "failed", "skipped"],
      payment_method: ["stripe", "transfer", "cash", "other"],
      payment_plan: ["integral", "rate_klarna"],
      payment_status: ["pending", "completed", "failed", "refunded", "expired"],
      requirement_category: ["inscriere", "acte", "participare", "examen"],
      shop_delivery_option: ["summit_pickup", "courier"],
      trainer_role: ["principal", "secundar"],
    },
  },
} as const
