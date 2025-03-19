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
import { firebaseConfig,CONFIG } from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
import axios from 'axios';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      profiles: [], 
    });

    console.log("User registered successfully:", user.uid);

    await axios.post(`${CONFIG.API_BASE_URL}/api/auth/send-email`, {
      to: email,
      subject: 'Welcome to K-FLIX!',
      text: 'Thank you for registering with K-FLIX! We hope you enjoy our services.',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h1 style="color: #e50914;">Welcome to K-FLIX!</h1>
          <p>Thank you for registering with us. We are thrilled to have you as part of our growing community of movie lovers!</p>
          <p>Here's what you can do next:</p>
          <ul>
            <li>Explore our extensive collection of movies and TV shows.</li>
            <li>Create and manage personalized profiles for you and your family.</li>
            <li>Enjoy a seamless streaming experience with no ads.</li>
          </ul>
          <p>If you have any questions or need help, feel free to contact our support team at any time.</p>
          <br>
          <p>Happy watching!</p>
          <p>The <strong>K-FLIX Team</strong></p>
          <hr>
          <footer style="font-size: 12px; color: #777;">
            <p>You received this email because you signed up for K-FLIX. If this wasn't you, please contact our support.</p>
          </footer>
        </div>
      `,
    });

    return { success: true, user };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('This email is already in use.');
      return { success: false, error: 'This email is already registered. Please log in instead.' };
    } else {
      console.error("Registration Error:", error);
      return { success: false, error: error.message };
    }
  }
};

export const fetchProfiles = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
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
    image: "images/profile2.png",
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