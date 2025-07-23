import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { isEventClosed } from "../utils/EventExpired";

const Event = ({ event }) => {
  const { handleBookEvent } = useData();
  const { currentUser } = useAuth();

  if (!currentUser || !event) return <p>Loading...</p>;

  const isBooked = currentUser?.bookedEvents?.includes(event.id);

  const isClosed = isEventClosed(event.date, event.time);

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div
        className={`card h-100 shadow-sm position-relative ${
          isBooked ? "bg-light opacity-75" : ""
        }`}
      >
        {/* Already Booked Badge */}
        {isBooked && (
          <span
            className="badge bg-secondary position-absolute top-0 end-0 m-2"
            style={{ zIndex: 1 }}
          >
            Already Booked
          </span>
        )}

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

          {isClosed ? (
            <span className="badge bg-danger">Event is closed</span>
          ) : event.capacity === 0 ? (
            <span className="badge bg-danger">Booking full!</span>
          ) : event.capacity < 15 ? (
            <span className="badge bg-warning text-dark">
              Only {event.capacity} {event.capacity === 1 ? "seat" : "seats"}{" "}
              left!
            </span>
          ) : (
            <span className="badge bg-info text-dark">
              {event.capacity} seats left
            </span>
          )}
        </div>

        {isClosed ? (
          <div className="card-footer bg-white border-top-0">
            <button
              className="btn btn-danger w-100"
              disabled
              title="This event is closed!"
            >
              Event is Out of Date
            </button>
          </div>
        ) : (
          <div className="card-footer bg-white border-top-0">
            <button
              className="btn btn-primary w-100"
              onClick={() => handleBookEvent(event.id)}
              disabled={event.capacity === 0 || isBooked}
              title={
                event.capacity === 0
                  ? "This event is full right now!"
                  : isBooked
                  ? "You've already booked this event"
                  : ""
              }
            >
              {isBooked ? "Booked" : "Book Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
