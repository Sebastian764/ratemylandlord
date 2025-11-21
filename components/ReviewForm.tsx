import React from 'react';
import { validateVerificationFile } from '../utils/fileValidation';

interface ReviewFormProps {
  rating: number;
  setRating: (value: number) => void;
  communication: number;
  setCommunication: (value: number) => void;
  maintenance: number;
  setMaintenance: (value: number) => void;
  respect: number;
  setRespect: (value: number) => void;
  comment: string;
  setComment: (value: string) => void;
  wouldRentAgain: boolean;
  setWouldRentAgain: (value: boolean) => void;
  rentAmount: string;
  setRentAmount: (value: string) => void;
  propertyAddress: string;
  setPropertyAddress: (value: string) => void;
  verificationFile: File | null;
  setVerificationFile: (file: File | null) => void;
  commentRequired?: boolean;
  showFileUpload?: boolean;
  user?: { id: string; email?: string } | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  rating,
  setRating,
  communication,
  setCommunication,
  maintenance,
  setMaintenance,
  respect,
  setRespect,
  wouldRentAgain,
  setWouldRentAgain,
  comment,
  setComment,
  rentAmount,
  setRentAmount,
  propertyAddress,
  setPropertyAddress,
  verificationFile,
  setVerificationFile,
  commentRequired = false,
  showFileUpload = true,
  user = null,
}) => {
  const formInputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const formLabelStyle = "block mb-1 font-semibold text-gray-700";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      setVerificationFile(null);
      return;
    }

    // Validate file using shared utility
    const validation = validateVerificationFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      e.target.value = ''; // Clear the input
      setVerificationFile(null);
      return;
    }

    setVerificationFile(file);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div>
        <label className={formLabelStyle}>Overall Rating: {rating}/5</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={rating} 
          onChange={e => setRating(Number(e.target.value))} 
          className="w-full" 
        />
      </div>
      <div>
        <label className={formLabelStyle}>Communication: {communication}/5</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={communication} 
          onChange={e => setCommunication(Number(e.target.value))} 
          className="w-full" 
        />
      </div>
      <div>
        <label className={formLabelStyle}>Maintenance: {maintenance}/5</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={maintenance} 
          onChange={e => setMaintenance(Number(e.target.value))} 
          className="w-full" 
        />
      </div>
      <div>
        <label className={formLabelStyle}>Respectfulness: {respect}/5</label>
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={respect} 
          onChange={e => setRespect(Number(e.target.value))} 
          className="w-full" 
        />
      </div>
      <div>
        <label htmlFor="comment" className={formLabelStyle}>Comment</label>
        <textarea 
          id="comment" 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          className={formInputStyle} 
          rows={4}
          required={commentRequired}
        ></textarea>
      </div>
      <div>
        <label className={formLabelStyle}>
          <input 
            type="checkbox" 
            checked={wouldRentAgain}
            onChange={e => setWouldRentAgain(e.target.checked)}
          />
          Would you rent again from this landlord?
        </label>
      </div>
      <div>
        <label htmlFor="rentAmount" className={formLabelStyle}>How much was rent plus utilities? (Optional)</label>
        <input 
          type="number" 
          id="rentAmount" 
          value={rentAmount}
          onChange={e => setRentAmount(e.target.value)}
          min="0"
          step="0.01"
          placeholder="e.g., 1200.00"
          className={formInputStyle}
        />
      </div>

      <div>
        <label htmlFor="propertyAddress" className={formLabelStyle}>Property Address (Optional)</label>
        <input 
          type="text" 
          id="propertyAddress" 
          value={propertyAddress}
          onChange={e => setPropertyAddress(e.target.value)}
          placeholder="e.g., 123 Main St, Pittsburgh, PA"
          className={formInputStyle}
        />
      </div>

      {showFileUpload && (
        <div>
          {user && !verificationFile && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                ⚠️ Without a verification file, your review will be marked as unverified. You can upload a file now or later by editing your review to get it verified.
              </p>
            </div>
          )}
          <label htmlFor="verification" className={formLabelStyle}>Upload Verification (Optional)</label>
          <input 
            type="file" 
            id="verification"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
          />
          {verificationFile && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Selected: {verificationFile.name} ({(verificationFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            E.g., a redacted copy of your lease agreement. This helps verify your review. Only PDF files up to 15MB are accepted. Note that the file will only be used for verification purposes and will be deleted immediately after verification.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
