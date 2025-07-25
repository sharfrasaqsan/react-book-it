import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

const UserRegister = () => {
  const {
    users,
    setUsers,
    userFormData,
    setUserFormData,
    navigate,
    loading,
    setLoading,
  } = useData();

  const handleChange = (e) => {
    setUserFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Basic validations
    if (
      !userFormData.firstName ||
      !userFormData.lastName ||
      !userFormData.email ||
      !userFormData.password ||
      !userFormData.confirmPassword
    ) {
      return toast.error("Please fill in all the fields.");
    }

    if (userFormData.password !== userFormData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    if (userFormData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    // Optional: Check if user with email already exists locally (Firebase will handle duplicates)
    const existingUser = users.find(
      (user) => user.email === userFormData.email
    );
    if (existingUser) {
      return toast.error("User with this email already exists. Please login.");
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userFormData.email,
        userFormData.password
      );

      const { uid } = userCredential.user;

      const newUser = {
        id: uid,
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        email: userFormData.email,
        role: "user",
        phone: userFormData.phone || "",
        address: userFormData.address || "",
        city: userFormData.city || "",
        state: userFormData.state || "",
        country: userFormData.country || "",
        createdAt: format(new Date(), "yyyy-MM-dd h:mm:ss a"),
        updatedAt: null,
        bookedEvents: [],
      };

      // Use setDoc with uid as document ID (IMPORTANT)
      await setDoc(doc(db, "users", uid), newUser);

      // Update users state locally
      setUsers([...users, newUser]);

      // Reset form
      setUserFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
      });

      toast.success("User account created successfully.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create user. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3" style={{ maxWidth: "400px" }}>
      <h5 className="mb-4 text-center">User Registration</h5>
      <form onSubmit={handleCreateUser}>
        {/* First Name */}
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-control"
            value={userFormData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            required
            autoFocus
          />
        </div>

        {/* Last Name */}
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-control"
            value={userFormData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control"
            value={userFormData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-control"
            value={userFormData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            minLength={6}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="form-control"
            value={userFormData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            minLength={6}
          />
          <small className="form-text text-muted">
            * Password must be at least 6 characters
          </small>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Registering...
            </>
          ) : (
            "Register as User"
          )}
        </button>

        {/* Link to Login */}
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-decoration-none fw-semibold text-primary"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default UserRegister;
