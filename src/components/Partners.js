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
      src: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg",
      alt: "Bootstrap",
    },
    {
      src: "https://raw.githubusercontent.com/vercel/vercel/main/packages/frameworks/logos/next.svg",
      alt: "Next.js",
    },
  ];
  return (
    <section className="py-5 bg-white border-top">
      <div className="container">
        <p className="text-center text-muted mb-4">
          Trusted by teams building with
        </p>
        <div className="d-flex justify-content-center flex-wrap gap-4 align-items-center">
          {partners.map(({ src, alt }, i) => (
            <img
              key={i}
              src={src}
              alt={alt}
              height={44}
              className="partner-logo"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Partners;
