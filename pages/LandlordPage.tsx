
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import type { Landlord, Review } from '../types';
import ReviewCard from '../components/ReviewCard';
import { updateLandlordAddresses } from '../services/api';

const LandlordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getLandlord, getReviewsForLandlord, loading } = useData();
  const { isAdmin } = useAuth();
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const landlordId = Number(id);
    if (landlordId) {
      getLandlord(landlordId).then(data => setLandlord(data || null));
      getReviewsForLandlord(landlordId).then(setReviews);
    }
  }, [id, getLandlord, getReviewsForLandlord, isAdmin]);

  const handleAddAddress = async () => {
    if (!landlord) return;
    if (!newAddress.trim()) {
      alert('Address cannot be empty.');
      return;
    }
    
    setIsSaving(true);
    try {
      const updatedAddresses = [...(landlord.addresses || []), newAddress.trim()];
      await updateLandlordAddresses(landlord.id, updatedAddresses);
      setLandlord({ ...landlord, addresses: updatedAddresses });
      setNewAddress('');
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAddress = async (addressToRemove: string) => {
    if (!landlord) return;
    
    setIsSaving(true);
    try {
      const updatedAddresses = (landlord.addresses || []).filter(addr => addr !== addressToRemove);
      await updateLandlordAddresses(landlord.id, updatedAddresses);
      setLandlord({ ...landlord, addresses: updatedAddresses });
    } catch (error) {
      console.error('Error removing address:', error);
      alert('Failed to remove address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter out deleted reviews for non-admin users when calculating stats
  const activeReviews = isAdmin ? reviews.filter(r => !r.is_deleted) : reviews; 
  const averageRating = activeReviews.length > 0
    ? (activeReviews.reduce((acc, review) => acc + review.rating, 0) / activeReviews.length).toFixed(1)
    : 'N/A';

  if (loading && !landlord) return <div className="text-center">Loading...</div>;
  if (!landlord) return <div className="text-center">Landlord not found.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Landlord Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

        <div className="relative z-10 p-8">
          {/* Top Section: Basic Info & Overall Score */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-gray-100 pb-8">
            <div className="flex-1">
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
              
              {/* Location Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 text-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{landlord.city}</span>
                </div>

                {/* Addresses Display */}
                {landlord.addresses && landlord.addresses.length > 0 && (
                  <div className="ml-7 space-y-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Known Addresses</div>
                    {landlord.addresses.map((address, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">{address}</span>
                        {isAdmin && isEditingAddresses && (
                          <button
                            onClick={() => handleRemoveAddress(address)}
                            disabled={isSaving}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            title="Remove address"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Admin Address Management */}
                {isAdmin && (
                  <div className="ml-7 mt-3">
                    {!isEditingAddresses ? (
                      <button
                        onClick={() => setIsEditingAddresses(true)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Manage Addresses
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddAddress()}
                            placeholder="Enter new address"
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            disabled={isSaving}
                          />
                          <button
                            onClick={handleAddAddress}
                            disabled={!newAddress.trim() || isSaving}
                            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingAddresses(false);
                              setNewAddress('');
                            }}
                            disabled={isSaving}
                            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

          {/* Bottom Section: Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Rating Breakdown */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Rating Breakdown</h3>
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

            {/* Quick Stats */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-gray-500 text-sm mb-1">Would Rent Again</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeReviews.length > 0
                      ? `${Math.round((activeReviews.filter(r => r.would_rent_again).length / activeReviews.length) * 100)}%`
                      : 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-gray-500 text-sm mb-1">Avg Rent</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activeReviews.filter(r => r.rent_amount).length > 0
                      ? `$${Math.round(activeReviews.reduce((acc, r) => acc + (r.rent_amount || 0), 0) / activeReviews.filter(r => r.rent_amount).length)}`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              {activeReviews.length}
            </span>
            {isAdmin && reviews.length > activeReviews.length && (
              <span className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                {reviews.length - activeReviews.length} hidden
              </span>
            )}
          </div>

          {activeReviews.length > 0 && (
            <Link
              to={`/landlord/${id}/add-review`}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm"
            >
              Write a Review
            </Link>
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
  );
};

export default LandlordPage;
