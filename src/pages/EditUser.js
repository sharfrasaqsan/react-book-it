import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useParams } from "react-router-dom";
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

  const user = users.find((i) => i.id === id);

  useEffect(() => {
    if (user) {
      setEditUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        password: "", // start empty, optional to change
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
      });
    }
  }, [user, setEditUserFormData]);

  if (!users.length || !user)
    return <p className="text-center mt-5">User not found.</p>;
  if (!editUserFormData)
    return <p className="text-center mt-5">Loading user data...</p>;

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

    // Password change is optional
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
      // Separate password from other fields
      const { password, ...userData } = editUserFormData;

      // Update Firestore user document (excluding password)
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, userData);

      // If password entered, update it securely via Firebase Auth
      if (password) {
        // Get current Firebase Auth user
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
          await updatePassword(currentUser, password);
          toast.success("Password updated successfully.");
        } else {
          toast.warning(
            "Password update skipped: you must be logged in as this user."
          );
        }
      }

      // Update local users list state
      const newUsersList = users.map((i) =>
        i.id === userId ? { ...i, ...userData } : i
      );
      setUsers(newUsersList);

      toast.success("User updated successfully.");
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to update user. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Edit Profile</h2>
      <div className="card shadow border-0 p-4 mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser(user.id);
          }}
        >
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control mb-3"
            name="firstName"
            value={editUserFormData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control mb-3"
            name="lastName"
            value={editUserFormData.lastName}
            onChange={handleChange}
            required
          />

          <label htmlFor="password" className="form-label">
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            value={editUserFormData.password}
            onChange={handleChange}
            placeholder="New password (optional)"
          />

          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="tel"
            className="form-control mb-3"
            name="phone"
            value={editUserFormData.phone}
            onChange={handleChange}
          />

          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control mb-3"
            name="address"
            value={editUserFormData.address}
            onChange={handleChange}
          />

          <label htmlFor="city" className="form-label">
            City
          </label>
          <input
            type="text"
            className="form-control mb-3"
            name="city"
            value={editUserFormData.city}
            onChange={handleChange}
          />

          <label htmlFor="state" className="form-label">
            State/Province
          </label>
          <input
            type="text"
            className="form-control mb-3"
            name="state"
            value={editUserFormData.state}
            onChange={handleChange}
          />

          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            className="form-control mb-3"
            name="country"
            value={editUserFormData.country}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary w-100 mb-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
