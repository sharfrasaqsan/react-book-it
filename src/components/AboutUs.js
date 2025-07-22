const AboutSection = () => {
  return (
    <section className="bg-white py-5" aria-labelledby="about-heading">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <img
              src="https://sbims.com/wp-content/uploads/2018/09/Networking-Event.jpg"
              alt="People networking at an event"
              className="img-fluid rounded shadow"
              loading="lazy"
            />
          </div>
          <div className="col-md-6">
            <h2 id="about-heading" className="fw-bold mb-3">
              Why Choose Book-It?
            </h2>
            <p className="text-muted fs-5 mb-4">
              Book-It empowers both organizers and attendees to connect and
              thrive. Whether you're hosting a seminar, concert, or meetup — our
              tools help you succeed with ease.
            </p>
            <ul className="list-unstyled fs-5">
              <li className="mb-2">
                <span
                  role="img"
                  aria-label="Check mark"
                  className="me-2 text-success"
                >
                  ✅
                </span>
                Hassle-free event creation
              </li>
              <li className="mb-2">
                <span
                  role="img"
                  aria-label="Check mark"
                  className="me-2 text-success"
                >
                  ✅
                </span>
                Instant attendee bookings
              </li>
              <li>
                <span
                  role="img"
                  aria-label="Check mark"
                  className="me-2 text-success"
                >
                  ✅
                </span>
                Mobile-optimized experience
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
