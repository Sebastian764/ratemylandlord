
import type { Landlord, Review } from '../types';

let landlords: Landlord[] = [
  { id: 1, name: 'fake landlord 1', address: '123 Forbes Ave', city: 'Pittsburgh', isDeleted: false },
  { id: 2, name: 'fake landlord 2', address: '456 Fifth Ave', city: 'Pittsburgh', isDeleted: false },
  { id: 3, name: 'fake landlord 3', address: '789 Walnut St', city: 'Pittsburgh', isDeleted: true },
  { id: 4, name: 'John C.R. Kelly Realty', city: 'Pittsburgh', isDeleted: false },
  { id: 5, name: 'Walnut Capital', city: 'Pittsburgh', isDeleted: false },
  { id: 6, name: 'Lobos Management', city: 'Pittsburgh', isDeleted: false },
  { id: 7, name: 'Bob Eckenrode', city: 'Pittsburgh', isDeleted: false },
  { id: 8, name: 'TMK Properties', city: 'Pittsburgh', isDeleted: false },
  { id: 9, name: 'Mozart Management', city: 'Pittsburgh', isDeleted: false },
  { id: 10, name: 'Palmieri Property Management', city: 'Pittsburgh', isDeleted: false },
];

let reviews: Review[] = [
  // John C.R. Kelly Realty reviews
  { id: 5, landlordId: 4, userId: undefined, rating: 2, communication: 2, maintenance: 1, respect: 2, comment: 'Fake review', wouldRentAgain: false, rentAmount: 1200, propertyAddress: '456 S Craig St', verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-07-10', updatedAt: '2023-07-10' },
  { id: 6, landlordId: 4, userId: undefined, rating: 3, communication: 3, maintenance: 3, respect: 3, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1350, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-09-22', updatedAt: '2023-09-22' },
  { id: 7, landlordId: 4, userId: undefined, rating: 1, communication: 1, maintenance: 2, respect: 1, comment: 'Fake review', wouldRentAgain: false, propertyAddress: '789 Bellefonte St', verificationStatus: 'pending', isDeleted: false, createdAt: '2023-06-05', updatedAt: '2023-06-05' },
  { id: 25, landlordId: 4, userId: undefined, rating: 1, communication: 1, maintenance: 1, respect: 1, comment: 'This review was deleted by an admin (test)', wouldRentAgain: false, verificationStatus: 'unverified', isDeleted: true, createdAt: '2023-08-01', updatedAt: '2023-08-01' },
  
  // Walnut Capital reviews
  { id: 8, landlordId: 5, userId: undefined, rating: 4, communication: 4, maintenance: 4, respect: 4, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1500, propertyAddress: '234 Neville St', verificationStatus: 'verified', isDeleted: false, createdAt: '2023-08-18', updatedAt: '2023-08-18' },
  { id: 9, landlordId: 5, userId: undefined, rating: 3, communication: 4, maintenance: 3, respect: 3, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1400, verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-10-01', updatedAt: '2023-10-01' },
  { id: 10, landlordId: 5, userId: undefined, rating: 5, communication: 5, maintenance: 5, respect: 4, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1600, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-09-15', updatedAt: '2023-09-15' },
  
  // Lobos Management reviews
  { id: 11, landlordId: 6, userId: undefined, rating: 2, communication: 2, maintenance: 2, respect: 3, comment: 'Fake review', wouldRentAgain: false, rentAmount: 1100, verificationStatus: 'pending', isDeleted: false, createdAt: '2023-07-25', updatedAt: '2023-07-25' },
  { id: 12, landlordId: 6, userId: undefined, rating: 3, communication: 3, maintenance: 2, respect: 3, comment: 'Fake review', wouldRentAgain: true, verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-08-30', updatedAt: '2023-08-30' },
  
  // Bob Eckenrode reviews
  { id: 13, landlordId: 7, userId: undefined, rating: 1, communication: 1, maintenance: 1, respect: 2, comment: 'Fake review', wouldRentAgain: false, rentAmount: 950, propertyAddress: '123 Atwood St', verificationStatus: 'verified', isDeleted: false, createdAt: '2023-05-12', updatedAt: '2023-05-12' },
  { id: 14, landlordId: 7, userId: undefined, rating: 2, communication: 2, maintenance: 1, respect: 2, comment: 'Fake review', wouldRentAgain: false, rentAmount: 1000, verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-06-20', updatedAt: '2023-06-20' },
  { id: 15, landlordId: 7, userId: undefined, rating: 1, communication: 1, maintenance: 2, respect: 1, comment: 'Fake review', wouldRentAgain: false, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-07-08', updatedAt: '2023-07-08' },
  { id: 16, landlordId: 7, userId: undefined, rating: 2, communication: 2, maintenance: 2, respect: 2, comment: 'Fake review', wouldRentAgain: false, rentAmount: 1050, verificationStatus: 'pending', isDeleted: false, createdAt: '2023-08-14', updatedAt: '2023-08-14' },
  
  // TMK Properties reviews
  { id: 17, landlordId: 8, userId: undefined, rating: 4, communication: 4, maintenance: 4, respect: 4, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1450, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-06-30', updatedAt: '2023-06-30' },
  { id: 18, landlordId: 8, userId: undefined, rating: 3, communication: 3, maintenance: 4, respect: 3, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1550, propertyAddress: '567 Centre Ave', verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-09-10', updatedAt: '2023-09-10' },
  { id: 19, landlordId: 8, userId: undefined, rating: 5, communication: 5, maintenance: 4, respect: 5, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1650, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-10-05', updatedAt: '2023-10-05' },
  
  // Mozart Management reviews
  { id: 20, landlordId: 9, userId: undefined, rating: 3, communication: 3, maintenance: 3, respect: 3, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1300, verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-07-15', updatedAt: '2023-07-15' },
  { id: 21, landlordId: 9, userId: undefined, rating: 4, communication: 4, maintenance: 3, respect: 4, comment: 'Fake review', wouldRentAgain: true, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-08-22', updatedAt: '2023-08-22' },
  
  // Palmieri Property Management reviews
  { id: 22, landlordId: 10, userId: undefined, rating: 2, communication: 2, maintenance: 3, respect: 2, comment: 'Fake review', wouldRentAgain: false, rentAmount: 1250, propertyAddress: '890 Denniston St', verificationStatus: 'pending', isDeleted: false, createdAt: '2023-06-18', updatedAt: '2023-06-18' },
  { id: 23, landlordId: 10, userId: undefined, rating: 3, communication: 3, maintenance: 3, respect: 3, comment: 'Fake review', wouldRentAgain: true, rentAmount: 1350, verificationStatus: 'verified', isDeleted: false, createdAt: '2023-09-05', updatedAt: '2023-09-05' },
  { id: 24, landlordId: 10, userId: undefined, rating: 4, communication: 4, maintenance: 4, respect: 3, comment: 'Fake review', wouldRentAgain: true, verificationStatus: 'unverified', isDeleted: false, createdAt: '2023-10-12', updatedAt: '2023-10-12' },
];

let nextLandlordId = 11;
let nextReviewId = 26;

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getLandlords = async (): Promise<Landlord[]> => {
  await delay(300);
  return Promise.resolve(landlords.filter(l => !l.isDeleted));
};

export const getLandlordById = async (id: number): Promise<Landlord | undefined> => {
  await delay(300);
  return Promise.resolve(landlords.find(l => l.id === id && !l.isDeleted));
};

export const getReviewsByLandlordId = async (landlordId: number, includeDeleted = false): Promise<Review[]> => {
  await delay(300);
  if (includeDeleted) {
    return Promise.resolve(reviews.filter(r => r.landlordId === landlordId));
  }
  return Promise.resolve(reviews.filter(r => r.landlordId === landlordId && !r.isDeleted));
};

export const addLandlord = async (
  landlordData: Omit<Landlord, 'id' | 'isDeleted'>,
  reviewData?: Omit<Review, 'id' | 'landlordId' | 'isDeleted' | 'createdAt'>
): Promise<Landlord> => {
  await delay(500);
  const newLandlord: Landlord = {
    ...landlordData,
    id: nextLandlordId++,
    isDeleted: false,
  };
  landlords.push(newLandlord);

  if (reviewData) {
    const newReview: Review = {
      ...reviewData,
      id: nextReviewId++,
      landlordId: newLandlord.id,
      isDeleted: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    reviews.push(newReview);
  }
  return Promise.resolve(newLandlord);
};

export const addReview = async (reviewData: Omit<Review, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
  await delay(500);
  const newReview: Review = {
    ...reviewData,
    id: nextReviewId++,
    isDeleted: false,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
  };
  reviews.push(newReview);
  return Promise.resolve(newReview);
};

export const deleteReview = async (reviewId: number): Promise<boolean> => {
  await delay(300);
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  if (reviewIndex > -1) {
    reviews[reviewIndex].isDeleted = true;
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const deleteLandlord = async (landlordId: number): Promise<boolean> => {
  await delay(300);
  const landlordIndex = landlords.findIndex(l => l.id === landlordId);
  if (landlordIndex > -1) {
    landlords[landlordIndex].isDeleted = true;
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};

export const restoreReview = async (reviewId: number): Promise<boolean> => {
  await delay(300);
  const reviewIndex = reviews.findIndex(r => r.id === reviewId);
  if (reviewIndex > -1 && reviews[reviewIndex].isDeleted) {
    reviews[reviewIndex].isDeleted = false;
    return Promise.resolve(true);
  }
  return Promise.resolve(false);
};
