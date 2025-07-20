import { format } from "date-fns";
import { useData } from "../context/DataContext";

const CreateEvent = () => {
  const { createFormData, setCreateFormData, handleCreateEvent } = useData();

  if (!createFormData) return <p>Loading...</p>;

  return (
    <div className="container mt-2">
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
