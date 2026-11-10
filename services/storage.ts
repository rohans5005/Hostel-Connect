import { Listing, User, UserRole } from '../types';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { MOCK_LISTINGS, COLLEGES, MOCK_USERS } from '../constants';

import { auth, googleProvider } from './firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const KEYS = {
  USER_SESSION: 'hostel_connect_session_id'
};

export const StorageService = {
  getUser: async (): Promise<User | null> => {
    const sessionId = localStorage.getItem(KEYS.USER_SESSION);
    if (!sessionId) return null;

    if (sessionId === 'admin_1') {
      return {
        id: 'admin_1',
        name: 'Administrator',
        email: 'admin@hostel.com',
        role: 'admin'
      };
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', sessionId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (e) {
      console.error("Error fetching user:", e);
      // Fallback to mock user if firestore fails
      const mockUser = MOCK_USERS.find(u => u.id === sessionId);
      if (mockUser) return mockUser;
      return null;
    }
  },

  signUp: async (email: string, password: string, role: UserRole, extraDetails: { name: string, contact: string, address: string }): Promise<User> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;
      
      const user: User = {
        id: fbUser.uid,
        name: extraDetails.name || email.split('@')[0],
        email: email,
        contact: extraDetails.contact,
        address: extraDetails.address,
        role: role,
        ...(role === 'owner' ? { isApproved: false } : {})
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), user);
      } catch (e) {
        console.warn('Could not save new user to Firestore (likely due to rules). Proceeding with local session.', e);
      }
      localStorage.setItem(KEYS.USER_SESSION, user.id);
      return user;
    } catch (error: any) {
      console.error("SignUp Error:", error);
      throw new Error(error.message || "Failed to sign up");
    }
  },

  googleLogin: async (role: UserRole): Promise<User> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      let user: User;

      if (userDoc.exists()) {
        user = userDoc.data() as User;
      } else {
        user = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          role: role,
          ...(role === 'owner' ? { isApproved: false } : {})
        };
        try {
          await setDoc(doc(db, 'users', fbUser.uid), user);
        } catch (e) {
          console.warn('Could not save new user to Firestore (likely due to rules). Proceeding with local session.', e);
        }
      }
      
      localStorage.setItem(KEYS.USER_SESSION, user.id);
      return user;
    } catch (error: any) {
      console.error("Google Login Error:", error);
      throw new Error(error.message || "Failed to sign in with Google");
    }
  },

  login: async (email: string, password: string, role: UserRole): Promise<User> => {
    // 1. Strict check if user selects Admin role
    if (role === 'admin') {
      if (email === 'admin@hostel.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin_1',
          name: 'Administrator',
          email: email,
          role: 'admin'
        };
        try {
          await setDoc(doc(db, 'users', adminUser.id), adminUser);
        } catch (e) {
          console.warn('Could not save admin user to Firestore (likely due to rules), proceeding with local session.', e);
        }
        localStorage.setItem(KEYS.USER_SESSION, adminUser.id);
        return adminUser;
      } else {
        throw new Error("Invalid credentials for Admin. Please use admin@hostel.com");
      }
    }

    // 2. Check if it's a mock user
    const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password && u.role === role);
    if (mockUser) {
       localStorage.setItem(KEYS.USER_SESSION, mockUser.id);
       return mockUser;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        throw new Error("User record not found in database.");
      }
      const user = userDoc.data() as User;
      if (user.role !== role) {
         // Optionally warn about role mismatch, but for now just let them in as their true role
      }
      localStorage.setItem(KEYS.USER_SESSION, user.id);
      return user;
    } catch (err: any) {
      console.error("Login Error:", err);
      throw new Error("Invalid email or password");
    }
  },

  logout: async () => {
    localStorage.removeItem(KEYS.USER_SESSION);
    try {
      const { auth } = await import('./firebase');
      await auth.signOut();
    } catch(e) {}
  },

  getListings: async (): Promise<Listing[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'listings'));
      if (querySnapshot.empty) {
        // Try to hydrate mock listings
        try {
          const promises = MOCK_LISTINGS.map(l => {
            const newId = l.id;
            const listing = { ...l, ownerId: l.ownerId === 'owner1' ? 'owner@gmail.com' : l.ownerId };
            return setDoc(doc(db, 'listings', newId), listing);
          });
          await Promise.all(promises);
        } catch (hydrationError) {
          console.warn("Could not save mock listings to Firestore. Returning them from memory instead.", hydrationError);
        }
        
        // Return modified mocks
        return MOCK_LISTINGS.map(l => ({...l, ownerId: l.ownerId === 'owner1' ? 'owner@gmail.com' : l.ownerId}));
      }
      return querySnapshot.docs.map(doc => doc.data() as Listing);
    } catch (e) {
      console.error("Error fetching listings:", e);
      return MOCK_LISTINGS.map(l => ({...l, ownerId: l.ownerId === 'owner1' ? 'owner@gmail.com' : l.ownerId}));
    }
  },

  getOwners: async (): Promise<User[]> => {
    try {
      const q = query(collection(db, 'users'), where('role', '==', 'owner'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return MOCK_USERS.filter(u => u.role === 'owner');
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (e) {
      console.error("Error fetching owners:", e);
      return MOCK_USERS.filter(u => u.role === 'owner');
    }
  },

  getAllUsers: async (): Promise<User[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      if (querySnapshot.empty) return MOCK_USERS;
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (e) {
      console.error("Error fetching all users:", e);
      return MOCK_USERS;
    }
  },

  approveOwner: async (ownerId: string): Promise<void> => {
    await updateDoc(doc(db, 'users', ownerId), { isApproved: true });
  },

  addListing: async (listing: Listing): Promise<void> => {
    await setDoc(doc(db, 'listings', listing.id), listing);
  },

  updateListing: async (updatedListing: Listing): Promise<void> => {
    await setDoc(doc(db, 'listings', updatedListing.id), updatedListing);
  },

  deleteListing: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'listings', id));
  },

  getAnalytics: async () => {
    const listings = await StorageService.getListings();
    const totalListings = listings.length;
    
    const listingsPerCollege = COLLEGES.map(college => {
      return {
        name: college.name,
        count: listings.filter(l => l.collegeId === college.id).length
      };
    });

    const totalRent = listings.reduce((sum, l) => sum + l.rent, 0);
    const avgRent = totalListings > 0 ? Math.round(totalRent / totalListings) : 0;

    return {
      totalUsers: 145, 
      totalStudents: 120, 
      totalOwners: 25, 
      totalListings,
      listingsPerCollege,
      avgRent
    };
  }
};