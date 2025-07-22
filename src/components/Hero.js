import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="hero-section d-flex justify-content-center align-items-center text-white"
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
        padding: "0",
      }}
    >
      <div className="container text-center">
        <h1 className="display-2 fw-bold mb-3">Discover. Book. Enjoy.</h1>
        <p
          className="lead mb-4"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          Your ultimate platform to find, manage, and enjoy amazing events —
          whether you're an organizer or an attendee.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/events" className="btn btn-light btn-lg px-5 shadow">
            Explore Events
          </Link>
          <Link
            to="/register"
            className="btn btn-outline-light btn-lg px-5 shadow"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
