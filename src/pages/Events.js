import { useData } from "../context/DataContext";
import Event from "../components/Event";

const Events = () => {
  const { events } = useData();

  const sortedEvents = [...events].reverse(); // Don't mutate original array

  if (!events) {
    <div className="text-center">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-2">Loading events...</p>
    </div>;
  }

  if (events.length === 0) {
    <div className="alert alert-info text-center">No events available.</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center fw-bold mb-4">Explore All Events</h2>

      <div className="row g-4">
        {sortedEvents.map((event) => (
          <Event key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;
