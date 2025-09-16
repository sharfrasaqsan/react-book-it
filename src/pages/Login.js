import { useState } from "react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { navigate, setLoading } = useData();
  const { setCurrentUser } = useAuth();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [localLoading, setLocalLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    <div className="container py-5">
      {/* Breadcrumbs + header (consistent with other pages) */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/events">Events</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Login
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            Welcome back
          </h1>
          <div className="text-muted">
            Sign in to book events and manage your account.
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/register" className="btn btn-outline-secondary">
            Create an account
          </Link>
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {/* Form card */}
        <div className="col-lg-6 col-xl-5">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="border-start border-4 border-primary ps-3 mb-3">
                <h2 className="h4 fw-semibold mb-0">Sign in</h2>
              </div>

              <form className="row g-3" onSubmit={handleSubmit} noValidate>
                <div className="col-12">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="you@company.com"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="password" className="form-label fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 d-flex justify-content-between align-items-center">
                  <div className="form-text">
                    Use the email you registered with.
                  </div>
                  {/* If you add a route later, link it here */}
                  {/* <Link to="/forgot" className="small">Forgot password?</Link> */}
                </div>

                <div className="col-12 d-grid mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={localLoading}
                  >
                    {localLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in…
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>

                <div className="col-12 text-center">
                  <div className="small text-muted">
                    Don’t have an account? <Link to="/register">Register</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: tips (sticky) */}
        <div className="col-lg-5">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem" }}
          >
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-muted mb-3">Tips</h3>
              <ul className="small text-muted mb-0">
                <li>Use the same email you used during registration.</li>
                <li>Passwords are case-sensitive.</li>
                <li>Organizers can manage events after signing in.</li>
              </ul>
            </div>
          </div>
        </div>
        {/* /Right column */}
      </div>
    </div>
  );
};

export default Login;
