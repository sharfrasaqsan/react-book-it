import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    // Simulate API call or subscription
    setStatus("success");
    setMessage("Thank you for subscribing!");
    setEmail(""); // Clear input
  };

  return (
    <section className="py-5 bg-light border-top">
      <div className="container text-center">
        <h2 className="fw-bold mb-3">Stay Updated</h2>
        <p className="text-muted mb-4">
          Subscribe to get the latest events and news in your inbox.
        </p>
        <form
          className="d-flex justify-content-center gap-2 flex-wrap"
          onSubmit={handleSubmit}
          noValidate
        >
          <label htmlFor="newsletter-email" className="visually-hidden">
            Email address
          </label>
          <input
            type="email"
            id="newsletter-email"
            className="form-control w-auto"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="newsletter-feedback"
          />
          <button type="submit" className="btn btn-primary" aria-live="polite">
            Subscribe
          </button>
        </form>
        {message && (
          <div
            id="newsletter-feedback"
            className={`mt-3 ${
              status === "success" ? "text-success" : "text-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
