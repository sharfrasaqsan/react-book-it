// src/components/Header.js
import { useState } from "react";
import "../styles/Header.css";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/">Book-It</Link>
      </h1>

      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
          </li>

          <>
            <li>
              <Link to="/my-bookings">My Bookings</Link>
            </li>
            <li>
              <Link to="/create">Create Events</Link>
            </li>
          </>

          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
