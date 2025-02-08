import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from 'react-toastify';

import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYkYX81_QyFwH471EdXTaK334xHZt2EZ8",
  authDomain: "task-manager-66724.firebaseapp.com",
  projectId: "task-manager-66724",
  storageBucket: "task-manager-66724.firebasestorage.app",
  messagingSenderId: "147805093265",
  appId: "1:147805093265:web:4092bbfe8f79447666ee30",
  measurementId: "G-DFMPLXY4ES",
};


interface UserProps {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  photoURL: string;
  providerData: {
    providerId: string;
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string | null;
    photoURL: string;
  }[];
  stsTokenManager: {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
  };
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

interface AuthContextType {
  currentUser: any;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<any>(
    localStorage.getItem("User") ? JSON.parse(localStorage.getItem("User")!) : null
  );
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user: any = result.user;
      localStorage.setItem("User", JSON.stringify(user));
      setCurrentUser(user);
      console.log("Google Sign-In Success:", user);
      toast("Logged in successfully!"); 


    } catch (error: any) {
      console.error("Google Sign-In Error:", error.message);
      setCurrentUser(null);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

