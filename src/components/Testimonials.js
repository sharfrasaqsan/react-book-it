const Testimonials = () => {
  const items = [
    {
      text: "Super easy to use and packed with amazing events!",
      author: "Ayesha",
      role: "Attendee",
    },
    {
      text: "Book-It helped me manage my event like a pro.",
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
    <section className="py-5 position-relative">
      <div className="container">
        <div className="text-center mb-5">
          <span className="eyebrow">Social proof</span>
          <h2 className="fw-bold mt-1">What our users say</h2>
        </div>

        <div className="row g-4">
          {items.map((t, i) => (
            <div className="col-md-4" key={i}>
              <figure className="glass rounded-4 p-4 h-100 soft-shadow hover-outline">
                <div className="display-5 text-primary mb-2" aria-hidden="true">
                  “
                </div>
                <blockquote className="blockquote mb-3">
                  <p className="mb-0">{t.text}</p>
                </blockquote>
                <figcaption className="blockquote-footer mb-0">
                  {t.author} <span className="text-muted">— {t.role}</span>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
