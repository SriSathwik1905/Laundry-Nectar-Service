import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  googleProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from '../lib/firebase';
import { toast } from '@/components/ui/use-toast';
import { getUserProfileData, updateUserProfileData, initializeUserProfile } from '../lib/firebaseService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        // Initialize empty profile for new user
        await initializeUserProfile(result.user);
        return result;
      });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    // Keep userProfile data in state - we'll clear it in the auth state change listener
    return signOut(auth);
  }

  function googleSignIn() {
    return signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // Initialize profile for new Google users if needed
        await initializeUserProfile(result.user);
        return result;
      })
      .catch(error => {
        // Log the error for debugging
        console.error("Google Sign In Error:", error);
        
        // If it's an unauthorized domain error, provide more specific guidance
        if (error.code === 'auth/unauthorized-domain') {
          console.log("Current domain not authorized in Firebase. Go to Firebase Console > Authentication > Sign-in method > Authorized domains and add your domain.");
          toast({
            variant: "destructive",
            title: "Domain not authorized",
            description: "This domain is not authorized in Firebase. Please contact the administrator.",
          });
        }
        
        // Rethrow the error to be handled by the component
        throw error;
      });
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
      .catch(error => {
        console.error("Password Reset Error:", error);
        
        // Provide more user-friendly error messages
        if (error.code === 'auth/user-not-found') {
          throw new Error("No account found with this email address");
        } else if (error.code === 'auth/invalid-email') {
          throw new Error("Please enter a valid email address");
        } else if (error.code === 'auth/network-request-failed') {
          throw new Error("Network error. Please check your internet connection");
        } else {
          throw error;
        }
      });
  }

  function updateUserProfile(displayName, photoURL) {
    return updateProfile(auth.currentUser, {
      displayName: displayName || auth.currentUser.displayName,
      photoURL: photoURL || auth.currentUser.photoURL
    }).then(async () => {
      // Update Firestore profile data as well
      await updateUserProfileData({
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
      });
      
      // Update local state
      setUserProfile(prevProfile => ({
        ...prevProfile,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
      }));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    });
  }

  function sendVerificationEmail() {
    return sendEmailVerification(auth.currentUser);
  }

  // Fetch additional profile data from Firestore
  const fetchUserProfileData = async (user) => {
    if (!user) return null;
    
    try {
      // Get existing profile data or initialize a new one
      let profileData = await getUserProfileData(user.uid);
      
      if (!profileData) {
        // Create a profile if none exists
        profileData = await initializeUserProfile(user);
      }
      
      // Merge Firebase Auth data with Firestore profile data
      return {
        displayName: user.displayName || profileData?.displayName || '',
        photoURL: user.photoURL || profileData?.photoURL || '',
        email: user.email,
        emailVerified: user.emailVerified,
        uid: user.uid,
        // Include all Firestore data
        ...profileData
      };
    } catch (error) {
      console.error("Error fetching additional profile data:", error);
      // Return basic user data if profile fetch fails
      return {
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        email: user.email,
        emailVerified: user.emailVerified,
        uid: user.uid
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Set currentUser as soon as auth state changes
      setCurrentUser(user);
      
      if (user) {
        // Fetch extended profile for authenticated user
        const extendedProfile = await fetchUserProfileData(user);
        setUserProfile(extendedProfile);
      } else {
        // Clear user profile when logged out
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    googleSignIn,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
