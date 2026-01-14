import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FeedbackForm = ({ darkMode = false }) => {
  const { currentUser, login, signup } = useFirebase();
  const [formData, setFormData] = useState({
    feedback: '',
    rating: 0
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSignup, setIsSignup] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to submit feedback');
      return;
    }

    if (!formData.feedback.trim()) {
      setError('Please enter your feedback');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Store the feedback in Firestore
      await addDoc(collection(db, "feedback"), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        displayName: currentUser.displayName || 'Anonymous',
        feedback: formData.feedback,
        rating: formData.rating,
        createdAt: new Date().toISOString()
      });
      
      setSuccess(true);
      setError(''); // Clear any warnings that were shown
      setFormData({ feedback: '', rating: 0 });
    } catch (error) {
      console.error("Feedback submission error:", error);
      setError('Error submitting feedback: ' + (error.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.email, loginData.password);
    } catch (error) {
      setError('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signup(signupData.email, signupData.password, signupData.name);
    } catch (error) {
      setError('Signup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: formData.rating === rating ? 0 : rating
    });
  };

  const renderLoginForm = () => {
    return (
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md max-w-md mx-auto`}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {isSignup ? 'Create Account' : 'Log In to Submit Feedback'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isSignup ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                required
              />
            </div>
            
            <div>
              <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                required
              />
            </div>
            
            <div>
              <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                required
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-semibold transition-colors`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}
              >
                Already have an account? Log In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                required
              />
            </div>
            
            <div>
              <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                required
              />
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-semibold transition-colors`}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
            
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} font-medium`}
              >
                Need an account? Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  const renderFeedbackForm = () => {
    return (
      <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md max-w-md mx-auto`}>
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Share Your Feedback</h2>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Thank you for your feedback!
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="text-2xl focus:outline-none transition-colors"
                >
                  <FaStar
                    className={`${
                      (hoveredRating !== null ? star <= hoveredRating : star <= formData.rating)
                        ? 'text-yellow-400'
                        : darkMode ? 'text-gray-600' : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {formData.rating > 0 ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`}>
              Feedback
            </label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows="4"
              className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-lg ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-semibold transition-colors`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="py-16">
      {currentUser ? renderFeedbackForm() : renderLoginForm()}
    </div>
  );
};

export default FeedbackForm; 