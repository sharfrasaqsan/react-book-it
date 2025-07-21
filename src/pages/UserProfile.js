import { useData } from "../context/DataContext";

const UserProfile = () => {
  const { users, currentUser } = useData();

  if (!users.length || !currentUser) return <p>Loading user data...</p>;

  const user = users.find((i) => i.id === currentUser.id);

  if (!user) return <p>User not found.</p>;

  return (
    <div className="container mt-2">
      <h2 className="mb-4 text-center">User Profile</h2>
      <div className="card p-4 shadow-sm">
        <p>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>City:</strong> {user.city}
        </p>
        <p>
          <strong>State or Province:</strong> {user.state}
        </p>
        <p>
          <strong>Country:</strong> {user.country}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          <span
            className={`badge ${
              user.role === "organizer" ? "bg-primary" : "bg-secondary"
            }`}
          >
            {user.role}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
