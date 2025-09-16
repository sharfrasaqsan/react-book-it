// src/components/Header.js
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Header() {
  const { currentUser, setCurrentUser } = useData();
  const navigate = useNavigate();
  const isOrganizer = currentUser?.role === "organizer";

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success("Logout successful.");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-semibold">
          Book-It
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className={linkClass} end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/events" className={linkClass}>
                All Events
              </NavLink>
            </li>

            {currentUser && (
              <>
                <li className="nav-item">
                  <NavLink to="/my-bookings" className={linkClass}>
                    My Bookings
                  </NavLink>
                </li>
                {isOrganizer && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/create" className={linkClass}>
                        Create Event
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/my-events" className={linkClass}>
                        My Events
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!currentUser ? (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={linkClass}>
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className={linkClass}>
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link d-flex align-items-center gap-2"
                  id="userMenu"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i>
                  <span>{currentUser.firstName ?? "Account"}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userMenu"
                >
                  <li>
                    <NavLink to="/profile" className="dropdown-item">
                      <i className="bi bi-person me-2"></i> Profile
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
