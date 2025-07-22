const Testimonials = () => {
  const testimonials = [
    {
      text: "Super easy to use and packed with amazing events!",
      author: "Ayesha",
      role: "Attendee",
    },
    {
      text: "Book-It helped me manage my event like a professional.",
      author: "Malik",
      role: "Organizer",
    },
    {
      text: "Love the clean UI and how easy it is to book.",
      author: "Shanil",
      role: "Attendee",
    },
  ];

  return (
    <section
      className="py-5 bg-white border-top"
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        <h2 id="testimonials-heading" className="text-center mb-5 fw-bold">
          What Our Users Say
        </h2>
        <div className="row text-center g-4">
          {testimonials.map(({ text, author, role }, index) => (
            <blockquote
              key={index}
              className="col-md-4 testimonial-card p-4 shadow rounded bg-light position-relative"
              style={{ minHeight: "180px" }}
            >
              <p className="fst-italic mb-4" style={{ fontSize: "1.1rem" }}>
                &ldquo;{text}&rdquo;
              </p>
              <footer className="blockquote-footer text-muted">
                {author}, <cite title="User Role">{role}</cite>
              </footer>
              {/* Decorative quote icon */}
              <span
                className="position-absolute"
                style={{
                  top: "1rem",
                  right: "1rem",
                  fontSize: "2.5rem",
                  color: "#0d6efd",
                  opacity: 0.15,
                }}
                aria-hidden="true"
              >
                &ldquo;
              </span>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
