
export interface Review {
  id: number;
  landlordId: number;
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
