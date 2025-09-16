const HowItWorks = () => {
  const steps = [
    {
      icon: "bi-person-plus",
      title: "Create your account",
      desc: "Join as an attendee or organizer — it’s free.",
    },
    {
      icon: "bi-search-heart",
      title: "Discover & book",
      desc: "Filter by date, category, and location in seconds.",
    },
    {
      icon: "bi-emoji-smile",
      title: "Enjoy the event",
      desc: "Get reminders, add to calendar, share with friends.",
    },
  ];

  return (
    <section className="py-5 bg-body-tertiary border-top">
      <div className="container">
        <div className="text-center mb-5">
          <span className="eyebrow">How it works</span>
          <h2 className="fw-bold mt-1">From idea to unforgettable</h2>
        </div>

        <div className="row g-4">
          {steps.map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="card h-100 rounded-4 border-0 soft-shadow hover-outline animate-stagger">
                <div className="card-body p-4 p-lg-5 text-center">
                  <div className="icon-xxl text-primary mb-3">
                    <i className={`bi ${s.icon}`} />
                  </div>
                  <h3 className="h5 fw-semibold mb-2">{s.title}</h3>
                  <p className="text-muted mb-0">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;
