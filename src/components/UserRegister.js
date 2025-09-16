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

  const handleChange = (e) =>
    setUserFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (
      !userFormData.firstName ||
      !userFormData.lastName ||
      !userFormData.email ||
      !userFormData.password ||
      !userFormData.confirmPassword
    ) {
      return toast.error("Please fill in all the fields.");
    }
    if (userFormData.password !== userFormData.confirmPassword)
      return toast.error("Passwords do not match.");
    if (userFormData.password.length < 6)
      return toast.error("Password must be at least 6 characters long.");

    const existing = users.find((u) => u.email === userFormData.email);
    if (existing) return toast.error("User with this email already exists.");

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        userFormData.email,
        userFormData.password
      );
      const { uid } = cred.user;

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

      await setDoc(doc(db, "users", uid), newUser);
      setUsers([...users, newUser]);

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

  // Rendered INSIDE the Register page card
  return (
    <form onSubmit={handleCreateUser} className="row g-3" noValidate>
      <div className="col-md-6">
        <label htmlFor="firstName" className="form-label fw-semibold">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          className="form-control"
          value={userFormData.firstName}
          onChange={handleChange}
          required
          autoFocus
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="lastName" className="form-label fw-semibold">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          className="form-control"
          value={userFormData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12">
        <label htmlFor="email" className="form-label fw-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          placeholder="you@company.com"
          value={userFormData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="password" className="form-label fw-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          value={userFormData.password}
          onChange={handleChange}
          minLength={6}
          required
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="confirmPassword" className="form-label fw-semibold">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="form-control"
          value={userFormData.confirmPassword}
          onChange={handleChange}
          minLength={6}
          required
        />
        <div className="form-text">Minimum 6 characters.</div>
      </div>

      <div className="col-12 d-flex justify-content-end gap-2 mt-2">
        <Link to="/login" className="btn btn-outline-secondary">
          Login
        </Link>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Registering…
            </>
          ) : (
            "Register as User"
          )}
        </button>
      </div>
    </form>
  );
};
export default UserRegister;
