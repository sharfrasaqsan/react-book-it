// src/components/Footer.js
import { Link } from "react-router-dom";

// Ensure global imports (index.js):
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* Company Info */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-semibold">Book-It</h5>
            <p className="small mb-0">
              Your go-to app for event booking. Join, organize, and explore
              amazing events easily.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-md-4 mb-3">
            <h6 className="text-uppercase">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <Link to="/about" className="text-light text-decoration-none">
                  About
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/contact" className="text-light text-decoration-none">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-light text-decoration-none">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 mb-3">
            <h6 className="text-uppercase">Follow Us</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <Link to="#" className="text-light" aria-label="Facebook">
                <i className="bi bi-facebook fs-5" />
              </Link>
              <Link to="#" className="text-light" aria-label="X">
                <i className="bi bi-twitter-x fs-5" />
              </Link>
              <Link to="#" className="text-light" aria-label="Instagram">
                <i className="bi bi-instagram fs-5" />
              </Link>
              <Link to="#" className="text-light" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5" />
              </Link>
            </div>
          </div>
        </div>

        <hr className="border-light" />
        <div className="text-center small">
          &copy; {new Date().getFullYear()} Book-It. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
