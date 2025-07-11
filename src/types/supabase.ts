export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      price_certifications: {
        Row: {
          certification_type:
            | Database["public"]["Enums"]["certification_type"]
            | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          memo: string | null
          price: number | null
          product_name: string | null
          store_id: string | null
          submitted_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          certification_type?:
            | Database["public"]["Enums"]["certification_type"]
            | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          memo?: string | null
          price?: number | null
          product_name?: string | null
          store_id?: string | null
          submitted_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          certification_type?:
            | Database["public"]["Enums"]["certification_type"]
            | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          memo?: string | null
          price?: number | null
          product_name?: string | null
          store_id?: string | null
          submitted_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_certifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      price_reports: {
        Row: {
          certification_id: string | null
          currency: string | null
          id: string
          is_verified: boolean
          price: number | null
          product_name: string
          report_date: string | null
          reporter_nickname: string | null
          store_id: string | null
        }
        Insert: {
          certification_id?: string | null
          currency?: string | null
          id?: string
          is_verified?: boolean
          price?: number | null
          product_name: string
          report_date?: string | null
          reporter_nickname?: string | null
          store_id?: string | null
        }
        Update: {
          certification_id?: string | null
          currency?: string | null
          id?: string
          is_verified?: boolean
          price?: number | null
          product_name?: string
          report_date?: string | null
          reporter_nickname?: string | null
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_reports_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "price_certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_reports_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string | null
          google_url: string | null
          id: string
          store_address: string | null
          store_area: string | null
          store_name: string
          store_url: string | null
        }
        Insert: {
          created_at?: string | null
          google_url?: string | null
          id?: string
          store_address?: string | null
          store_area?: string | null
          store_name: string
          store_url?: string | null
        }
        Update: {
          created_at?: string | null
          google_url?: string | null
          id?: string
          store_address?: string | null
          store_area?: string | null
          store_name?: string
          store_url?: string | null
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
      certification_type: "receipt" | "photo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      certification_type: ["receipt", "photo"],
    },
  },
} as const
