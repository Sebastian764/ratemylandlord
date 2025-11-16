import { supabase } from './supabase';
import type { Landlord, Review } from '../types';

export const getLandlords = async (): Promise<Landlord[]> => {
  const { data, error } = await supabase
    .from('landlords')
    .select('*')
    .eq('is_deleted', false)
    .eq('status', 'approved')
    .order('name');
  if (error) throw error;
  return data || [];
};

export const getLandlordById = async (id: number): Promise<Landlord | undefined> => {
  // Try to fetch the landlord - RLS policies will determine what the user can see
  // Admins can see all landlords, regular users can only see approved ones
  const { data, error } = await supabase
    .from('landlords')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined; // Not found
    throw error;
  }
  return data;
};

export const getReviewsByLandlordId = async (
  landlordId: number,
  includeDeleted = false
): Promise<Review[]> => {
  let query = supabase
    .from('reviews')
    .select('*')
    .eq('landlord_id', landlordId)
    .order('created_at', { ascending: false });

  if (!includeDeleted) {
    query = query.eq('is_deleted', false);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const addLandlord = async (
  landlordData: Omit<Landlord, 'id' | 'is_deleted' | 'created_at' | 'status'>,
  reviewData?: Omit<Review, 'id' | 'landlord_id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>
): Promise<Landlord> => {
  // Insert landlord with pending status
  const { data: newLandlord, error: landlordError } = await supabase
    .from('landlords')
    .insert([{ ...landlordData, status: 'pending' }])
    .select()
    .single();

  if (landlordError) throw landlordError;

  // If review data is provided, insert the review
  if (reviewData && newLandlord) {
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert([{ ...reviewData, landlord_id: newLandlord.id }]);

    if (reviewError) throw reviewError;
  }

  return newLandlord;
};

export const addReview = async (
  reviewData: Omit<Review, 'id' | 'is_deleted' | 'created_at' | 'updated_at' | 'verification_file_url'>
): Promise<Review> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Admin-specific functions
export const deleteReview = async (reviewId: number): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .update({ is_deleted: true, updated_at: new Date().toISOString() })
    .eq('id', reviewId);

  if (error) throw error;
  return true;
};

export const restoreReview = async (reviewId: number): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .update({ is_deleted: false, updated_at: new Date().toISOString() })
    .eq('id', reviewId);

  if (error) throw error;
  return true;
};

export const getPendingLandlords = async (): Promise<Landlord[]> => {
  const { data, error } = await supabase
    .from('landlords')
    .select('*')
    .eq('is_deleted', false)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getPendingReviews = async (): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_deleted', false)
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateLandlordStatus = async (
  landlordId: number,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> => {
  const { error } = await supabase
    .from('landlords')
    .update({ status })
    .eq('id', landlordId);

  if (error) throw error;
  return true;
};

export const updateReviewVerificationStatus = async (
  reviewId: number,
  verificationStatus: 'unverified' | 'pending' | 'verified'
): Promise<boolean> => {
  const { error } = await supabase
    .from('reviews')
    .update({ 
      verification_status: verificationStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId);

  if (error) throw error;
  return true;
};

// Check if user is admin
export const checkIsAdminUser = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    return !error && !!data;
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
};
