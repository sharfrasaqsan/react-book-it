import { createContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useData } from "./DataContext";

const AuthContext = createContext;

export const AuthProvider = ({ children }) => {
  const { users, setCurrentUser, setLoading } = useData();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const matchedUser = users.find((i) => i.email === user.email);
        setCurrentUser(matchedUser);
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
      return () => unsubscribe();
    });
  }, [users, setCurrentUser, setLoading]);
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
