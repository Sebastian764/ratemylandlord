import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Landlord } from '../types';
import ReviewForm from '../components/ReviewForm';
import { uploadVerificationFile } from '../services/api';
import { supabase } from '../services/supabase';

const AddReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addReview, getLandlord, loading } = useData();
  const { user } = useAuth();

  const [landlord, setLandlord] = useState<Landlord | null>(null);
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

  useEffect(() => {
    if (landlordId) {
      getLandlord(landlordId).then(data => setLandlord(data || null));
    }
  }, [landlordId, getLandlord]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment) {
      alert('Please add a comment to your review.');
      return;
    }

    // Warn anonymous users that they can't edit later
    if (!user) {
      const confirmSubmit = confirm(
        'You are submitting as a guest. Your review cannot be edited or verified after submission. Are you sure you want to continue?'
      );
      if (!confirmSubmit) {
        return;
      }
    }

    setUploading(true);

    try {
      // First, create the review
      const reviewData = {
        landlord_id: landlordId,
        user_id: user?.id || undefined,
        rating,
        communication,
        maintenance,
        respect,
        comment,
        would_rent_again: wouldRentAgain,
        rent_amount: rentAmount ? parseFloat(rentAmount) : undefined,
        property_address: propertyAddress || undefined,
        verification_status: verificationFile ? 'pending' : 'unverified' as const,
        verification_file_url: undefined
      };

      const newReview = await addReview(reviewData);

      // If there's a verification file, upload it
      if (verificationFile && user?.id) {
        try {
          const filePath = await uploadVerificationFile(verificationFile, user.id, newReview.id);
          
          // Update the review with the file path
          const { error: updateError } = await supabase
            .from('reviews')
            .update({ verification_file_url: filePath })
            .eq('id', newReview.id);

          if (updateError) throw updateError;
        } catch (uploadError) {
          console.error('Failed to upload verification file:', uploadError);
          alert(`Review submitted, but file upload failed: ${uploadError?.message || 'Unknown error'}. Your review will be marked as unverified.`);
        }
      }

      alert('Review submitted successfully!');
      navigate(`/landlord/${landlordId}`);
    } catch(err) {
      console.error('Failed to submit review:', err);
      alert(`Failed to submit review: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };
  
  if (loading || !landlord) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Add Review For</h1>
      <h2 className="text-xl text-gray-600 mb-6 text-center">{landlord?.name}</h2>
      {!user && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            📝 You're submitting as a guest. 
            <a href="/login" className="underline ml-1 font-semibold">Log in</a> to edit your review later and get it verified.
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
          showFileUpload={!!user}
        />

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewPage;