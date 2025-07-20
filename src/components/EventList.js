import { useData } from "../context/DataContext";
import Event from "../components/Event";

const EventList = () => {
  const { events, loading } = useData();

  return (
    <div className="container mt-4">
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="alert alert-info text-center">No events available.</div>
      ) : (
        <div className="row">
          {events.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
