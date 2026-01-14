import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const FirebaseContext = createContext();

export function useFirebase() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a new user
  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with displayName
      await updateProfile(userCredential.user, { displayName });
      
      // Create a user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date().toISOString()
      });
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  }

  // Sign in existing user
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign out user
  function logout() {
    return signOut(auth);
  }

  // Get user data from Firestore
  async function getUserData(userId) {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    getUserData
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
} 