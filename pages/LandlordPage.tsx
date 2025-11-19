
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
    <div className="max-w-6xl mx-auto">
      {/* Landlord Header Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{landlord.name}</h1>
              {landlord.status === 'pending' && (
                <span className="px-3 py-1 text-sm font-semibold text-yellow-700 bg-yellow-100 rounded-full border border-yellow-200">
                  Pending Approval
                </span>
              )}
              {landlord.status === 'rejected' && (
                <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full border border-red-200">
                  Rejected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {landlord.addresses && landlord.addresses.length > 0 ? `${landlord.addresses.join(', ')}, ` : ''}{landlord.city}
            </div>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{averageRating}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Overall Rating</div>
            </div>
            <div className="w-px h-10 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{activeReviews.length}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Rating Breakdown</h3>
            <div className="space-y-4">
              {['Communication', 'Maintenance', 'Respectfulness'].map((category) => {
                const categoryKeyMap: Record<string, keyof Review> = {
                  Communication: 'communication',
                  Maintenance: 'maintenance',
                  Respectfulness: 'respect',
                };
                const categoryKey = categoryKeyMap[category];
                const avg = activeReviews.length > 0
                  ? (activeReviews.reduce((acc, r) => acc + (Number(r[categoryKey]) || 0), 0) / activeReviews.length).toFixed(1)
                  : 'N/A';
                const percentage = activeReviews.length > 0 ? (Number(avg) / 5) * 100 : 0;

                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">{category}</span>
                      <span className="font-bold text-gray-900">{avg}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${Number(avg) >= 4 ? 'bg-green-500' : Number(avg) >= 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Have you rented here?</h3>
            <p className="text-blue-700 text-sm mb-4">Share your experience to help other students make better housing decisions.</p>
            <Link to={`/landlord/${id}/add-review`} className="block w-full py-2.5 text-center font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">
              Write a Review
            </Link>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Would Rent Again</span>
                <span className="font-bold text-gray-900">
                  {activeReviews.length > 0
                    ? `${Math.round((activeReviews.filter(r => r.would_rent_again).length / activeReviews.length) * 100)}%`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Rent Reported</span>
                <span className="font-bold text-gray-900">
                  {activeReviews.filter(r => r.rent_amount).length > 0
                    ? `$${Math.round(activeReviews.reduce((acc, r) => acc + (r.rent_amount || 0), 0) / activeReviews.filter(r => r.rent_amount).length)}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Reviews */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews <span className="text-gray-400 text-lg font-normal">({activeReviews.length})</span>
            </h2>
            {isAdmin && reviews.length > activeReviews.length && (
              <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {reviews.length - activeReviews.length} deleted reviews hidden
              </span>
            )}
          </div>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map(review => <ReviewCard key={review.id} review={review} />)
            ) : (
              <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8 8 0 01-8-8 2 2 0 012-2h6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No reviews yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share your experience with this landlord.</p>
                <Link to={`/landlord/${id}/add-review`} className="inline-flex items-center px-4 py-2 font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  Write a Review
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordPage;
