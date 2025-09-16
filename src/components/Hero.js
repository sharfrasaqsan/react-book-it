import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="position-relative overflow-hidden text-white"
      style={{
        minHeight: "80vh",
        background:
          "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,.55), transparent 60%), radial-gradient(1000px 500px at 90% 20%, rgba(59,130,246,.45), transparent 55%), linear-gradient(135deg, #0b1220 0%, #0b1b33 100%)",
      }}
    >
      {/* floating blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="container position-relative py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <h1 className="display-4 fw-bold mb-3 gradient-text">
              Discover. Book. Enjoy.
            </h1>
            <p className="lead text-white-50 mb-4" style={{ maxWidth: 700 }}>
              A smarter way to find, manage, and experience events — from cozy
              meetups to global conferences.
            </p>

            {/* Glass search bar */}
            <div className="glass rounded-4 p-2 p-md-3 mb-4 soft-shadow">
              <div className="d-flex gap-2 flex-wrap">
                <input
                  className="form-control form-control-lg flex-grow-1 bg-transparent border-0 text-white"
                  placeholder="Search events (title, location, etc.)"
                />
                <Link
                  to="/events"
                  className="btn btn-primary btn-lg px-4 lift-on-hover"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="d-flex flex-wrap gap-4 mt-3">
              {[
                ["2,500+", "Active users"],
                ["800+", "Upcoming events"],
                ["4.9★", "Average rating"],
              ].map(([big, small], i) => (
                <div key={i} className="text-white-50">
                  <div className="fs-3 fw-bold text-white">{big}</div>
                  <div className="small">{small}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            {/* Showcase card */}
            <div className="glass rounded-4 p-4 soft-shadow animate-pop">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="h5 mb-0">Featured Event</h3>
                <span className="badge bg-success">Happening soon</span>
              </div>
              <p className="text-white-50 mb-3">
                Tech Leaders Summit — insights from top founders, investors and
                engineers. Learn the latest strategies shaping the next decade.
              </p>
              <div className="d-flex flex-wrap gap-3 text-white-50 small mb-4">
                <span>
                  <i className="bi bi-calendar-event me-1"></i> Oct 22
                </span>
                <span>
                  <i className="bi bi-clock me-1"></i> 09:00
                </span>
                <span className="text-truncate">
                  <i className="bi bi-geo-alt me-1"></i> Colombo
                </span>
              </div>
              <div className="d-flex gap-2">
                <Link
                  to="/events"
                  className="btn btn-outline-light lift-on-hover"
                >
                  See all events
                </Link>
                <Link to="/register" className="btn btn-primary lift-on-hover">
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
