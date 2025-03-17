
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';

// Save order to Firestore
export const saveOrder = async (orderData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to place an order');
    }

    const orderWithUserData = {
      ...orderData,
      userId: user.uid,
      userEmail: user.email,
      timestamp: new Date(),
    };

    const docRef = await addDoc(collection(db, 'orders'), orderWithUserData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving order:', error);
    throw error;
  }
};

// Get user's order history
export const getUserOrders = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to fetch orders');
    }

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Update user profile in Firestore
export const updateUserProfileData = async (profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be logged in to update profile');
    }

    const userProfileRef = doc(db, 'userProfiles', user.uid);
    
    const profileSnapshot = await getDoc(userProfileRef);
    const existingData = profileSnapshot.exists() ? profileSnapshot.data() : {};
    
    // Remove undefined values to avoid overwriting with undefined
    Object.keys(profileData).forEach(key => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });
    
    const updatedData = {
      ...existingData,
      ...profileData,
      updatedAt: new Date(),
    };
    
    await setDoc(userProfileRef, updatedData);
    
    return userProfileRef.id;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user profile data from Firestore using user ID
export const getUserProfileData = async (userId = null) => {
  try {
    const user = userId || (auth.currentUser?.uid);
    if (!user) {
      throw new Error('No user ID provided to fetch profile');
    }
    
    const userProfileRef = doc(db, 'userProfiles', typeof user === 'string' ? user : user.uid);
    const profileSnapshot = await getDoc(userProfileRef);
    
    if (profileSnapshot.exists()) {
      const data = profileSnapshot.data();
      // Convert Firestore timestamps to JS Date objects if needed
      if (data.updatedAt) {
        data.updatedAt = data.updatedAt.toDate();
      }
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Initialize empty profile for new users
export const initializeUserProfile = async (user) => {
  if (!user || !user.uid) return null;
  
  try {
    // Check if profile already exists
    const userProfileRef = doc(db, 'userProfiles', user.uid);
    const profileSnapshot = await getDoc(userProfileRef);
    
    // Only create if it doesn't exist
    if (!profileSnapshot.exists()) {
      const initialData = {
        displayName: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(userProfileRef, initialData);
      return initialData;
    }
    
    return profileSnapshot.data();
  } catch (error) {
    console.error('Error initializing user profile:', error);
    return null;
  }
};
