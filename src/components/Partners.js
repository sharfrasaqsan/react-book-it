const Partners = () => {
  const partners = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
      alt: "React",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
      alt: "Node.js",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
      alt: "TypeScript",
    },
    {
      src: "https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next.svg",
      alt: "Next.js",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
      alt: "Bootstrap",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
      alt: "JavaScript",
    },
    {
      src: "https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
      alt: "MongoDB",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
      alt: "SQL",
    },
  ];

  return (
    <section className="bg-white py-5 border-top">
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
                e.currentTarget.style.filter = "grayscale(0%)";
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
