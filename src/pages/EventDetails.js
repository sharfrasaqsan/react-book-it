import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { SlCalender } from "react-icons/sl";
import { FaLocationDot } from "react-icons/fa6";
import { isEventClosed } from "../utils/EventExpired";

const EventDetails = () => {
  const {
    events,
    users,
    handleDeleteEvent,
    handleBookEvent,
    handleCancelBooking,
    currentUser,
  } = useData();
  const { id } = useParams();

  if (events.length === 0)
    return <p className="text-center mt-5">Loading...</p>;

  const event = events.find((i) => i.id === id);

  if (!event) return <p className="text-center mt-5">Event not found.</p>;

  const eventOrganizer = event.organizerId
    ? users.find((i) => i.id === event.organizerId)
    : null;

  const isClosed = isEventClosed(event.date, event.time);

  return (
    <div className="container mt-5 mb-5">
      <p className="mb-3">
        <Link to="/events" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Events
        </Link>
      </p>

      <div className="card shadow p-4">
        {event.bookedUsers?.includes(currentUser?.id) && (
          <span className="badge bg-warning text-dark">
            You have already booked this event!
          </span>
        )}

        <h2 className="mb-3">{event.title}</h2>

        {currentUser?.role === "organizer" && (
          <>
            <p>Created at: {event.createdAt}</p>
            {event.updatedAt?.length > 0 && (
              <p>Updated at: {event.updatedAt}</p>
            )}
          </>
        )}

        <div className="mb-2 text-muted">
          <SlCalender className="me-2" />
          <span>{event.date}</span> <span className="ms-2">{event.time}</span>
        </div>

        <div className="mb-2 text-muted">
          <FaLocationDot className="me-2" />
          {event.location}
        </div>

        <div className="mb-3">
          {isClosed ? (
            <span className="badge bg-danger">Event is closed!</span>
          ) : event.capacity === 0 ? (
            <span className="badge bg-danger">Booking full!</span>
          ) : (
            <span className="badge bg-success">
              {event.capacity} {event.capacity === 1 ? "seat" : "seats"}{" "}
              available
            </span>
          )}
        </div>

        <p className="mb-4">{event.description}</p>

        <p>
          Posted by: {eventOrganizer?.firstName} {eventOrganizer?.lastName}
        </p>

        <div className="d-flex flex-wrap gap-2">
          {isClosed ? (
            <button
              type="button"
              className="btn btn-primary"
              disabled
              title={"This event is closed!"}
            >
              Book Now
            </button>
          ) : (
            !event.bookedUsers?.includes(currentUser?.id) && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleBookEvent(event.id)}
                disabled={event.capacity === 0}
                title={
                  event.capacity === 0 ? "This event is full right now!" : ""
                }
              >
                Book Now
              </button>
            )
          )}

          {event.bookedUsers?.includes(currentUser?.id) && (
            <button
              type="button"
              className="btn btn-outline-warning"
              onClick={() => handleCancelBooking(event.id)}
            >
              Cancel Booking
            </button>
          )}

          {currentUser?.id === event.organizerId &&
            currentUser?.role === "organizer" && (
              <>
                <Link
                  to={`/event/edit/${event.id}`}
                  className="btn btn-outline-info"
                >
                  Edit Event
                </Link>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Delete Event
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
