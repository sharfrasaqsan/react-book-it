// src/pages/MyBookings.js
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { isEventClosed } from "../utils/EventExpired";

// Local helpers (so we don't depend on exports you don't have)
const toLocalDate = (dateStr, timeStr = "00:00") => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const hhmm = String(timeStr || "00:00")
    .slice(0, 5)
    .padStart(5, "0");
  const isoLocal = `${dateStr}T${hhmm}:00`;
  const d = new Date(isoLocal);
  return Number.isNaN(d.getTime()) ? null : d;
};
const compareEventsDesc = (a, b) => {
  const ad = toLocalDate(a?.date, a?.time)?.getTime() ?? -Infinity;
  const bd = toLocalDate(b?.date, b?.time)?.getTime() ?? -Infinity;
  return bd - ad; // newest/upcoming first
};

const MyBookings = () => {
  const { users, currentUser, events, handleCancelBooking } = useData();
  const navigate = useNavigate();

  const myUser = users.find((u) => u.id === currentUser.id);
  const bookedIds = myUser?.bookedEvents ?? [];

  const bookedEvents = useMemo(() => {
    if (!Array.isArray(events) || !Array.isArray(bookedIds)) return [];
    const byId = new Map(events.map((e) => [e.id, e]));
    return bookedIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort(compareEventsDesc);
  }, [events, bookedIds]);

  const cancelBooking = async (eventId) => {
    if (!handleCancelBooking) return;
    try {
      await handleCancelBooking(eventId);
    } catch (err) {
      console.error("Cancel booking failed:", err);
    }
  };

  const StatusBadge = ({ ev }) => {
    const closed = isEventClosed(ev.date, ev.time);
    const cap = Number(ev.capacity) || 0;
    if (closed) return <span className="badge bg-secondary">Closed</span>;
    if (cap === 0) return <span className="badge bg-danger">Full</span>;
    if (cap < 15)
      return (
        <span className="badge bg-warning text-dark">Only {cap} left</span>
      );
    return <span className="badge bg-success">{cap} seats</span>;
  };

  const whenToString = (ev) => {
    const dt = toLocalDate(ev.date, ev.time);
    if (!dt) return `${ev.date ?? ""} • ${ev.time ?? ""}`;
    return `${ev.date} • ${String(ev.time || "").padStart(5, "0")}`;
  };

  // Guard: user or users list not ready
  if (!currentUser || !Array.isArray(users)) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading your bookings…</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            My Booked Events
          </h1>
          <div className="text-muted">
            Review your bookings or jump to event details.
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/events")}
          >
            Browse Events
          </button>
        </div>
      </div>

      {bookedEvents.length === 0 ? (
        <div className="alert alert-info d-flex align-items-center justify-content-between">
          <div>You haven’t booked any events yet.</div>
          <Link to="/events" className="btn btn-primary btn-sm">
            Find Events
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
                <th style={{ width: "36%" }}>Title</th>
                <th style={{ width: "14%" }} className="d-none d-md-table-cell">
                  Date
                </th>
                <th style={{ width: "14%" }} className="d-none d-lg-table-cell">
                  Time
                </th>
                <th style={{ width: "22%" }}>Location</th>
                <th
                  style={{ width: "8%" }}
                  className="text-center d-none d-lg-table-cell"
                >
                  Capacity
                </th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "10%" }} className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookedEvents.map((ev) => (
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
                      {whenToString(ev)}
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

                  {/* Capacity (hidden on md-) */}
                  <td className="text-center d-none d-lg-table-cell">
                    {Number(ev.capacity) || 0}
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
                        Details
                      </Link>
                      {handleCancelBooking && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => cancelBooking(ev.id)}
                          title="Cancel this booking"
                        >
                          Cancel
                        </button>
                      )}
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

export default MyBookings;
