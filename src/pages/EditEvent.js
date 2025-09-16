// src/pages/EditEvent.js
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { confirmDialog } from "../utils/confirmDialog";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const EditEvent = () => {
  const { events, setEvents, editFormData, setEditFormData, navigate } =
    useData();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const event = Array.isArray(events) ? events.find((i) => i.id === id) : null;

  useEffect(() => {
    if (event) {
      setEditFormData({
        title: event.title ?? "",
        description: event.description ?? "",
        date: event.date ?? "",
        time: event.time ?? "",
        location: event.location ?? "",
        capacity: event.capacity ?? "",
      });
    }
  }, [event, setEditFormData]);

  // Preview helpers for the summary card
  const capacityNum = useMemo(
    () => Number(editFormData?.capacity ?? 0) || 0,
    [editFormData?.capacity]
  );
  const hasBasics =
    (editFormData?.title?.length || 0) > 0 &&
    (editFormData?.description?.length || 0) > 0 &&
    (editFormData?.location?.length || 0) > 0 &&
    (editFormData?.date?.length || 0) > 0 &&
    (editFormData?.time?.length || 0) > 0 &&
    capacityNum > 0;

  const handleUpdateEvent = async () => {
    if (
      !editFormData.title ||
      !editFormData.description ||
      !editFormData.location ||
      !editFormData.capacity
    ) {
      return toast.error("Please fill in all the fields.");
    }

    if (!editFormData.date || !editFormData.time) {
      return toast.error("Please select both date and time.");
    }

    const eventDateTime = new Date(`${editFormData.date}T${editFormData.time}`);
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }

    if (eventDateTime < new Date()) {
      return toast.error("Event date and time must be in the future.");
    }

    if (Number(editFormData.capacity) <= 0) {
      return toast.error("Capacity must be greater than 0.");
    }

    const confirm = await confirmDialog({
      title: "Update the event",
      text: "Are you sure you want to update this event?",
    });

    if (!confirm) {
      toast.warning("Event update canceled.");
      navigate(`/event/${id}`);
      return;
    }

    setLoading(true);

    try {
      const updatedEvent = {
        title: editFormData.title,
        description: editFormData.description,
        date: editFormData.date,
        time: editFormData.time,
        capacity: Number(editFormData.capacity),
        location: editFormData.location,
        updatedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss a"),
      };

      await updateDoc(doc(db, "events", id), updatedEvent);

      // Update local state
      const updatedEvents = events.map((i) =>
        i.id === id ? { ...i, ...updatedEvent } : i
      );
      setEvents(updatedEvents);

      toast.success("Event updated successfully.");
      navigate(`/event/${id}`);
    } catch (err) {
      toast.error("Failed to update event. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) handleUpdateEvent();
  };

  const handleReset = () => {
    setEditFormData({
      title: event.title ?? "",
      description: event.description ?? "",
      date: event.date ?? "",
      time: event.time ?? "",
      location: event.location ?? "",
      capacity: event.capacity ?? "",
    });
  };

  // Guard states (consistent page layout)
  if (!events) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading event…</p>
      </div>
    );
  }
  if (!event && events.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading event…</p>
      </div>
    );
  }
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

  return (
    <div className="container py-5">
      {/* Breadcrumbs + Header (matches other pages) */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/events">Events</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/event/${event.id}`}>Details</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Edit
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">Edit Event</h1>
          <div className="text-muted">Update the event information below.</div>
        </div>
        <div className="d-flex gap-2">
          <Link to={`/event/${event.id}`} className="btn btn-outline-secondary">
            &larr; Back to Details
          </Link>
        </div>
      </div>

      <div className="row g-4">
        {/* Main form */}
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="border-start border-4 border-primary ps-3 mb-3">
                <h2 className="h4 fw-semibold mb-0">Event details</h2>
              </div>

              <form className="row g-3" onSubmit={handleSubmit} noValidate>
                {/* Title */}
                <div className="col-12">
                  <label
                    htmlFor="event-title"
                    className="form-label fw-semibold"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="event-title"
                    value={editFormData.title}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        title: e.target.value,
                      })
                    }
                    required
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="col-12">
                  <label
                    htmlFor="event-description"
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="event-description"
                    rows="5"
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Date / Time */}
                <div className="col-md-6">
                  <label
                    htmlFor="event-date"
                    className="form-label fw-semibold"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="event-date"
                    value={editFormData.date}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, date: e.target.value })
                    }
                    required
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div className="col-md-6">
                  <label
                    htmlFor="event-time"
                    className="form-label fw-semibold"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    id="event-time"
                    value={editFormData.time}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, time: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Location / Capacity */}
                <div className="col-md-8">
                  <label
                    htmlFor="event-location"
                    className="form-label fw-semibold"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="event-location"
                    value={editFormData.location}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="event-capacity"
                    className="form-label fw-semibold"
                  >
                    Capacity
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="event-capacity"
                    value={editFormData.capacity}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        capacity: e.target.value,
                      })
                    }
                    required
                    min={1}
                  />
                </div>

                {/* Actions */}
                <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      "Update Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Sticky summary (right column) */}
        <div className="col-lg-4">
          <div
            className="card shadow-sm position-sticky"
            style={{ top: "1rem" }}
          >
            <div className="card-body p-4">
              <h3 className="h6 text-uppercase text-muted mb-3">Summary</h3>

              <div className="mb-2">
                <div className="text-muted small">Title</div>
                <div className="fw-semibold text-break">
                  {editFormData?.title || <span className="text-muted">—</span>}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-muted small">When</div>
                <div className="fw-semibold">
                  {editFormData?.date || "—"} <span className="mx-1">•</span>{" "}
                  {String(editFormData?.time || "").padStart(5, "0") || "—"}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-muted small">Location</div>
                <div className="fw-semibold text-break">
                  {editFormData?.location || (
                    <span className="text-muted">—</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="text-muted small">Capacity</div>
                <div className="fw-semibold">{capacityNum || 0}</div>
              </div>

              <div
                className="progress mb-3"
                role="progressbar"
                aria-label="Completeness"
                aria-valuenow={hasBasics ? 100 : 50}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`progress-bar ${
                    hasBasics ? "bg-success" : "bg-warning text-dark"
                  }`}
                  style={{ width: hasBasics ? "100%" : "50%" }}
                />
              </div>

              <div className="small text-muted">
                {hasBasics
                  ? "Looks good — ready to update."
                  : "Fill out all fields to update."}
              </div>

              <hr className="my-4" />

              <div className="d-grid gap-2">
                <Link
                  to={`/event/${event.id}`}
                  className="btn btn-outline-secondary"
                >
                  &larr; Back to Details
                </Link>
                <Link to="/events" className="btn btn-link p-0">
                  Back to Events List
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* /Sticky summary */}
      </div>
    </div>
  );
};

export default EditEvent;
