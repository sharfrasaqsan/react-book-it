import { useState } from "react";
import OrganizerRegister from "../components/OrganizerRegister";
import UserRegister from "../components/UserRegister";

const Register = () => {
  const [role, setRole] = useState("user");

  return (
    <div className="container mt-4" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Register</h2>
      <div className="row text-center mb-4">
        <div className="col">
          <div
            className={`card p-3 ${role === "user" ? "border-primary" : ""}`}
            onClick={() => setRole("user")}
            style={{ cursor: "pointer" }}
          >
            <h5>Attendee</h5>
            <p>Book and attend events</p>
          </div>
        </div>
        <div className="col">
          <div
            className={`card p-3 ${
              role === "organizer" ? "border-primary" : ""
            }`}
            onClick={() => setRole("organizer")}
            style={{ cursor: "pointer" }}
          >
            <h5>Organizer</h5>
            <p>Create and manage events</p>
          </div>
        </div>
      </div>

      {role === "user" && <UserRegister />}
      {role === "organizer" && <OrganizerRegister />}
    </div>
  );
};

export default Register;
