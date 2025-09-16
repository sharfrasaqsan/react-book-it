import { Link, NavLink, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function Header() {
  const { currentUser, setCurrentUser } = useData();
  const navigate = useNavigate();
  const isOrganizer = currentUser?.role === "organizer";
  const initials =
    (
      (currentUser?.firstName?.[0] || "") + (currentUser?.lastName?.[0] || "")
    ).toUpperCase() || null;

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

  const linkClass = ({ isActive }) =>
    "nav-link px-3" + (isActive ? " active fw-semibold" : "");

  return (
    <>
      {/* Top bar: brand + quick actions */}
      <nav className="navbar navbar-dark bg-dark sticky-top border-bottom border-secondary-subtle">
        <div className="container">
          <Link
            to="/"
            className="navbar-brand fw-semibold d-flex align-items-center gap-2"
          >
            <i className="bi bi-calendar2-check" />
            <span>Book-It</span>
          </Link>

          {/* Desktop actions */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            {!currentUser ? (
              <>
                <NavLink to="/login" className="btn btn-outline-light btn-sm">
                  Login
                </NavLink>
                <NavLink to="/register" className="btn btn-primary btn-sm">
                  Sign up
                </NavLink>
              </>
            ) : (
              <>
                {isOrganizer && (
                  <NavLink to="/create" className="btn btn-primary btn-sm">
                    + Create Event
                  </NavLink>
                )}

                {/* User dropdown */}
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
                    id="userMenuDesktop"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {initials ? (
                      <span
                        className="rounded-circle bg-light text-dark d-inline-flex justify-content-center align-items-center"
                        style={{ width: 24, height: 24, fontSize: 12 }}
                        aria-hidden="true"
                      >
                        {initials}
                      </span>
                    ) : (
                      <i className="bi bi-person-circle" aria-hidden="true" />
                    )}
                    <span className="d-none d-xl-inline">
                      {currentUser.firstName ?? "Account"}
                    </span>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userMenuDesktop"
                  >
                    <li>
                      <NavLink to="/profile" className="dropdown-item">
                        <i className="bi bi-person me-2" /> Profile
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
                        <i className="bi bi-box-arrow-right me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Mobile: offcanvas toggle */}
          <button
            className="navbar-toggler d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mainNavOffcanvas"
            aria-controls="mainNavOffcanvas"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>

      {/* Secondary bar (desktop nav) */}
      <div className="bg-dark d-none d-lg-block">
        <div className="container">
          <ul className="nav">
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
                      <NavLink to="/my-events" className={linkClass}>
                        My Events
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Offcanvas (mobile) */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="mainNavOffcanvas"
        aria-labelledby="mainNavOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5
            className="offcanvas-title d-flex align-items-center gap-2"
            id="mainNavOffcanvasLabel"
          >
            <i className="bi bi-calendar2-check" />
            Book-It
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <ul className="navbar-nav flex-grow-1">
            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link py-2"
                data-bs-dismiss="offcanvas"
                end
              >
                <i className="bi bi-house me-2" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/events"
                className="nav-link py-2"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-grid me-2" /> All Events
              </NavLink>
            </li>

            {currentUser && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/my-bookings"
                    className="nav-link py-2"
                    data-bs-dismiss="offcanvas"
                  >
                    <i className="bi bi-ticket-detailed me-2" /> My Bookings
                  </NavLink>
                </li>
                {isOrganizer && (
                  <>
                    <li className="nav-item">
                      <NavLink
                        to="/my-events"
                        className="nav-link py-2"
                        data-bs-dismiss="offcanvas"
                      >
                        <i className="bi bi-briefcase me-2" /> My Events
                      </NavLink>
                    </li>
                    <li className="nav-item mt-2">
                      <NavLink
                        to="/create"
                        className="btn btn-primary w-100"
                        data-bs-dismiss="offcanvas"
                      >
                        + Create Event
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* Footer area inside offcanvas */}
          {!currentUser ? (
            <div className="d-grid gap-2">
              <NavLink
                to="/login"
                className="btn btn-outline-dark"
                data-bs-dismiss="offcanvas"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="btn btn-dark"
                data-bs-dismiss="offcanvas"
              >
                Sign up
              </NavLink>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <NavLink
                to="/profile"
                className="btn btn-outline-secondary"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-person me-2" /> Profile
              </NavLink>
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-box-arrow-right me-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
