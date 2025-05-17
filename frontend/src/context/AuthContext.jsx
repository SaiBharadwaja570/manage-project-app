// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  auth,
  googleProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  getRedirectResult,
  signOut,
} from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    return signInWithRedirect(auth, googleProvider);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setCurrentUser(result.user);
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error);
      }
  
      console.log("currentUser:", user); 
      setLoading(false);
    });
  
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
