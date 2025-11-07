
export interface Review {
  id: number;
  landlord_id: number; // Changed to snake_case to match database
  user_id?: string; // Changed to UUID string from Supabase Auth
  rating: number;
  communication: number;
  maintenance: number;
  respect: number;
  comment: string;
  would_rent_again: boolean; // Changed to snake_case to match database
  rent_amount?: number; // Changed to snake_case to match database
  property_address?: string; // Changed to snake_case to match database
  verification_status: 'unverified' | 'pending' | 'verified'; // Changed to snake_case to match database
  verification_file_url?: string; // Added to match database
  is_deleted: boolean; // Changed to snake_case to match database
  created_at: string; // Changed to snake_case to match database
  updated_at: string; // Changed to snake_case to match database
}

export interface Landlord {
  id: number;
  name: string;
  addresses?: string[]; // Changed to array to match database
  city: string;
  status?: 'pending' | 'approved' | 'rejected'; // Added to match database
  is_deleted: boolean; // Changed to snake_case to match database
  created_at?: string; // Added to match database
}

export interface User {
  id: string; // UUID from Supabase Auth
  email: string;
}
