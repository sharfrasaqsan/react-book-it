import { toast } from "react-toastify";
import { useData } from "../context/DataContext";
import request from "../api/request";

const Login = () => {
  const { users, userFormData, setUserFormData, navigate } = useData();

  if (userFormData.length === 0) {
    return <p>Loading user data...</p>;
  }

  const handleChange = (e) => {
    setUserFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userFormData.email || !userFormData.password)
      return toast.error("Please fill in all the fields.");

    if (userFormData.password.length < 6)
      return toast.error("Password must be at least 6 characters long.");

    const user = users.find(
      (i) =>
        i.email === userFormData.email && i.password === userFormData.password
    );

    if (!user) {
      return toast.error("Invalid email or password.");
    }

    try {
      const res = await request.get("/users", {
        params: {
          email: userFormData.email,
          password: userFormData.password,
        },
      });
      if (!res.data) {
        toast.error("User not found.");
      }
      setUserFormData({
        email: "",
        password: "",
      });
      toast.success("Login successful.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to login. " + err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
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
            value={userFormData.email}
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
            value={userFormData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
