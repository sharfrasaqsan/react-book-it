const Partners = () => {
  const partners = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png",
      alt: "Apple",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
      alt: "Microsoft",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Google_Logo.svg",
      alt: "Google",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/LinkedIn_logo_initials.png",
      alt: "LinkedIn",
    },
  ];

  return (
    <section className="bg-light py-5 border-top">
      <div className="container text-center">
        <h5 className="fw-bold mb-5 text-secondary">Trusted By</h5>
        <div className="d-flex justify-content-center flex-wrap gap-5 align-items-center">
          {partners.map(({ src, alt }, index) => (
            <img
              key={index}
              src={src}
              alt={alt}
              height={50}
              className="partner-logo mx-3 my-2"
              style={{
                filter: "grayscale(70%)",
                transition: "filter 0.3s ease, transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "grayscale(0%)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "grayscale(70%)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
