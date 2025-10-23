
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AddLandlordPage: React.FC = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addReview, setAddReview] = useState(false);
  const [rating, setRating] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [maintenance, setMaintenance] = useState(3);
  const [respect, setRespect] = useState(3);
  const [comment, setComment] = useState('');
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

  const { addLandlord: apiAddLandlord } = useData();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      alert('Please fill in landlord name and address.');
      return;
    }

    const landlordData = { name, address, city: 'Pittsburgh' };
    let reviewData;
    if (addReview) {
      reviewData = {
        rating,
        communication,
        maintenance,
        respect,
        comment,
        isVerified: !!verificationFile
      };
    }
    
    try {
        const newLandlord = await apiAddLandlord(landlordData, reviewData);
        alert('Landlord added successfully!');
        navigate(`/landlord/${newLandlord.id}`);
    } catch(err) {
        alert('Failed to add landlord.');
    }
  };

  const formInputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const formLabelStyle = "block mb-1 font-semibold text-gray-700";

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Add a New Landlord</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={formLabelStyle}>Landlord/Company Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={formInputStyle} required />
        </div>
        <div>
          <label htmlFor="address" className={formLabelStyle}>Property Address</label>
          <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className={formInputStyle} required />
        </div>
        
        <div className="pt-4 border-t">
            <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={addReview} onChange={e => setAddReview(e.target.checked)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="font-semibold text-gray-700">Add your review now?</span>
            </label>
        </div>

        {addReview && (
          <div className="space-y-4 p-4 border rounded-md bg-gray-50">
            <h2 className="text-xl font-semibold text-center">Your Review</h2>
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
              <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} className={formInputStyle} rows={4}></textarea>
            </div>
             <div>
              <label htmlFor="verification" className={formLabelStyle}>Upload Verification (Optional)</label>
              <input type="file" id="verification" onChange={e => setVerificationFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p className="text-xs text-gray-500 mt-1">E.g., a redacted copy of your lease agreement. This helps verify your review.</p>
            </div>
          </div>
        )}

        <button type="submit" className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75">
          Submit Landlord
        </button>
      </form>
    </div>
  );
};

export default AddLandlordPage;
