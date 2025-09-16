import { useState } from "react";
import OrganizerRegister from "../components/OrganizerRegister";
import UserRegister from "../components/UserRegister";
import { Link } from "react-router-dom";

const Register = () => {
  const [role, setRole] = useState("user");

  return (
    <div className="container py-5">
      {/* Breadcrumbs + header */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/events">Events</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Register
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            Create your account
          </h1>
          <div className="text-muted">
            Choose your role and complete the form to get started.
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-secondary">
            I already have an account
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: role selection + form */}
        <div className="col-lg-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body p-4 p-md-5">
              <div className="border-start border-4 border-primary ps-3 mb-3">
                <h2 className="h4 fw-semibold mb-0">Choose your role</h2>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <button
                    type="button"
                    className={`btn w-100 text-start p-3 border ${
                      role === "user" ? "border-primary" : "border-200"
                    }`}
                    onClick={() => setRole("user")}
                  >
                    <div className="fw-semibold">Attendee</div>
                    <div className="small text-muted">
                      Book and attend events
                    </div>
                  </button>
                </div>

                <div className="col-md-6">
                  <button
                    type="button"
                    className={`btn w-100 text-start p-3 border ${
                      role === "organizer" ? "border-primary" : "border-200"
                    }`}
                    onClick={() => setRole("organizer")}
                  >
                    <div className="fw-semibold">Organizer</div>
                    <div className="small text-muted">
                      Create and manage events
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic form */}
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="border-start border-4 border-primary ps-3 mb-3">
                <h2 className="h5 fw-semibold mb-0">
                  {role === "user" ? "Attendee details" : "Organizer details"}
                </h2>
              </div>

              {role === "user" && <UserRegister />}
              {role === "organizer" && <OrganizerRegister />}
            </div>
          </div>
        </div>

        {/* Right: help (sticky) */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem" }}
          >
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-muted mb-3">
                Before you begin
              </h3>
              <ul className="small text-muted mb-3">
                <li>Use a valid email — you’ll use it to sign in.</li>
                <li>Passwords must be at least 6 characters.</li>
                <li>
                  You can switch roles later by registering a new account.
                </li>
              </ul>

              <div className="d-grid gap-2">
                <Link to="/login" className="btn btn-outline-secondary">
                  Already registered? Login
                </Link>
                <Link to="/events" className="btn btn-outline-secondary">
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Right */}
      </div>
    </div>
  );
};

export default Register;
