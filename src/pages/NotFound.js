import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="mb-4">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link to="/">
        <button className="btn btn-primary d-flex align-items-center justify-content-center mx-auto">
          <FaHome className="me-2" />
          Go Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
