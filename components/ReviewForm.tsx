import React from 'react';

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
}) => {
  const formInputStyle = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const formLabelStyle = "block mb-1 font-semibold text-gray-700";

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

      <div>
        <label htmlFor="verification" className={formLabelStyle}>Upload Verification (Optional)</label>
        <input 
          type="file" 
          id="verification" 
          onChange={e => setVerificationFile(e.target.files ? e.target.files[0] : null)} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
        />
        <p className="text-xs text-gray-500 mt-1">E.g., a redacted copy of your lease agreement. This helps verify your review.</p>
      </div>
    </div>
  );
};

export default ReviewForm;
