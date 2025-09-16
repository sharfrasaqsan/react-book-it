import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { isEventClosed } from "../utils/EventExpired";

// Local helpers to avoid extra exports
const toLocalDate = (dateStr, timeStr = "00:00") => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const hhmm = String(timeStr || "00:00")
    .slice(0, 5)
    .padStart(5, "0");
  const d = new Date(`${dateStr}T${hhmm}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};
const compareEventsDesc = (a, b) => {
  const ad = toLocalDate(a?.date, a?.time)?.getTime() ?? -Infinity;
  const bd = toLocalDate(b?.date, b?.time)?.getTime() ?? -Infinity;
  return bd - ad; // newest/upcoming first
};

const MyEvents = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { events, handleDeleteEvent } = useData();

  // Organizer's events
  const myEvents = useMemo(() => {
    const list = (events || []).filter(
      (e) => e.organizerId === currentUser?.id
    );
    return list.sort(compareEventsDesc);
  }, [events, currentUser?.id]);

  const onDelete = async (ev) => {
    const ok = window.confirm(`Delete "${ev.title}"? This cannot be undone.`);
    if (!ok) return;
    try {
      await handleDeleteEvent?.(ev.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const StatusBadge = ({ ev }) => {
    const closed = isEventClosed(ev.date, ev.time);
    const cap = Number(ev.capacity) || 0;
    const booked = Number(ev.bookedUsers?.length || 0);
    const remaining = Math.max(cap - booked, 0);

    if (closed) return <span className="badge bg-secondary">Closed</span>;
    if (cap === 0) return <span className="badge bg-danger">No capacity</span>;
    if (remaining === 0) return <span className="badge bg-danger">Full</span>;
    if (remaining < 15)
      return (
        <span className="badge bg-warning text-dark">
          Only {remaining} left
        </span>
      );
    return <span className="badge bg-success">{remaining} left</span>;
  };
  // Loading state
  if (!events) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading your events…</p>
      </div>
    );
  }
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">My Events</h1>
          <div className="text-muted">Manage the events you’ve created.</div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/create")}
          >
            + Create Event
          </button>
        </div>
      </div>

      {myEvents.length === 0 ? (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
          <div>You haven’t created any events yet.</div>
          <Link to="/create" className="btn btn-primary btn-sm">
            Create One
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle">
            <thead
              className="table-light position-sticky top-0"
              style={{ zIndex: 1 }}
            >
              <tr>
                <th style={{ width: "34%" }}>Title</th>
                <th style={{ width: "12%" }} className="d-none d-md-table-cell">
                  Date
                </th>
                <th style={{ width: "10%" }} className="d-none d-lg-table-cell">
                  Time
                </th>
                <th style={{ width: "20%" }}>Location</th>
                <th
                  style={{ width: "8%" }}
                  className="text-center d-none d-lg-table-cell"
                >
                  Capacity
                </th>
                <th
                  style={{ width: "8%" }}
                  className="text-center d-none d-lg-table-cell"
                >
                  Booked
                </th>
                <th style={{ width: "8%" }}>Status</th>
                <th style={{ width: "10%" }} className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {myEvents.map((ev) => (
                <tr key={ev.id}>
                  {/* Title */}
                  <td className="text-break fw-semibold">
                    <Link
                      to={`/event/${ev.id}`}
                      className="text-decoration-none"
                    >
                      {ev.title}
                    </Link>
                    <div className="text-muted small d-md-none">
                      {/* Compact when on mobile */}
                      {ev.date} • {String(ev.time || "").padStart(5, "0")}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="text-nowrap d-none d-md-table-cell">
                    {ev.date}
                  </td>

                  {/* Time */}
                  <td className="text-nowrap d-none d-lg-table-cell">
                    {ev.time}
                  </td>

                  {/* Location */}
                  <td className="text-break">{ev.location}</td>

                  {/* Capacity */}
                  <td className="text-center d-none d-lg-table-cell">
                    {Number(ev.capacity) || 0}
                  </td>

                  {/* Booked */}
                  <td className="text-center d-none d-lg-table-cell">
                    {Number(ev.bookedUsers?.length || 0)}
                  </td>

                  {/* Status */}
                  <td>
                    <StatusBadge ev={ev} />
                  </td>

                  {/* Actions */}
                  <td className="text-end">
                    <div className="btn-group">
                      <Link
                        to={`/event/${ev.id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/event/edit/${ev.id}`}
                        className="btn btn-outline-info btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onDelete(ev)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
