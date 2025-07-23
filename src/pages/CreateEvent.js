import { format } from "date-fns";
import { useData } from "../context/DataContext";
import { toast } from "react-toastify";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

const CreateEvent = () => {
  const {
    events,
    setEvents,
    createFormData,
    setCreateFormData,
    navigate,
    currentUser,
  } = useData();
  const [loading, setLoading] = useState(false);

  if (!createFormData) return <p>Loading...</p>;

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (
      !createFormData.title ||
      !createFormData.description ||
      !createFormData.location ||
      !createFormData.capacity
    ) {
      return toast.error("Please fill in all the fields.");
    }

    if (!createFormData.date || !createFormData.time) {
      return toast.error("Please select both date and time.");
    }

    const eventDateTimeString = `${createFormData.date}T${createFormData.time}`;
    const eventDateTime = new Date(eventDateTimeString);
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }

    const now = new Date();
    if (eventDateTime < now) {
      return toast.error("Event date and time must be in the future.");
    }

    const capacityNum = Number(createFormData.capacity);
    if (isNaN(capacityNum) || capacityNum <= 0) {
      return toast.error("Capacity must be a number greater than 0.");
    }

    setLoading(true);
    try {
      const newEvent = {
        title: createFormData.title,
        description: createFormData.description,
        location: createFormData.location,
        date: createFormData.date,
        time: createFormData.time,
        capacity: capacityNum,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss a"),
        organizerId: currentUser?.id || null, // dynamically set organizer if available
        bookedUsers: [],
      };

      const docRef = await addDoc(collection(db, "events"), newEvent);
      if (!docRef) throw new Error("Failed to create event.");

      const eventWithId = { id: docRef.id, ...newEvent };
      setEvents([...events, eventWithId]);

      setCreateFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
      });

      toast.success("Event created successfully.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create event. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Create New Event</h2>

      <form className="row g-3" onSubmit={handleCreateEvent}>
        <div className="col-md-6">
          <label htmlFor="event-title" className="form-label">
            Event Title
          </label>
          <input
            type="text"
            className="form-control"
            id="event-title"
            value={createFormData.title}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, title: e.target.value })
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
            value={createFormData.location}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, location: e.target.value })
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
            value={createFormData.description}
            onChange={(e) =>
              setCreateFormData({
                ...createFormData,
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
            value={createFormData.date}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, date: e.target.value })
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
            value={createFormData.time}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, time: e.target.value })
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
            value={createFormData.capacity}
            onChange={(e) =>
              setCreateFormData({ ...createFormData, capacity: e.target.value })
            }
            required
            min={1}
          />
        </div>

        <div className="col-12 text-end">
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
