import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div
          className="rounded-4 p-5 text-white text-center soft-shadow"
          style={{
            background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
          }}
        >
          <h2 className="fw-bold mb-2">Ready to get started?</h2>
          <p className="mb-4 text-white-75">
            Create your free account and publish your first event in minutes.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link
              to="/register"
              className="btn btn-light btn-lg px-4 lift-on-hover"
            >
              Create Account
            </Link>
            <Link
              to="/events"
              className="btn btn-outline-light btn-lg px-4 lift-on-hover"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CTASection;
