import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const UserProfile = () => {
  const { users, currentUser } = useData();

  if (!users.length || !currentUser)
    return <p className="text-center mt-5">Loading user data...</p>;

  const user = users.find((i) => i.id === currentUser.id);

  if (!user)
    return <p className="text-center text-danger mt-5">User not found.</p>;

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">User Profile</h2>
      <div className="card shadow border-0 p-4">
        <div className="mb-3">
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </div>
        <div className="mb-3">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="mb-3">
          <strong>Phone:</strong> {user.phone}
        </div>
        <div className="mb-3">
          <strong>Address:</strong> {user.address}
        </div>
        <div className="mb-3">
          <strong>City:</strong> {user.city}
        </div>
        <div className="mb-3">
          <strong>State/Province:</strong> {user.state}
        </div>
        <div className="mb-3">
          <strong>Country:</strong> {user.country}
        </div>
        <div className="mb-4">
          <strong>Role:</strong>{" "}
          <span
            className={`badge ${
              user.role === "organizer" ? "bg-primary" : "bg-secondary"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>

        <Link
          to={`/profile/edit/${user.id}`}
          className="btn btn-outline-primary w-100"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
