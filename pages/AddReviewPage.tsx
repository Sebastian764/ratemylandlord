import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Landlord } from '../types';
import ReviewForm from '../components/ReviewForm';

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
    const reviewData = {
        landlord_id: landlordId,
        user_id: user?.id || undefined, // Optional: undefined for anonymous users
        rating,
        communication,
        maintenance,
        respect,
        comment,
        would_rent_again: wouldRentAgain,
        rent_amount: rentAmount ? parseFloat(rentAmount) : undefined,
        property_address: propertyAddress || undefined,
        verification_status: verificationFile ? 'pending' : 'unverified' as const
    };

    try {
        await addReview(reviewData);
        alert('Review submitted successfully!');
        navigate(`/landlord/${landlordId}`);
    } catch(err) {
        console.error('Failed to submit review:', err);
        alert('Failed to submit review. Please try again.');
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
            <a href="/login" className="underline ml-1 font-semibold">Log in</a> to edit your review later.
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
        />

        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewPage;