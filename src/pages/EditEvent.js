import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useEffect } from "react";
import { format } from "date-fns";

const EditEvent = () => {
  const { events, editFormData, setEditFormData, handleUpdateEvent } =
    useData();
  const { id } = useParams();

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

  return (
    <div className="container mt-2">
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
            <button type="submit" className="btn btn-success mt-3">
              Update Event
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditEvent;
