import { useEffect } from "react";
import { useData } from "../context/DataContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import request from "../api/request";
import { confirmDialog } from "../utils/confirmDialog";

const EditUser = () => {
  const { editUserFormData, setEditUserFormData, users, setUsers, navigate } =
    useData();

  const { id } = useParams();

  const user = users.find((i) => i.id === id);

  useEffect(() => {
    if (user) {
      setEditUserFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        country: user.country,
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

    if (editUserFormData.password.length < 6) {
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

    try {
      const updatedUser = {
        ...editUserFormData,
      };
      const res = await request.patch(`/users/${userId}`, updatedUser);
      const newUsersList = users.map((i) => (i.id === userId ? res.data : i));
      setUsers(newUsersList);
      toast.success("User updated successfully.");
      navigate("/profile");
    } catch (err) {
      toast.error("Failed to update user. " + err.message);
    }
  };

  return (
    <div className="container mt-5">
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
            Password
          </label>
          <input
            type="password"
            className="form-control mb-3"
            name="password"
            value={editUserFormData.password}
            onChange={handleChange}
            required
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

          <button type="submit" className="btn btn-primary w-100 mb-2">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
