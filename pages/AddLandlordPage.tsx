import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import { uploadVerificationFile } from '../services/api';
import { supabase } from '../services/supabase';

const AddLandlordPage: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addReview, setAddReview] = useState(false);
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

  const { addLandlord: apiAddLandlord } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      alert('Please fill in landlord name.');
      return;
    }

    setUploading(true);

    const landlordData = { 
      name, 
      addresses: address ? [address] : undefined,
      city: 'Pittsburgh' 
    };
    
    let reviewData;
    if (addReview) {
      reviewData = {
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
    }
    
    try {
      const newLandlord = await apiAddLandlord(landlordData, reviewData);
      
      // If there's a verification file and a review was added, upload it
      if (verificationFile && reviewData && user?.id) {
        try {
          // Get the review that was just created
          const { data: reviews } = await supabase
            .from('reviews')
            .select('id')
            .eq('landlord_id', newLandlord.id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (reviews && reviews.length > 0) {
            const reviewId = reviews[0].id;
            const filePath = await uploadVerificationFile(verificationFile, user.id, reviewId);
            
            // Update the review with the file path
            await supabase
              .from('reviews')
              .update({ verification_file_url: filePath })
              .eq('id', reviewId);
          }
        } catch (uploadError) {
          console.error('Failed to upload verification file:', uploadError);
          alert(`Landlord added, but file upload failed: ${uploadError?.message || 'Unknown error'}`);
        }
      }

      alert('Landlord added successfully!');
      navigate(`/landlord/${newLandlord.id}`);
    } catch(err) {
      console.error('Failed to add landlord:', err);
      alert(`Failed to add landlord: ${err?.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  const formInputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const formLabelStyle = "block mb-1 font-semibold text-gray-700";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Add a New Landlord</h1>
      {!user && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            📝 You're submitting as a guest. 
            <a href="/login" className="underline ml-1 font-semibold">Log in</a> to edit your submissions later and upload verification.
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={formLabelStyle}>Landlord/Company Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={formInputStyle} required />
        </div>
        <div>
          <label htmlFor="address" className={formLabelStyle}>Property Address (Optional)</label>
          <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className={formInputStyle} />
        </div>
        
        <div className="pt-4 border-t">
            <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={addReview} onChange={e => setAddReview(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="font-semibold text-gray-700">Add your review now?</span>
            </label>
        </div>

        {addReview && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Your Review</h2>
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
              showFileUpload={!!user}
            />
          </div>
        )}

        <button 
          type="submit" 
          disabled={uploading}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Submitting...' : 'Submit Landlord'}
        </button>
      </form>
    </div>
  );
};

export default AddLandlordPage;