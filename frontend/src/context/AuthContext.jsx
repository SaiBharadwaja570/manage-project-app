import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../services/firebase";
import { loginWithBackend } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await getIdToken(firebaseUser);
        localStorage.setItem("firebaseToken", token);
        try {
          const res = await loginWithBackend(token);
          localStorage.setItem("token", res.data.token);
          setUser(res.data.user);
        } catch (err) {
          console.error("Backend login failed", err);
        }
      } else {
        setUser(null);
        localStorage.removeItem("token");
      }
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
