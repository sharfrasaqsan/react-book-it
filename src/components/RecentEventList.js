import { useData } from "../context/DataContext";
import Event from "./Event";

const RecentEventList = () => {
  const { events, loading } = useData();

  return (
    <section className="container mt-5">
      <h2 className="mb-3 text-center fw-bold">Recent Events</h2>
      <p className="text-center text-muted mb-4">
        Check out the latest events you might be interested in
      </p>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-2">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="alert alert-info text-center">No events available.</div>
      ) : (
        <div className="row">
          {events
            .slice(0, 9)
            .reverse()
            .map((event) => (
              <Event key={event.id} event={event} />
            ))}
        </div>
      )}
    </section>
  );
};

export default RecentEventList;
