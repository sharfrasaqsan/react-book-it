import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { toast } from "react-toastify";
import { confirmDialog } from "../utils/confirmDialog";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { updatePassword } from "firebase/auth";

const EditUser = () => {
  const { editUserFormData, setEditUserFormData, users, setUsers, navigate } =
    useData();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const user = Array.isArray(users) ? users.find((i) => i.id === id) : null;

  useEffect(() => {
    if (user) {
      setEditUserFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        password: "", // optional change
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  }, [user, setEditUserFormData]);

  const handleChange = (e) => {
    setEditUserFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateUser = async (userId) => {
    if (!editUserFormData.firstName || !editUserFormData.lastName) {
      return toast.error("Please enter both first name and last name.");
    }
    if (editUserFormData.password && editUserFormData.password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    const confirm = await confirmDialog({
      title: "Update Profile",
      text: "Are you sure you want to update your profile?",
    });
    if (!confirm) {
      toast.warning("User update canceled.");
      navigate("/profile");
      return;
    }

    setLoading(true);
    try {
      const { password, ...userData } = editUserFormData;

      // Update Firestore doc (no password)
      await updateDoc(doc(db, "users", userId), userData);

      // Optional password via Firebase Auth
      if (password) {
        const current = auth.currentUser;
        if (current && current.uid === userId) {
          await updatePassword(current, password);
          toast.success("Password updated successfully.");
        } else {
          toast.warning(
            "Password update skipped: you must be logged in as this user."
          );
        }
      }

      // Update local users state
      const next = users.map((u) =>
        u.id === userId ? { ...u, ...userData } : u
      );
      setUsers(next);

      toast.success("User updated successfully.");
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to update user. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Right-column snapshot
  const fullName = useMemo(
    () =>
      `${editUserFormData.firstName || ""} ${
        editUserFormData.lastName || ""
      }`.trim() || "—",
    [editUserFormData.firstName, editUserFormData.lastName]
  );

  if (!Array.isArray(users) || users.length === 0)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading user…</p>
      </div>
    );

  if (!user)
    return (
      <div className="container py-5 text-center">
        <p className="mb-3">User not found.</p>
        <Link to="/profile" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Profile
        </Link>
      </div>
    );

  if (!editUserFormData)
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading form…</p>
      </div>
    );

  return (
    <div className="container py-5">
      {/* Breadcrumbs + header */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/profile">Profile</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            Edit Profile
          </h1>
          <div className="text-muted">
            Update your personal information and password.
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/profile" className="btn btn-outline-secondary">
            &larr; Back to Profile
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: form */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="border-start border-4 border-primary ps-3 mb-3">
                <h2 className="h4 fw-semibold mb-0">Account details</h2>
              </div>

              <form
                className="row g-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateUser(user.id);
                }}
                noValidate
              >
                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    value={editUserFormData.firstName}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    value={editUserFormData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold" htmlFor="password">
                    Password{" "}
                    <span className="text-muted fw-normal">
                      (leave blank to keep current)
                    </span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={editUserFormData.password}
                    onChange={handleChange}
                    placeholder="New password (optional)"
                  />
                  <div className="form-text">Minimum 6 characters.</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={editUserFormData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold" htmlFor="address">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    className="form-control"
                    value={editUserFormData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" htmlFor="city">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    className="form-control"
                    value={editUserFormData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" htmlFor="state">
                    State/Province
                  </label>
                  <input
                    id="state"
                    name="state"
                    className="form-control"
                    value={editUserFormData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold" htmlFor="country">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    className="form-control"
                    value={editUserFormData.country}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <Link to="/profile" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving…
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right: sticky summary */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem" }}
          >
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-muted mb-3">
                Profile snapshot
              </h3>

              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                  style={{ width: 56, height: 56 }}
                >
                  <span className="fw-bold text-primary">
                    {(
                      (editUserFormData.firstName?.[0] || "") +
                      (editUserFormData.lastName?.[0] || "")
                    ).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <div className="fw-semibold">{fullName}</div>
                  <div className="text-muted small">{user.email || "—"}</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-muted small">Phone</div>
                <div className="fw-semibold text-break">
                  {editUserFormData.phone || "—"}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-muted small">Address</div>
                <div className="fw-semibold text-break">
                  {[
                    editUserFormData.address,
                    editUserFormData.city,
                    editUserFormData.state,
                    editUserFormData.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </div>
              </div>

              <hr className="my-4" />
              <div className="d-grid gap-2">
                <Link to="/profile" className="btn btn-outline-secondary">
                  &larr; Back to Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /sticky summary */}
      </div>
    </div>
  );
};

export default EditUser;
