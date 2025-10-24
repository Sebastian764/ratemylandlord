
import type { Landlord, Review } from '../types';

let landlords: Landlord[] = [
  { id: 1, name: 'Steel City Properties', address: '123 Forbes Ave', city: 'Pittsburgh', isDeleted: false },
  { id: 2, name: 'Oakland Living', address: '456 Fifth Ave', city: 'Pittsburgh', isDeleted: false },
  { id: 3, name: 'Shadyside Residences', address: '789 Walnut St', city: 'Pittsburgh', isDeleted: true },
];

let reviews: Review[] = [
  { id: 1, landlordId: 1, userId: undefined, rating: 4, communication: 5, maintenance: 4, respect: 3, comment: 'Pretty good, fixed the sink quickly.', isVerified: true, isDeleted: false, createdAt: '2023-08-15' },
  { id: 2, landlordId: 1, userId: undefined, rating: 2, communication: 1, maintenance: 2, respect: 2, comment: 'Slow to respond and didn\'t return my full deposit.', isVerified: false, isDeleted: false, createdAt: '2023-05-20' },
  { id: 3, landlordId: 2, userId: undefined, rating: 5, communication: 5, maintenance: 5, respect: 5, comment: 'Best landlord I\'ve ever had! Super responsive.', isVerified: true, isDeleted: false, createdAt: '2023-09-01' },
  { id: 4, landlordId: 1, userId: undefined, rating: 3, communication: 3, maintenance: 3, respect: 3, comment: 'Just an average experience.', isVerified: false, isDeleted: true, createdAt: '2022-11-10' },
];

let nextLandlordId = 4;
let nextReviewId = 5;

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

export const getReviewsByLandlordId = async (landlordId: number): Promise<Review[]> => {
  await delay(300);
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
    };
    reviews.push(newReview);
  }
  return Promise.resolve(newLandlord);
};

export const addReview = async (reviewData: Omit<Review, 'id' | 'isDeleted' | 'createdAt'>): Promise<Review> => {
  await delay(500);
  const newReview: Review = {
    ...reviewData,
    id: nextReviewId++,
    isDeleted: false,
    createdAt: new Date().toISOString().split('T')[0],
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
