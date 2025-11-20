import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Contact Us</h1>
      <p className="mb-4 text-gray-700">
        If you have any questions, feedback, or need assistance, please feel free to reach out to us. We value your input and are here to help!
      </p>
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">Email</h2>
      <p className="mb-6 text-gray-700">You can email us at <a href="mailto:pittratemylandlord@gmail.com" className="text-blue-600 hover:underline">pittratemylandlord@gmail.com</a>.</p> 
    </div>
  );
};

export default ContactPage;