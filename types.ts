
export interface Review {
  id: number;
  landlordId: number;
  userId?: number; // Optional: tracks the user who created the review (if logged in)
  rating: number;
  communication: number;
  maintenance: number;
  respect: number;
  comment: string;
  wouldRentAgain: boolean;
  rentAmount?: number; // Optional: monthly rent + utilities
  propertyAddress?: string; // Optional: specific property address
  verificationStatus: 'unverified' | 'pending' | 'verified';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Landlord {
  id: number;
  name: string;
  address?: string; // Optional address field
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
