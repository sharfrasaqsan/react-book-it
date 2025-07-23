import { useState } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { navigate, setLoading } = useData();
  const { setCurrentUser } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [localLoading, setLocalLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    if (!email || !password) {
      toast.error("Please fill in all the fields.");
      return;
    }

    try {
      setLocalLoading(true);
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.toLowerCase(),
        password
      );

      const user = userCredential.user;

      // Fetch Firestore user data
      const userDocRef = await getDoc(doc(db, "users", user.uid));

      if (!userDocRef.exists()) {
        toast.error("User data not found in Firestore.");
        return;
      }

      const userData = userDocRef.data();
      setCurrentUser(userData);
      toast.success("Login successful.");
      setLoginData({ email: "", password: "" });

      setTimeout(() => {
        navigate("/");
      }, 300);
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          toast.error("No user found with this email.");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format.");
          break;
        default:
          toast.error("Login failed. " + err.message);
      }
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          disabled={localLoading}
        >
          {localLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
