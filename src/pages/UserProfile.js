import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const UserProfile = () => {
  const { users, currentUser } = useData();

  if (!Array.isArray(users) || !currentUser) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading user data…</p>
      </div>
    );
  }

  const user = users.find((i) => i.id === currentUser.id);
  if (!user) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger mb-3">User not found.</p>
        <Link to="/events" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            User Profile
          </h1>
          <div className="text-muted">
            Your account information at a glance.
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/profile/edit/${user.id}`} className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: profile card */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                  style={{ width: 72, height: 72 }}
                >
                  <span className="fw-bold fs-4 text-primary">
                    {(
                      (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
                    ).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h2 className="h4 fw-semibold mb-0">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="text-muted">{user.email}</div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="text-muted small">Phone</div>
                  <div className="fw-semibold">{user.phone || "—"}</div>
                </div>
                <div className="col-md-6">
                  <div className="text-muted small">Role</div>
                  <span
                    className={`badge ${
                      user.role === "organizer" ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    {user.role?.[0]?.toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>
                <div className="col-12">
                  <div className="text-muted small">Address</div>
                  <div className="fw-semibold text-break">
                    {[user.address, user.city, user.state, user.country]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: quick actions / links */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem" }}
          >
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-muted mb-3">
                Quick actions
              </h3>
              <div className="d-grid gap-2">
                <Link
                  to={`/profile/edit/${user.id}`}
                  className="btn btn-outline-primary"
                >
                  Edit Profile
                </Link>
                <Link to="/my-bookings" className="btn btn-outline-secondary">
                  View My Bookings
                </Link>
                {user.role === "organizer" && (
                  <Link to="/my-events" className="btn btn-outline-secondary">
                    Manage My Events
                  </Link>
                )}
                <Link to="/events" className="btn btn-outline-secondary">
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /quick actions */}
      </div>
    </div>
  );
};

export default UserProfile;
