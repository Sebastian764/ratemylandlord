
export interface Review {
  id: number;
  landlord_id: number;
  user_id?: string; // Changed to UUID string from Supabase Auth
  rating: number;
  communication: number;
  maintenance: number;
  respect: number;
  comment: string;
  would_rent_again: boolean;
  rent_amount?: number;
  property_address?: string;
  verification_status: 'unverified' | 'pending' | 'verified';
  verification_file_url?: string; // Added to match database
  created_by_student: boolean; // True if user email ends with pitt.edu or cmu.edu
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
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
