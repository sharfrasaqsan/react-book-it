import { Navigate } from "react-router-dom";
import { useData } from "../context/DataContext";

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useData();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
