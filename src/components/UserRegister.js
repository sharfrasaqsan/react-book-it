import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import request from "../api/request";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const UserRegister = () => {
  const { users, setUsers, userFormData, setUserFormData, navigate } =
    useData();

  const handleChange = (e) => {
    setUserFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    console.log(userFormData);
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

    const existingUser = users.find(
      (user) => user.email === userFormData.email && user.role === "user"
    );
    if (existingUser) {
      return toast.error("User with this email already exists. Please login.");
    }

    if (userFormData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    try {
      const newUser = {
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        email: userFormData.email,
        password: userFormData.password,
        role: "user",
        phone: userFormData.phone,
        address: userFormData.address,
        city: userFormData.city,
        state: userFormData.state,
        country: userFormData.country,
        createdAt: format(new Date(), "yyyy-MM-dd h:mm:ss a"),
        updatedAt: null,
        bookedEvents: [],
      };
      console.log(newUser);

      const res = await request.post("/users", newUser);
      const newUsers = [...users, res.data];
      setUsers(newUsers);
      console.log("Response" + res.data);
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
      navigate("/login");
    } catch (err) {
      toast.error("Failed to create user. " + err.message);
    }
  };

  return (
    <div className="container mt-2" style={{ maxWidth: "400px" }}>
      <h4 className="mb-4 text-center">User Registration</h4>
      <form onSubmit={handleCreateUser}>
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
          <span className="form-text">
            * Password must be at least 6 characters
          </span>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Register as User
        </button>

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
