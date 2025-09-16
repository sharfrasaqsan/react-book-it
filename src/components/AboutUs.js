const AboutSection = () => {
  const points = [
    "Lightning-fast booking with real-time status",
    "Organizer tools that feel effortless",
    "A clean, accessible interface on every device",
  ];
  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-lg-2">
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden soft-shadow">
              <img
                src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1600&auto=format&fit=crop"
                alt="Vibrant audience in a modern venue"
                className="w-100 h-100 object-fit-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="col-lg-6">
            <span className="eyebrow mb-2">About Book-It</span>
            <h2 className="fw-bold mb-3">Built for events that people love</h2>
            <p className="text-muted fs-5 mb-4">
              We obsess over a frictionless flow — discover, evaluate, book, and
              attend. It just feels… right.
            </p>
            <ul className="list-unstyled mb-4">
              {points.map((t, i) => (
                <li key={i} className="d-flex align-items-start mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2 mt-1" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex gap-2">
              <a href="#recent" className="btn btn-primary lift-on-hover">
                Browse latest
              </a>
              <a
                href="#newsletter"
                className="btn btn-outline-secondary lift-on-hover"
              >
                Stay updated
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
