import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Event = ({ event }) => {
  const { handleBookEvent } = useData();

  if (!event) return <p>Loading...</p>;

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">
            <Link to={`/event/${event.id}`} className="text-decoration-none">
              {event.title}
            </Link>
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">{event.location}</h6>
          <p className="mb-2">
            <span className="me-2">{event.date}</span>
            <span>{event.time}</span>
          </p>

          {event.capacity === 0 ? (
            <span className="badge bg-danger">Booking full!</span>
          ) : (
            event.capacity < 15 && (
              <span className="badge bg-warning text-dark">
                Only {event.capacity} {event.capacity === 1 ? "seat" : "seats"}{" "}
                left!
              </span>
            )
          )}
        </div>

        <div className="card-footer bg-white border-top-0">
          <button
            className="btn btn-primary w-100"
            onClick={() => handleBookEvent(event.id)}
            disabled={event.capacity === 0}
            title={event.capacity === 0 ? "This event is full right now!" : ""}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Event;
