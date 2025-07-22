const HowItWorks = () => {
  const steps = [
    {
      title: "Register",
      description:
        "Create your account as an organizer or attendee to get started.",
      icon: "📝",
    },
    {
      title: "Discover & Book",
      description:
        "Find events that interest you or post your own to reach your audience.",
      icon: "🔍",
    },
    {
      title: "Attend & Enjoy",
      description: "Get notifications and enjoy seamless event experiences.",
      icon: "🎉",
    },
  ];

  return (
    <section
      className="bg-light py-5 border-top"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container">
        <h2 id="how-it-works-heading" className="text-center mb-5 fw-bold">
          How It Works
        </h2>
        <div className="row text-center g-4">
          {steps.map(({ title, description, icon }, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="p-4 shadow rounded bg-white h-100 d-flex flex-column align-items-center">
                <div
                  className="display-4 mb-3"
                  role="img"
                  aria-label={title}
                  style={{ color: "#0d6efd" }}
                >
                  {icon}
                </div>
                <h4 className="text-primary mb-3">{`${idx + 1}. ${title}`}</h4>
                <p className="text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
