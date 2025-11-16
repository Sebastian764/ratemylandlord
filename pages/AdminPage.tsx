import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import type { Landlord, Review } from '../types';
import * as api from '../services/api';

const AdminPage: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [pendingLandlords, setPendingLandlords] = useState<Landlord[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'landlords' | 'reviews'>('landlords');

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingItems();
    }
  }, [isAdmin]);

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      const [landlords, reviews] = await Promise.all([
        api.getPendingLandlords(),
        api.getPendingReviews()
      ]);
      setPendingLandlords(landlords);
      setPendingReviews(reviews);
    } catch (error) {
      console.error('Error fetching pending items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLandlord = async (id: number) => {
    // TODO: Using window.confirm for user confirmation is not accessible and provides poor UX. Consider implementing a custom modal component that supports keyboard navigation and screen readers.
    if (!window.confirm('Are you sure you want to approve this landlord?')) {
      return;
    }
    
    try {
      await api.updateLandlordStatus(id, 'approved');
      await fetchPendingItems();
    } catch (error) {
      alert(`Failed to approve landlord: ${error && error.message ? error.message : String(error)}`);
      alert('Failed to approve landlord');
    }
  };

  const handleRejectLandlord = async (id: number) => {
    if (!window.confirm('Are you sure you want to reject this landlord?')) {
      return;
    }
    
    try {
      await api.updateLandlordStatus(id, 'rejected');
      await fetchPendingItems();
    } catch (error) {
      alert(`Failed to reject landlord: ${error instanceof Error ? error.message : String(error)}`);
      alert('Failed to reject landlord');
    }
  };

  const handleApproveReview = async (id: number) => {
    if (!window.confirm('Are you sure you want to approve this review?')) {
      return;
    }
    
    try {
      await api.updateReviewVerificationStatus(id, 'verified');
      await fetchPendingItems();
    } catch (error) {
      const errorMsg = error && error.message ? error.message : String(error);
      alert(`Failed to approve review: ${errorMsg}`);
      alert('Failed to approve review');
    }
  };

  const handleRejectReview = async (id: number) => {
    if (!window.confirm('Are you sure you want to reject this review?')) {
      return;
    }
    
    try {
      await api.updateReviewVerificationStatus(id, 'unverified');
      await fetchPendingItems();
    } catch (error) {
      alert(`Failed to reject review: ${error && error.message ? error.message : String(error)}`);
      console.error('Error rejecting review:', error);
    }
  };

  if (authLoading || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Admin Portal</h1>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('landlords')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'landlords'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Landlords ({pendingLandlords.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Reviews ({pendingReviews.length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          {/* Pending Landlords Tab */}
          {activeTab === 'landlords' && (
            <div className="space-y-4">
              {pendingLandlords.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending landlords</p>
              ) : (
                pendingLandlords.map((landlord) => (
                  <div key={landlord.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{landlord.name}</h3>
                        <p className="text-gray-600 mb-1">
                          <span className="font-semibold">City:</span> {landlord.city}
                        </p>
                        {landlord.addresses && landlord.addresses.length > 0 && (
                          <p className="text-gray-600 mb-1">
                            <span className="font-semibold">Addresses:</span> {landlord.addresses.join(', ')}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm">
                          Submitted: {new Date(landlord.created_at || '').toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveLandlord(landlord.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectLandlord(landlord.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Pending Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {pendingReviews.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending reviews</p>
              ) : (
                pendingReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="mb-3">
                          <span className="text-2xl font-bold text-gray-800">
                            {review.rating.toFixed(1)} ⭐
                          </span>
                          <span className="text-gray-500 ml-2">Overall Rating</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Communication</p>
                            <p className="font-semibold">{review.communication}/5</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Maintenance</p>
                            <p className="font-semibold">{review.maintenance}/5</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Respect</p>
                            <p className="font-semibold">{review.respect}/5</p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 italic">"{review.comment}"</p>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          {review.property_address && (
                            <p><span className="font-semibold">Address:</span> {review.property_address}</p>
                          )}
                          {review.rent_amount && (
                            <p><span className="font-semibold">Rent:</span> ${review.rent_amount}/month</p>
                          )}
                          <p>
                            <span className="font-semibold">Would rent again:</span>{' '}
                            {review.would_rent_again ? 'Yes' : 'No'}
                          </p>
                        </div>

                        {review.verification_file_url && (
                          <div className="mb-3">
                            <a
                              href={review.verification_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              📎 View verification file
                            </a>
                          </div>
                        )}

                        <p className="text-gray-500 text-sm">
                          Submitted: {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleApproveReview(review.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectReview(review.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;
