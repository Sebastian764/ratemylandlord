
import React from 'react';
import type { Review } from '../types';
import { useAdmin } from '../context/AdminContext';
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
  const { isAdmin } = useAdmin();
  const { deleteReview } = useData();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      await deleteReview(review.id, review.landlordId);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-2">
             <StarRating rating={review.rating} />
             <span className="font-bold text-lg">{review.rating.toFixed(1)} / 5.0</span>
          </div>
          <p className="text-sm text-gray-500">Reviewed on: {review.createdAt}</p>
        </div>
        {review.isVerified ? (
          <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">Verified</span>
        ) : (
          <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Not Verified</span>
        )}
      </div>
      <p className="mt-4 text-gray-700 italic">"{review.comment}"</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-center">
        <div className="p-2 bg-gray-100 rounded">Communication: <span className="font-semibold">{review.communication}/5</span></div>
        <div className="p-2 bg-gray-100 rounded">Maintenance: <span className="font-semibold">{review.maintenance}/5</span></div>
        <div className="p-2 bg-gray-100 rounded">Respect: <span className="font-semibold">{review.respect}/5</span></div>
      </div>
       {isAdmin && (
        <div className="mt-4 text-right">
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Delete Review
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
