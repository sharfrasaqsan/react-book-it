import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section
      className="py-5 text-center text-white"
      style={{
        background: "linear-gradient(135deg, #4085c9ff 0%, #071f36ff 100%)",
      }}
    >
      <div className="container px-3 px-md-5">
        <h2 className="fw-bold mb-3">Ready to get started?</h2>
        <p className="mb-4 fs-5">
          Join thousands of users who organize and book events with ease.
        </p>
        <Link
          to="/register"
          className="btn btn-lg btn-outline-light px-4"
          role="button"
          aria-label="Create your account"
          style={{
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
            e.currentTarget.style.color = "#343a40";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#f8f9fa";
          }}
        >
          Create Your Account
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
