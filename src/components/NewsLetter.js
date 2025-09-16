import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setStatus(ok ? "ok" : "err");
    if (ok) setEmail("");
  };

  return (
    <section id="newsletter" className="py-5 bg-body-tertiary border-top">
      <div className="container text-center">
        <span className="eyebrow">Subscribe</span>
        <h2 className="fw-bold mt-1 mb-3">Stay in the loop</h2>
        <p className="text-muted mb-4">
          Get the freshest events and updates in your inbox.
        </p>

        <form
          onSubmit={submit}
          className="d-flex gap-2 justify-content-center flex-wrap glass rounded-pill p-2 soft-shadow"
        >
          <label htmlFor="nl" className="visually-hidden">
            Email
          </label>
          <input
            id="nl"
            type="email"
            className="form-control bg-transparent border-0"
            style={{ minWidth: 260 }}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-primary rounded-pill px-4 lift-on-hover">
            Subscribe
          </button>
        </form>

        {status === "ok" && (
          <div className="text-success mt-3">Thanks for subscribing!</div>
        )}
        {status === "err" && (
          <div className="text-danger mt-3">Please enter a valid email.</div>
        )}
      </div>
    </section>
  );
};
export default Newsletter;
