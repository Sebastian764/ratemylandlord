
import React from 'react';
import type { Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ReviewCardProps {
  review: Review;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { isAdmin, user } = useAuth();
  const { deleteReview, restoreReview } = useData();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(review.id, review.landlord_id);
    }
  };

  const handleRestore = async () => {
    if (window.confirm('Are you sure you want to restore this review?')) {
      await restoreReview(review.id, review.landlord_id);
    }
  };

  // Check if the current user created this review
  const isOwnReview = user && review.user_id === user.id;

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border ${review.is_deleted ? 'border-red-300 opacity-70' : 'border-gray-200'}`}>
      {review.is_deleted && isAdmin && (
        <div className="mb-4 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-sm font-semibold">
          ⚠️ This review has been deleted and is only visible to admins
        </div>
      )}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <StarRating rating={review.rating} />
             <span className="font-bold text-lg">{review.rating.toFixed(1)} / 5.0</span>
          </div>
          <p className="text-sm text-gray-500">Reviewed on: {review.created_at}</p>
          {isOwnReview && (
            <p className="text-xs text-blue-600 font-semibold mt-1">Your review</p>
          )}
        </div>
        {review.verification_status === 'verified' ? (
          <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">✓ Verified</span>
        ) : review.verification_status === 'pending' ? (
          <span className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">⏳ Verification In Progress</span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full">Unverified</span>
        )}
      </div>
      <p className="mt-4 text-gray-700 italic">"{review.comment}"</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-center">
        <div className="p-2 bg-gray-100 rounded">Communication: <span className="font-semibold">{review.communication}/5</span></div>
        <div className="p-2 bg-gray-100 rounded">Maintenance: <span className="font-semibold">{review.maintenance}/5</span></div>
        <div className="p-2 bg-gray-100 rounded">Respectfulness: <span className="font-semibold">{review.respect}/5</span></div>
      </div>
      
      {/* Additional review details */}
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Would rent again:</span>
          <span className={review.would_rent_again ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {review.would_rent_again ? '✓ Yes' : '✗ No'}
          </span>
        </div>
        {review.rent_amount && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Rent + Utilities:</span>
            <span>${review.rent_amount.toFixed(2)}/month</span>
          </div>
        )}
        {review.property_address && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Property:</span>
            <span>{review.property_address}</span>
          </div>
        )}
      </div>
      
       {isAdmin && (
        <div className="mt-4 text-right flex justify-end gap-2">
          {review.is_deleted ? (
            <button
              onClick={handleRestore}
              className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              Restore Review
            </button>
          ) : (
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              Delete Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
