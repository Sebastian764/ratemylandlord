
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Landlord } from '../types';

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
        landlordId,
        userId: user?.id, // Track the user if they're logged in, undefined if anonymous
        rating,
        communication,
        maintenance,
        respect,
        comment,
        isVerified: !!verificationFile
    };

    try {
        await addReview(reviewData);
        alert('Review submitted successfully!');
        navigate(`/landlord/${landlordId}`);
    } catch(err) {
        console.error('Failed to submit review:', err);
        alert('Failed to submit review.');
    }
  };

  const formInputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const formLabelStyle = "block mb-1 font-semibold text-gray-700";
  
  if (loading || !landlord) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Add Review For</h1>
      <h2 className="text-xl text-gray-600 mb-6 text-center">{landlord?.name}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 p-4 border rounded-md bg-gray-50">
            <div>
              <label className={formLabelStyle}>Overall Rating: {rating}/5</label>
              <input type="range" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className={formLabelStyle}>Communication: {communication}/5</label>
              <input type="range" min="1" max="5" value={communication} onChange={e => setCommunication(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className={formLabelStyle}>Maintenance: {maintenance}/5</label>
              <input type="range" min="1" max="5" value={maintenance} onChange={e => setMaintenance(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className={formLabelStyle}>Respect: {respect}/5</label>
              <input type="range" min="1" max="5" value={respect} onChange={e => setRespect(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label htmlFor="comment" className={formLabelStyle}>Comment</label>
              <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} className={formInputStyle} rows={4} required></textarea>
            </div>
             <div>
              <label htmlFor="verification" className={formLabelStyle}>Upload Verification (Optional)</label>
              <input type="file" id="verification" onChange={e => setVerificationFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p className="text-xs text-gray-500 mt-1">E.g., a redacted copy of your lease agreement. This helps verify your review.</p>
            </div>
          </div>

        <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewPage;
