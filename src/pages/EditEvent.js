import { useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useEffect } from "react";

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

  return (
    <div>
      {!event ? (
        <p>No Event available here!</p>
      ) : (
        <>
          <h2>Edit Event</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="event-title">Event Title: </label>
            <input
              type="text"
              id="event-title"
              name="event-title"
              value={editFormData.title}
              onChange={(e) =>
                setEditFormData({ ...editFormData, title: e.target.value })
              }
              required
            />

            <label htmlFor="event-description">Event Description: </label>
            <textarea
              name="event-description"
              id="text-description"
              cols="30"
              rows="10"
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  description: e.target.value,
                })
              }
              required
            />

            <label htmlFor="event-location">Event Location: </label>
            <input
              type="text"
              id="event-location"
              name="event-location"
              value={editFormData.location}
              onChange={(e) =>
                setEditFormData({ ...editFormData, location: e.target.value })
              }
              required
            />

            <label htmlFor="event-date">Event Date: </label>
            <input
              type="date"
              id="event-date"
              name="event-date"
              value={editFormData.date}
              onChange={(e) =>
                setEditFormData({ ...editFormData, date: e.target.value })
              }
              required
            />

            <label htmlFor="event-time">Event Time: </label>
            <input
              type="time"
              id="event-time"
              name="event-time"
              value={editFormData.time}
              onChange={(e) =>
                setEditFormData({ ...editFormData, time: e.target.value })
              }
              required
            />

            <label htmlFor="event-capacity">Event Capacity: </label>
            <input
              type="number"
              id="event-capacity"
              name="event-capacity"
              value={editFormData.capacity}
              onChange={(e) =>
                setEditFormData({ ...editFormData, capacity: e.target.value })
              }
              required
            />

            <button type="submit" onClick={() => handleUpdateEvent(event.id)}>
              Update Event
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditEvent;
