import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  where,
  query,
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Register a new user
export const registerUser = async (email: string, password: string) => {
  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Add user data to the existing 'users' collection in Firestore with an empty 'profiles' array
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      profiles: [], // Initialize with an empty array
      // Add other user-specific fields here if necessary
    });

    console.log("User registered successfully:", user.uid);

    return { success: true, user };
  } catch (error: any) {
    console.error("Registration Error:", error);

    // Return error details for handling in the registration handler
    return { success: false, error };
  }
};

// Login an existing user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    return token;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const fetchProfiles = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      // Check if profiles array exists and return it
      console.log("User data:", userData);
      return userData.profiles || [];
    } else {
      console.error("No user document found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};

export const addProfile = async (userId: string) => {
  const profilesRef = collection(db, "users", userId, "profiles");
  const newProfile = {
    name: "Added User",
    image: "images/profile2.png", // Dummy image for new profiles
  };
  await addDoc(profilesRef, newProfile);
};

let globalUserId: string | null = null;
let globalProfileId: string | null = null;

export const setGlobalUserId = (userId: string) => {
  globalUserId = userId;
};

export const setGlobalProfileId = (profileId: string) => {
  globalProfileId = profileId;
};

export const getGlobalUserId = (): string | null => {
  return globalUserId;
};

export const getGlobalProfileId = (): string | null => {
  return globalProfileId;
};
