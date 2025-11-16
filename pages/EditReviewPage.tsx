import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Review } from '../types';
import ReviewForm from '../components/ReviewForm';
import { supabase } from '../services/supabase';
import { uploadVerificationFile, deleteVerificationFile } from '../services/api';

const EditReviewPage: React.FC = () => {
  const { id, reviewId } = useParams<{ id: string; reviewId: string }>();
  const navigate = useNavigate();
  const { getLandlord, loading } = useData();
  const { user } = useAuth();

  const [review, setReview] = useState<Review | null>(null);
  const [landlordName, setLandlordName] = useState('');
  const [rating, setRating] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [maintenance, setMaintenance] = useState(3);
  const [respect, setRespect] = useState(3);
  const [comment, setComment] = useState('');
  const [wouldRentAgain, setWouldRentAgain] = useState(false);
  const [rentAmount, setRentAmount] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const landlordId = Number(id);
  const reviewIdNum = Number(reviewId);

  useEffect(() => {
    const fetchReviewAndLandlord = async () => {
      // Fetch review
      const { data: reviewData, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('id', reviewIdNum)
        .single();

      if (error || !reviewData) {
        alert('Unable to load review. It may have been deleted or you may not have permission to view it.');
        navigate(`/landlord/${landlordId}`);
        return;
      }

      // Check if user owns this review
      // this is also done at the DB level via RLS policy
      if (!user || reviewData.user_id !== user.id) {
        alert('You can only edit your own reviews');
        navigate(`/landlord/${landlordId}`);
        return;
      }

      setReview(reviewData);
      setRating(reviewData.rating);
      setCommunication(reviewData.communication);
      setMaintenance(reviewData.maintenance);
      setRespect(reviewData.respect);
      setComment(reviewData.comment);
      setWouldRentAgain(reviewData.would_rent_again);
      setRentAmount(reviewData.rent_amount ? reviewData.rent_amount.toString() : '');
      setPropertyAddress(reviewData.property_address || '');

      // Fetch landlord name
      const landlord = await getLandlord(landlordId);
      if (landlord) {
        setLandlordName(landlord.name);
      }
    };

    fetchReviewAndLandlord();
  }, [reviewIdNum, landlordId, user, navigate, getLandlord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment) {
      alert('Please add a comment to your review.');
      return;
    }

    if (!user) {
      alert('You must be logged in to edit a review');
      return;
    }

    setUploading(true);

    try {
      let newVerificationStatus = review?.verification_status || 'unverified';
      let newVerificationFileUrl = review?.verification_file_url || null;

      // If a new verification file is uploaded
      if (verificationFile) {
        // Delete old file if it exists
        if (review?.verification_file_url) {
          try {
            await deleteVerificationFile(review.verification_file_url);
          } catch (err) {
            console.error('Failed to delete old verification file:', err);
          }
        }

        // Upload new file
        const filePath = await uploadVerificationFile(verificationFile, user.id, reviewIdNum);
        newVerificationFileUrl = filePath;
        newVerificationStatus = 'pending';
      }

      const { error } = await supabase
        .from('reviews')
        .update({
          rating,
          communication,
          maintenance,
          respect,
          comment,
          would_rent_again: wouldRentAgain,
          rent_amount: rentAmount ? parseFloat(rentAmount) : null,
          property_address: propertyAddress || null,
          verification_status: newVerificationStatus,
          verification_file_url: newVerificationFileUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewIdNum);

      if (error) throw error;

      alert('Review updated successfully!');
      navigate(`/landlord/${landlordId}`);
      window.location.reload();
    } catch (err) {
      console.error('Failed to update review:', err);
      alert(`Failed to update review: ${err?.message || String(err) || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !review) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Edit Review For</h1>
      <h2 className="text-xl text-gray-600 mb-6 text-center">{landlordName}</h2>
      <h2 className="text-xl text-gray-600 mb-6 text-center">Upload verification below to get your review verified</h2>

      {review.verification_file_url && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            ✅ You have already uploaded a verification file. Upload a new file to replace it.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <ReviewForm
          rating={rating}
          setRating={setRating}
          communication={communication}
          setCommunication={setCommunication}
          maintenance={maintenance}
          setMaintenance={setMaintenance}
          respect={respect}
          setRespect={setRespect}
          comment={comment}
          setComment={setComment}
          wouldRentAgain={wouldRentAgain}
          setWouldRentAgain={setWouldRentAgain}
          rentAmount={rentAmount}
          setRentAmount={setRentAmount}
          propertyAddress={propertyAddress}
          setPropertyAddress={setPropertyAddress}
          verificationFile={verificationFile}
          setVerificationFile={setVerificationFile}
          commentRequired={true}
          showFileUpload={true}
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(`/landlord/${landlordId}`)}
            className="flex-1 py-3 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Updating...' : 'Update Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReviewPage;
