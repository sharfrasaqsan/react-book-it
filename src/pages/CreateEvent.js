import { format } from "date-fns";
import { useData } from "../context/DataContext";
import { toast } from "react-toastify";
import request from "../api/request";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

const CreateEvent = () => {
  const { events, setEvents, createFormData, setCreateFormData, navigate } =
    useData();

  if (!createFormData) return <p>Loading...</p>;

  // Create Event
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

    // Check if date and time are valid
    const now = new Date();
    if (!createFormData.date || !createFormData.time) {
      return toast.error("Please select both date and time.");
    }
    // Combine date and time like: "2025-07-20T14:30"
    const eventDateTimeString = `${createFormData.date}T${createFormData.time}`;
    // Convert to a Date object
    const eventDateTime = new Date(eventDateTimeString);
    // Check if it's a valid date
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }
    // Compare with current date and time
    if (eventDateTime < now) {
      return toast.error("Event date and time must be in the future.");
    }

    // Check if capacity is greater than 0
    if (createFormData.capacity <= 0) {
      return toast.error("Capacity must be greater than 0.");
    }

    try {
      const newEvent = {
        title: createFormData.title,
        description: createFormData.description,
        location: createFormData.location,
        date: createFormData.date,
        time: createFormData.time,
        capacity: createFormData.capacity,
        createdAt: format(new Date(), "yyyy-MM-dd hh:mm:ss a"),
        organizerId: null,
        bookedUsers: [],
      };
      
      const docRef = await addDoc(collection(db, "events"), newEvent);
      if (!docRef) return toast.error("Failed to create event.");
      const eventWithId = { id: docRef.id, ...newEvent };
      const newEvents = [...events, eventWithId];
      setEvents(newEvents);
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
      console.log("DB:", db);
    } catch (err) {
      toast.error("Failed to create event. " + err.message);
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
          <button type="submit" className="btn btn-primary mt-3">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
