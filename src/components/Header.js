// src/components/Header.js
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useData } from "../context/DataContext";
import "../styles/Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useData();
  const isOrganizer = currentUser?.role === "organizer";

  const toggleMenu = () => setMenuOpen(!menuOpen);

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
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>

          {currentUser && (
            <>
              <li className="nav-item">
                <NavLink to="/my-bookings" className="nav-link">
                  My Bookings
                </NavLink>
              </li>

              {isOrganizer && (
                <li className="nav-item">
                  <NavLink to="/create" className="nav-link">
                    Create Event
                  </NavLink>
                </li>
              )}
            </>
          )}

          {/* {!currentUser && ( */}
            <>
              <li className="nav-item">
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </li>
            </>
          {/* )} */}

          {currentUser && (
            <>
              <li className="nav-item">
                <NavLink to="/profile" className="nav-link">
                  <i className="fa fa-user"></i> {currentUser.firstName}
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
