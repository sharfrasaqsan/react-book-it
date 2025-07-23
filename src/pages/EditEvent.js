import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { confirmDialog } from "../utils/confirmDialog";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const EditEvent = () => {
  const { events, setEvents, editFormData, setEditFormData, navigate } =
    useData();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const event = events.find((i) => i.id === id);

  useEffect(() => {
    if (event) {
      setEditFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        capacity: event.capacity,
      });
    }
  }, [event, setEditFormData]);

  if (!event && events.length === 0) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  const handleUpdateEvent = async (id) => {
    if (
      !editFormData.title ||
      !editFormData.description ||
      !editFormData.location ||
      !editFormData.capacity
    ) {
      return toast.error("Please fill in all the fields.");
    }

    if (!editFormData.date || !editFormData.time) {
      return toast.error("Please select both date and time.");
    }

    const eventDateTimeString = `${editFormData.date}T${editFormData.time}`;
    const eventDateTime = new Date(eventDateTimeString);
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }

    const now = new Date();
    if (eventDateTime < now) {
      return toast.error("Event date and time must be in the future.");
    }

    if (Number(editFormData.capacity) <= 0) {
      return toast.error("Capacity must be greater than 0.");
    }

    const confirm = await confirmDialog({
      title: "Update the event",
      text: "Are you sure you want to update this event?",
    });

    if (!confirm) {
      toast.warning("Event update canceled.");
      navigate(`/event/${id}`);
      return;
    }

    setLoading(true);

    try {
      const updatedEvent = {
        title: editFormData.title,
        description: editFormData.description,
        date: editFormData.date,
        time: editFormData.time,
        capacity: Number(editFormData.capacity),
        location: editFormData.location,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss a"),
      };

      await updateDoc(doc(db, "events", id), updatedEvent);

      // Update local state
      const updatedEvents = events.map((i) =>
        i.id === id ? { ...i, ...updatedEvent } : i
      );
      setEvents(updatedEvents);

      toast.success("Event updated successfully.");
      navigate(`/event/${id}`);
    } catch (err) {
      toast.error("Failed to update event. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Edit Event</h2>

      {!event ? (
        <div className="alert alert-warning text-center">No Event Found</div>
      ) : (
        <form
          className="row g-3"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateEvent(event.id);
          }}
        >
          {/* ... form inputs unchanged ... */}
          <div className="col-md-6">
            <label htmlFor="event-title" className="form-label">
              Event Title
            </label>
            <input
              type="text"
              className="form-control"
              id="event-title"
              value={editFormData.title}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              required
              autoFocus
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="event-location" className="form-label">
              Event Location
            </label>
            <input
              type="text"
              className="form-control"
              id="event-location"
              value={editFormData.location}
              onChange={(e) =>
                setEditFormData({ ...editFormData, location: e.target.value })
              }
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="event-description" className="form-label">
              Event Description
            </label>
            <textarea
              className="form-control"
              id="event-description"
              rows="4"
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="event-date" className="form-label">
              Event Date
            </label>
            <input
              type="date"
              className="form-control"
              id="event-date"
              value={editFormData.date}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date: e.target.value })
              }
              required
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="event-time" className="form-label">
              Event Time
            </label>
            <input
              type="time"
              className="form-control"
              id="event-time"
              value={editFormData.time}
              onChange={(e) =>
                setEditFormData({ ...editFormData, time: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="event-capacity" className="form-label">
              Event Capacity
            </label>
            <input
              type="number"
              className="form-control"
              id="event-capacity"
              value={editFormData.capacity}
              onChange={(e) =>
                setEditFormData({ ...editFormData, capacity: e.target.value })
              }
              required
              min={1}
            />
          </div>

          <div className="col-12 text-end">
            <button
              type="submit"
              className="btn btn-success mt-3"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Event"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditEvent;
