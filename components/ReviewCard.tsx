
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  const handleEdit = () => {
    navigate(`/landlord/${review.landlord_id}/review/${review.id}/edit`);
  };

  // Check if the current user created this review
  const isOwnReview = user && review.user_id === user.id;

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md ${review.is_deleted ? 'border-red-200 bg-red-50 opacity-75' : 'border-gray-100'}`}>
      {review.is_deleted && isAdmin && (
        <div className="mb-4 flex items-center gap-2 text-red-700 text-sm font-medium bg-red-100 px-3 py-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Deleted Review (Admin View)
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.rating} />
            <span className="font-bold text-xl text-gray-900">{review.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {isOwnReview && (
              <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">You</span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-wrap gap-2">
          {review.created_by_student && (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full border border-blue-200">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Verified Student
            </span>
          )}
          {review.verification_status === 'verified' ? (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full border border-green-200">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
              Verified Tenant
            </span>
          ) : review.verification_status === 'pending' ? (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-secondary-700 bg-secondary-50 rounded-full border border-secondary-200">
              <svg className="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Verification Pending
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200">
              Unverified
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{review.comment}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Communication</div>
          <div className="font-semibold text-gray-900">{review.communication}/5</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Maintenance</div>
          <div className="font-semibold text-gray-900">{review.maintenance}/5</div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Respectfulness</div>
          <div className="font-semibold text-gray-900">{review.respect}/5</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-500">Would rent again:</span>
          <span className={`flex items-center gap-1 font-medium ${review.would_rent_again ? 'text-green-600' : 'text-red-600'}`}>
            {review.would_rent_again ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Yes</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> No</>
            )}
          </span>
        </div>

        {review.rent_amount && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-500">Rent:</span>
            <span className="text-gray-900">${review.rent_amount.toFixed(2)}/mo</span>
          </div>
        )}

        {review.property_address && (
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-500">Property:</span>
            <span className="text-gray-900">{review.property_address}</span>
          </div>
        )}
      </div>

      {(isOwnReview || isAdmin) && (
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
          {isOwnReview && !review.is_deleted && (
            <button
              onClick={handleEdit}
              className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}
          {isAdmin && (
            review.is_deleted ? (
              <button
                onClick={handleRestore}
                className="px-3 py-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                Restore
              </button>
            ) : (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
