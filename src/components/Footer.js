import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto pt-4">
      <div className="container">
        <div className="row g-4">
          {/* Brand + blurb */}
          <div className="col-12 col-md-6 col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-calendar2-check fs-5" aria-hidden="true" />
              <h5 className="fw-semibold mb-0">Book-It</h5>
            </div>
            <p className="small text-white-50 mb-3">
              Discover, book, and enjoy events with a clean, mobile-first
              experience.
            </p>
            {/* Socials */}
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50" aria-label="Facebook">
                <i className="bi bi-facebook fs-5" />
              </a>
              <a href="#" className="text-white-50" aria-label="X">
                <i className="bi bi-twitter-x fs-5" />
              </a>
              <a href="#" className="text-white-50" aria-label="Instagram">
                <i className="bi bi-instagram fs-5" />
              </a>
              <a href="#" className="text-white-50" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="col-6 col-lg-2">
            <h6 className="text-uppercase small text-white-50">Product</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <Link to="/events" className="link-light text-decoration-none">
                  All Events
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  to="/register"
                  className="link-light text-decoration-none"
                >
                  Create account
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/profile" className="link-light text-decoration-none">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-6 col-lg-2">
            <h6 className="text-uppercase small text-white-50">Company</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <Link to="/about" className="link-light text-decoration-none">
                  About
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/contact" className="link-light text-decoration-none">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="link-light text-decoration-none">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Mini newsletter (mobile-friendly) */}
          <div className="col-12 col-lg-4">
            <h6 className="text-uppercase small text-white-50">
              Stay in the loop
            </h6>
            <form
              className="d-flex gap-2 flex-wrap"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.querySelector("input[type=email]");
                if (!input?.value) return;
                // You can wire this to your real newsletter logic
                input.value = "";
                alert("Thanks for subscribing!");
              }}
            >
              <label htmlFor="footer-email" className="visually-hidden">
                Email
              </label>
              <input
                id="footer-email"
                type="email"
                className="form-control bg-dark text-light border-secondary"
                placeholder="you@company.com"
                required
              />
              <button className="btn btn-outline-light">Subscribe</button>
            </form>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between pb-3 gap-2">
          <div className="small text-white-50">
            &copy; {year} Book-It. All rights reserved.
          </div>
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <i className="bi bi-arrow-up-short me-1" /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
