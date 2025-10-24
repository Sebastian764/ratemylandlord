
export interface Review {
  id: number;
  landlordId: number;
  userId?: number; // Optional: tracks the user who created the review (if logged in)
  rating: number;
  communication: number;
  maintenance: number;
  respect: number;
  comment: string;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
}

export interface Landlord {
  id: number;
  name: string;
  address: string;
  city: string;
  isDeleted: boolean;
}

export interface User {
  id: number;
  email: string;
  password: string; // In production, this would be hashed
  isAdmin: boolean;
  createdAt: string;
}
