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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      distributor_details: {
        Row: {
          aadhaar_card_url: string | null
          business_address: string | null
          business_name: string | null
          created_at: string
          gstin_number: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          aadhaar_card_url?: string | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string
          gstin_number: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          aadhaar_card_url?: string | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string
          gstin_number?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "distributor_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      farmer_details: {
        Row: {
          aadhaar_card_url: string | null
          created_at: string
          farm_address: string | null
          farm_size_acres: number | null
          id: string
          pm_kisan_id: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          aadhaar_card_url?: string | null
          created_at?: string
          farm_address?: string | null
          farm_size_acres?: number | null
          id?: string
          pm_kisan_id?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          aadhaar_card_url?: string | null
          created_at?: string
          farm_address?: string | null
          farm_size_acres?: number | null
          id?: string
          pm_kisan_id?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          blockchain_hash: string | null
          created_at: string
          id: string
          payee_id: string
          payer_id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          tracking_id: string
        }
        Insert: {
          amount: number
          blockchain_hash?: string | null
          created_at?: string
          id?: string
          payee_id: string
          payer_id: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          tracking_id: string
        }
        Update: {
          amount?: number
          blockchain_hash?: string | null
          created_at?: string
          id?: string
          payee_id?: string
          payer_id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          tracking_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_payee_id_fkey"
            columns: ["payee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "supply_chain_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      produce_batches: {
        Row: {
          batch_code: string
          created_at: string
          crop_type: string
          expiry_date: string
          farmer_id: string
          harvest_date: string
          id: string
          price_per_kg: number
          qr_code_url: string | null
          quality_grade: string | null
          quantity_kg: number
          status: Database["public"]["Enums"]["produce_status"] | null
          updated_at: string
        }
        Insert: {
          batch_code: string
          created_at?: string
          crop_type: string
          expiry_date: string
          farmer_id: string
          harvest_date: string
          id?: string
          price_per_kg: number
          qr_code_url?: string | null
          quality_grade?: string | null
          quantity_kg: number
          status?: Database["public"]["Enums"]["produce_status"] | null
          updated_at?: string
        }
        Update: {
          batch_code?: string
          created_at?: string
          crop_type?: string
          expiry_date?: string
          farmer_id?: string
          harvest_date?: string
          id?: string
          price_per_kg?: number
          qr_code_url?: string | null
          quality_grade?: string | null
          quantity_kg?: number
          status?: Database["public"]["Enums"]["produce_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "produce_batches_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhaar_number: string | null
          created_at: string
          full_name: string
          id: string
          mobile_number: string | null
          role: Database["public"]["Enums"]["stakeholder_role"]
          updated_at: string
          user_id: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          aadhaar_number?: string | null
          created_at?: string
          full_name: string
          id?: string
          mobile_number?: string | null
          role: Database["public"]["Enums"]["stakeholder_role"]
          updated_at?: string
          user_id: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          aadhaar_number?: string | null
          created_at?: string
          full_name?: string
          id?: string
          mobile_number?: string | null
          role?: Database["public"]["Enums"]["stakeholder_role"]
          updated_at?: string
          user_id?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
      retailer_details: {
        Row: {
          aadhaar_card_url: string | null
          business_address: string | null
          business_name: string | null
          created_at: string
          fssai_license: string
          gstin_number: string
          id: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          aadhaar_card_url?: string | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string
          fssai_license: string
          gstin_number: string
          id?: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          aadhaar_card_url?: string | null
          business_address?: string | null
          business_name?: string | null
          created_at?: string
          fssai_license?: string
          gstin_number?: string
          id?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retailer_details_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_chain_tracking: {
        Row: {
          batch_id: string
          blockchain_hash: string | null
          created_at: string
          delivery_date: string | null
          driver_contact: string | null
          driver_name: string | null
          from_stakeholder_id: string | null
          id: string
          price_per_kg: number
          quantity_kg: number
          to_stakeholder_id: string | null
          total_amount: number
          transaction_date: string
          transaction_type: string
          truck_id: string | null
        }
        Insert: {
          batch_id: string
          blockchain_hash?: string | null
          created_at?: string
          delivery_date?: string | null
          driver_contact?: string | null
          driver_name?: string | null
          from_stakeholder_id?: string | null
          id?: string
          price_per_kg: number
          quantity_kg: number
          to_stakeholder_id?: string | null
          total_amount: number
          transaction_date?: string
          transaction_type: string
          truck_id?: string | null
        }
        Update: {
          batch_id?: string
          blockchain_hash?: string | null
          created_at?: string
          delivery_date?: string | null
          driver_contact?: string | null
          driver_name?: string | null
          from_stakeholder_id?: string | null
          id?: string
          price_per_kg?: number
          quantity_kg?: number
          to_stakeholder_id?: string | null
          total_amount?: number
          transaction_date?: string
          transaction_type?: string
          truck_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supply_chain_tracking_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "produce_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_chain_tracking_from_stakeholder_id_fkey"
            columns: ["from_stakeholder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supply_chain_tracking_to_stakeholder_id_fkey"
            columns: ["to_stakeholder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      produce_status:
        | "harvested"
        | "in_transit"
        | "at_distributor"
        | "at_retailer"
        | "sold_to_consumer"
      stakeholder_role: "farmer" | "distributor" | "retailer" | "consumer"
      verification_status: "pending" | "verified" | "rejected"
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
      produce_status: [
        "harvested",
        "in_transit",
        "at_distributor",
        "at_retailer",
        "sold_to_consumer",
      ],
      stakeholder_role: ["farmer", "distributor", "retailer", "consumer"],
      verification_status: ["pending", "verified", "rejected"],
    },
  },
} as const
