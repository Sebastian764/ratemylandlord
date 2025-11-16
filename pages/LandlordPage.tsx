
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Landlord, Review } from '../types';
import ReviewCard from '../components/ReviewCard';

const LandlordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getLandlord, getReviewsForLandlord, loading } = useData();
  const { isAdmin } = useAuth();
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const landlordId = Number(id);
    if (landlordId) {
      getLandlord(landlordId).then(data => setLandlord(data || null));
      getReviewsForLandlord(landlordId).then(setReviews);
    }
  }, [id, getLandlord, getReviewsForLandlord, isAdmin]);

  // Filter out deleted reviews for non-admin users when calculating stats
  const activeReviews = isAdmin ? reviews.filter(r => !r.is_deleted) : reviews; // Changed to snake_case
  const averageRating = activeReviews.length > 0
    ? (activeReviews.reduce((acc, review) => acc + review.rating, 0) / activeReviews.length).toFixed(1)
    : 'N/A';

  if (loading && !landlord) return <div className="text-center">Loading...</div>;
  if (!landlord) return <div className="text-center">Landlord not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{landlord.name}</h1>
              {landlord.status === 'pending' && (
                <span className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                  Pending Approval
                </span>
              )}
              {landlord.status === 'rejected' && (
                <span className="px-3 py-1 text-sm font-semibold text-red-800 bg-red-200 rounded-full">
                  Rejected
                </span>
              )}
            </div>
            <p className="text-gray-600">
              {landlord.addresses && landlord.addresses.length > 0 ? `${landlord.addresses.join(', ')}, ` : ''}{landlord.city}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{averageRating}</div>
            <div className="text-gray-500">Overall Rating</div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          Reviews ({activeReviews.length}{isAdmin && reviews.length > activeReviews.length ? ` + ${reviews.length - activeReviews.length} deleted` : ''})
        </h2>
        <Link to={`/landlord/${id}/add-review`} className="px-6 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition shadow">
          Add a Review
        </Link>
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map(review => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p className="text-center bg-white p-6 rounded-lg shadow">No reviews yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default LandlordPage;
