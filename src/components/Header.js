// src/components/Header.js
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, setCurrentUser } = useData();
  const navigate = useNavigate();

  const isOrganizer = currentUser?.role === "organizer";

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      toast.success("Logout successful.");
      closeMenu();
      navigate("/");
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return (
    <header className="header navbar navbar-expand-lg navbar-dark bg-dark px-4 py-2">
      <Link to="/" className="navbar-brand fs-3 outline-none">
        Book-It
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
        <ul className="navbar-nav ms-auto gap-3">
          <li className="nav-item">
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/events" className="nav-link" onClick={closeMenu}>
              All Events
            </NavLink>
          </li>

          {currentUser && (
            <>
              <li className="nav-item">
                <NavLink
                  to="/my-bookings"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  My Bookings
                </NavLink>
              </li>

              {isOrganizer && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/create"
                      className="nav-link"
                      onClick={closeMenu}
                    >
                      Create Event
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/my-events"
                      className="nav-link"
                      onClick={closeMenu}
                    >
                      My Events
                    </NavLink>
                  </li>
                </>
              )}
            </>
          )}

          {!currentUser && (
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link" onClick={closeMenu}>
                  Login
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  to="/register"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}

          {currentUser && (
            <>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link" onClick={closeMenu}>
                  <i className="fa fa-user me-1"></i> {currentUser.firstName}
                </NavLink>
              </li>

              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
