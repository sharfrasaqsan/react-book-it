import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isEventClosed } from "../utils/EventExpired";

const Event = ({ event, index }) => {
  const { currentUser } = useAuth() || {};

  if (!event) return null;

  const closed = isEventClosed(event.date, event.time);

  const isBooked = event.bookedUsers?.includes(currentUser?.id);

  const capacityBadge = (cap, closed) => {
    const n = Number(cap);
    if (closed) return <span className="badge bg-secondary">Closed</span>;
    if (n === 0) return <span className="badge bg-danger">Full</span>;
    if (n < 15)
      return <span className="badge bg-warning text-dark">Only {n} left</span>;
    return <span className="badge bg-info text-dark">{n} seats</span>;
  };

  return (
    <tr>
      <td>{index + 1}</td>

      {/* Title */}
      <td className="text-break fw-semibold">
        <Link to={`/event/${event.id}`} className="text-decoration-none">
          {event.title}
          {isBooked && <span className="ms-2 badge bg-success">Booked</span>}
        </Link>
      </td>

      {/* Date */}
      <td className="text-nowrap">
        <i className="bi bi-calendar-event me-1" />
        {event.date}
      </td>

      {/* Time */}
      <td className="text-nowrap">
        <i className="bi bi-clock me-1" />
        {event.time}
      </td>

      {/* Location */}
      <td className="text-break">
        <i className="bi bi-geo-alt me-1" />
        {event.location}
      </td>

      {/* Capacity */}
      <td className="d-none d-lg-table-cell">{event.capacity}</td>

      {/* Status */}
      <td>{capacityBadge(event.capacity, closed)}</td>

      {/* Actions */}
      <td className="text-end">
        <Link
          to={`/event/${event.id}`}
          className="btn btn-outline-primary btn-sm"
        >
          Details
        </Link>
      </td>
    </tr>
  );
};

export default Event;
