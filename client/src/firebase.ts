import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect, createContext, useContext, ReactNode } from "react";

// Firebase configuration (use your own credentials from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAYkYX81_QyFwH471EdXTaK334xHZt2EZ8",
  authDomain: "task-manager-66724.firebaseapp.com",
  projectId: "task-manager-66724",
  storageBucket: "task-manager-66724.firebasestorage.app",
  messagingSenderId: "147805093265",
  appId: "1:147805093265:web:4092bbfe8f79447666ee30",
  measurementId: "G-DFMPLXY4ES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create context for auth state
interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap your app and provide auth context
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error logging out: ", error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ currentUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// Google sign-in functionality
const provider = new GoogleAuthProvider();

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User signed in: ", user);
    // Handle the user object here (e.g., save to context or redirect)
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};
