import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { isEventClosed } from "../utils/EventExpired";

/**
 * Requires (once in your app entry, e.g., index.js):
 *  import "bootstrap/dist/css/bootstrap.min.css";
 *  import "bootstrap/dist/js/bootstrap.bundle.min.js";
 *  import "bootstrap-icons/font/bootstrap-icons.css";
 */
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

  if (!events || events.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading event…</p>
      </div>
    );
  }

  const event = events.find((i) => i.id === id);
  if (!event) {
    return (
      <div className="container py-5 text-center">
        <p className="mb-3">Event not found.</p>
        <Link to="/events" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Events
        </Link>
      </div>
    );
  }

  const organizer = event.organizerId
    ? users?.find((u) => u.id === event.organizerId)
    : null;

  const isClosed = isEventClosed(event.date, event.time);
  const isBooked = event.bookedUsers?.includes?.(currentUser?.id);
  const isOwner =
    currentUser?.role === "organizer" && currentUser?.id === event.organizerId;

  const statusBadge = (() => {
    const cap = Number(event.capacity) || 0;
    if (isClosed)
      return <span className="badge bg-secondary">Event closed</span>;
    if (cap === 0) return <span className="badge bg-danger">Booking full</span>;
    if (cap < 15)
      return (
        <span className="badge bg-warning text-dark">
          Only {cap} {cap === 1 ? "seat" : "seats"} left
        </span>
      );
    return <span className="badge bg-success">{cap} seats available</span>;
  })();

  return (
    <div className="container py-4 py-md-5">
      {/* Back link */}
      <p className="mb-3">
        <Link to="/events" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Events
        </Link>
      </p>

      <div className="row g-4">
        {/* Main content */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-3 p-md-4">
              {isBooked && (
                <div className="alert alert-warning py-2 mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  You have already booked this event.
                </div>
              )}

              {/* Title + status */}
              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-start mb-3">
                <div className="border-start border-4 border-primary ps-3">
                  <h1 className="h3 h2-md mb-1 fw-semibold">{event.title}</h1>
                  <div className="text-muted small">
                    {organizer ? (
                      <>
                        Organized by{" "}
                        <span className="fw-medium">
                          {organizer.firstName} {organizer.lastName}
                        </span>
                      </>
                    ) : (
                      <>Organizer information unavailable</>
                    )}
                  </div>
                </div>
                <div>{statusBadge}</div>
              </div>

              {/* Meta list */}
              <ul className="list-unstyled mb-4">
                <li className="mb-2 text-muted">
                  <i className="bi bi-calendar-event me-2"></i>
                  <span className="me-3">{event.date}</span>
                  <i className="bi bi-clock me-2"></i>
                  <span>{event.time}</span>
                </li>
                <li className="mb-2 text-muted">
                  <i className="bi bi-geo-alt me-2"></i>
                  <span className="text-break">{event.location}</span>
                </li>
                {isOwner && (
                  <>
                    {event.createdAt && (
                      <li className="mb-1 text-muted small">
                        <i className="bi bi-pencil-square me-2"></i>
                        Created at: {String(event.createdAt)}
                      </li>
                    )}
                    {event.updatedAt && String(event.updatedAt).length > 0 && (
                      <li className="mb-1 text-muted small">
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Updated at: {String(event.updatedAt)}
                      </li>
                    )}
                  </>
                )}
              </ul>

              {/* Description */}
              <div className="mb-0">
                <h2 className="h5 fw-semibold mb-2">About this event</h2>
                <p className="mb-0 text-break">{event.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action sidebar */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem" }}
          >
            <div className="card-body p-3 p-md-4">
              <h3 className="h6 text-uppercase text-muted mb-3">Actions</h3>

              {/* Capacity snapshot */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted">Capacity</span>
                <span className="fw-semibold">
                  {Number(event.capacity) || 0}
                </span>
              </div>

              {/* Primary action */}
              {!isBooked ? (
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => handleBookEvent(event.id)}
                  disabled={isClosed || Number(event.capacity) === 0}
                  title={
                    isClosed
                      ? "This event is closed."
                      : Number(event.capacity) === 0
                      ? "This event is full."
                      : "Book your seat"
                  }
                >
                  {isClosed
                    ? "Closed"
                    : Number(event.capacity) === 0
                    ? "Full"
                    : "Book Now"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-outline-warning w-100"
                  onClick={() => handleCancelBooking(event.id)}
                >
                  Cancel Booking
                </button>
              )}

              {/* Owner actions */}
              {isOwner && (
                <>
                  <hr className="my-4" />
                  <div className="d-grid gap-2">
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
                  </div>
                </>
              )}

              {/* Back link (mobile helper) */}
              <div className="d-grid mt-3 d-lg-none">
                <Link to="/events" className="btn btn-outline-secondary">
                  &larr; Back to Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
