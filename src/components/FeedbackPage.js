import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import FeedbackForm from './FeedbackForm';
import Login from './Login';

function FeedbackPage() {
  const { currentUser, logout } = useFirebase();
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Feedback Portal</h1>
        
        {currentUser && (
          <div className="flex items-center space-x-4">
            <div className="text-gray-700">
              <span className="font-medium">Logged in as: </span>
              {currentUser.displayName || currentUser.email}
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
      
      {currentUser ? <FeedbackForm /> : <Login />}
    </div>
  );
}

export default FeedbackPage; 