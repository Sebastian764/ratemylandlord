import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Landlord, Review } from '../types';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  landlords: Landlord[];
  reviews: { [key: number]: Review[] };
  getLandlord: (id: number) => Promise<Landlord | undefined>;
  getReviewsForLandlord: (id: number) => Promise<Review[]>;
  addLandlord: (landlordData: Omit<Landlord, 'id' | 'is_deleted' | 'created_at' | 'status'>, reviewData?: Omit<Review, 'id' | 'landlord_id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>) => Promise<Landlord>;
  addReview: (reviewData: Omit<Review, 'id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>) => Promise<Review>;
  deleteReview: (reviewId: number, landlordId: number) => Promise<void>;
  restoreReview: (reviewId: number, landlordId: number) => Promise<void>;
  loading: boolean;
  refreshLandlords: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [reviews, setReviews] = useState<{ [key: number]: Review[] }>({});
  const [loading, setLoading] = useState(true);
  const { isAdmin, loading: authLoading } = useAuth();

  const fetchLandlords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getLandlords();
      setLandlords(data);
    } catch (error) {
      console.error('Error fetching landlords:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLandlords();
  }, [fetchLandlords]);

  const getLandlord = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const landlord = await api.getLandlordById(id);
      return landlord;
    } catch (error) {
      console.error('Error fetching landlord:', error);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReviewsForLandlord = useCallback(async (id: number) => {
    if (reviews[id]) return reviews[id];
    setLoading(true);
    try {
      const landlordReviews = await api.getReviewsByLandlordId(id, isAdmin);
      setReviews(prev => ({ ...prev, [id]: landlordReviews }));
      return landlordReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [reviews, isAdmin]);
  
  const handleAddLandlord = async (landlordData: Omit<Landlord, 'id' | 'is_deleted' | 'created_at' | 'status'>, reviewData?: Omit<Review, 'id' | 'landlord_id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>) => {
      const newLandlord = await api.addLandlord(landlordData, reviewData);
      fetchLandlords();
      return newLandlord;
  };

  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>) => {
      const newReview = await api.addReview(reviewData);
      // Invalidate cache for this landlord
      setReviews(prev => {
          const newReviews = {...prev};
          delete newReviews[reviewData.landlord_id];
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

  const handleRestoreReview = async (reviewId: number, landlordId: number) => {
      await api.restoreReview(reviewId);
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
    restoreReview: handleRestoreReview,
    loading: loading || authLoading,
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