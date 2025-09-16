import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const OrganizerRegister = () => {
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
    if (userFormData.password.length < 8)
      return toast.error("Password must be at least 8 characters long.");

    const duplicate = users.find(
      (u) => u.email === userFormData.email && u.role === "organizer"
    );
    if (duplicate)
      return toast.error("Organizer with this email already exists.");

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
        role: "organizer",
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

      toast.success("Organizer account created.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create user. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // NOTE: This component is rendered INSIDE a card by Register.js; no extra container here.
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
          value={userFormData.email}
          onChange={handleChange}
          placeholder="you@company.com"
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
          minLength={8}
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
          minLength={8}
          required
        />
        <div className="form-text">Minimum 8 characters.</div>
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
            "Register as Organizer"
          )}
        </button>
      </div>
    </form>
  );
};
export default OrganizerRegister;
