
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Landlord, Review } from '../types';
import * as api from '../services/mockApi';

interface DataContextType {
  landlords: Landlord[];
  reviews: { [key: number]: Review[] };
  getLandlord: (id: number) => Promise<Landlord | undefined>;
  getReviewsForLandlord: (id: number) => Promise<Review[]>;
  addLandlord: (landlordData: Omit<Landlord, 'id' | 'isDeleted'>, reviewData?: Omit<Review, 'id' | 'landlordId' | 'isDeleted' | 'createdAt'>) => Promise<Landlord>;
  addReview: (reviewData: Omit<Review, 'id' | 'isDeleted' | 'createdAt'>) => Promise<Review>;
  deleteReview: (reviewId: number, landlordId: number) => Promise<void>;
  loading: boolean;
  refreshLandlords: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
  const [loading, setLoading] = useState(true);

  const fetchLandlords = useCallback(async () => {
    setLoading(true);
    const data = await api.getLandlords();
    setLandlords(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLandlords();
  }, [fetchLandlords]);

  const getLandlord = useCallback(async (id: number) => {
    setLoading(true);
    const landlord = await api.getLandlordById(id);
    setLoading(false);
    return landlord;
  }, []);

  const getReviewsForLandlord = useCallback(async (id: number) => {
    if (reviews[id]) return reviews[id];
    setLoading(true);
    const landlordReviews = await api.getReviewsByLandlordId(id);
    setReviews(prev => ({ ...prev, [id]: landlordReviews }));
    setLoading(false);
    return landlordReviews;
  }, [reviews]);
  
  const handleAddLandlord = async (landlordData: Omit<Landlord, 'id' | 'isDeleted'>, reviewData?: Omit<Review, 'id' | 'landlordId' | 'isDeleted' | 'createdAt'>) => {
      const newLandlord = await api.addLandlord(landlordData, reviewData);
      fetchLandlords();
      return newLandlord;
  };

  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'isDeleted' | 'createdAt'>) => {
      const newReview = await api.addReview(reviewData);
      // Invalidate cache for this landlord
      setReviews(prev => {
          const newReviews = {...prev};
          delete newReviews[reviewData.landlordId];
          return newReviews;
      });
      return newReview;
  };

  const handleDeleteReview = async (reviewId: number, landlordId: number) => {
      await api.deleteReview(reviewId);
      setReviews(prev => {
          const newReviews = {...prev};
          delete newReviews[landlordId];
          return newReviews;
      });
  };

  const value = {
    landlords,
    reviews,
    getLandlord,
    getReviewsForLandlord,
    addLandlord: handleAddLandlord,
    addReview: handleAddReview,
    deleteReview: handleDeleteReview,
    loading,
    refreshLandlords: fetchLandlords
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
