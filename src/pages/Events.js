import { useData } from "../context/DataContext";
import Event from "../components/Event";

const Events = () => {
  const { events, loading } = useData();

  const sortedEvents = [...events].reverse(); // Don't mutate original array

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">Explore All Events</h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Loading events...</p>
        </div>
      ) : !events || events.length === 0 ? (
        <div className="alert alert-info text-center">
          No events found. Check back soon!
        </div>
      ) : (
        <div className="row g-4">
          {sortedEvents.map((event) => (
            <Event key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
