import { format } from "date-fns";
import { useData } from "../context/DataContext";

const CreateEvent = () => {
  const { createFormData, setCreateFormData, handleCreateEvent } = useData();

  if (!createFormData) return <p>Loading...</p>;

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleCreateEvent}>
        <label htmlFor="event-title">Event Title</label>
        <input
          type="text"
          id="event-title"
          name="event-title"
          value={createFormData.title}
          onChange={(e) =>
            setCreateFormData({ ...createFormData, title: e.target.value })
          }
          required
          placeholder="Enter event title"
          autoComplete="off"
          autoFocus
        />

        <label htmlFor="event-description">Event Description</label>
        <textarea
          name="event-description"
          id="text-description"
          cols="30"
          rows="10"
          value={createFormData.description}
          onChange={(e) =>
            setCreateFormData({
              ...createFormData,
              description: e.target.value,
            })
          }
          required
          placeholder="Enter event description"
          autoComplete="off"
        />

        <label htmlFor="event-location">Event Location</label>
        <input
          type="text"
          id="event-location"
          name="event-location"
          value={createFormData.location}
          onChange={(e) =>
            setCreateFormData({
              ...createFormData,
              location: e.target.value,
            })
          }
          required
          placeholder="Enter event location"
          autoComplete="off"
        />

        <label htmlFor="event-date">Event Date</label>
        <input
          type="date"
          id="event-date"
          name="event-date"
          value={createFormData.date}
          onChange={(e) =>
            setCreateFormData({ ...createFormData, date: e.target.value })
          }
          required
          autoComplete="off"
          min={format(new Date(), "yyyy-MM-dd")}
        />

        <label htmlFor="event-time">Event Time</label>
        <input
          type="time"
          id="event-time"
          name="event-time"
          value={createFormData.time}
          onChange={(e) =>
            setCreateFormData({ ...createFormData, time: e.target.value })
          }
          required
          autoComplete="off"
        />

        <label htmlFor="event-capacity">Event Capacity</label>
        <input
          type="number"
          id="event-capacity"
          name="event-capacity"
          value={createFormData.capacity}
          onChange={(e) =>
            setCreateFormData({ ...createFormData, capacity: e.target.value })
          }
          required
          autoComplete="off"
          min={1}
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
