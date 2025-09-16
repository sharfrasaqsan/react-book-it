import { format } from "date-fns";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useData } from "../context/DataContext";

const CreateEvent = () => {
  const {
    events,
    setEvents,
    createFormData,
    setCreateFormData,
    navigate,
    currentUser,
  } = useData();

  const [loading, setLoading] = useState(false);

  // Derived preview
  const capacityNum = useMemo(
    () => Number(createFormData.capacity) || 0,
    [createFormData.capacity]
  );
  
  const hasBasics =
    createFormData.title &&
    createFormData.description &&
    createFormData.location &&
    createFormData.date &&
    createFormData.time &&
    capacityNum > 0;

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    // Basic checks (keep toasts but rely on native required too)
    if (
      !createFormData.title ||
      !createFormData.description ||
      !createFormData.location ||
      !createFormData.capacity
    ) {
      return toast.error("Please fill in all the fields.");
    }
    if (!createFormData.date || !createFormData.time) {
      return toast.error("Please select both date and time.");
    }

    const eventDateTime = new Date(
      `${createFormData.date}T${createFormData.time}`
    );
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }
    if (eventDateTime < new Date()) {
      return toast.error("Event date and time must be in the future.");
    }

    const cap = Number(createFormData.capacity);
    if (isNaN(cap) || cap <= 0) {
      return toast.error("Capacity must be a number greater than 0.");
    }

    setLoading(true);
    try {
      const newEvent = {
        title: createFormData.title,
        description: createFormData.description,
        location: createFormData.location,
        date: createFormData.date,
        time: createFormData.time,
        capacity: cap,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm:ss a"),
        organizerId: currentUser?.id || null,
        bookedUsers: [],
      };

      const docRef = await addDoc(collection(db, "events"), newEvent);
      if (!docRef) throw new Error("Failed to create event.");

      const eventWithId = { id: docRef.id, ...newEvent };
      setEvents([...(events || []), eventWithId]);

      setCreateFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
      });

      toast.success("Event created successfully.");
      navigate("/events");
    } catch (err) {
      toast.error("Failed to create event. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCreateFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      capacity: "",
    });
  };

  // Guard (keeps layout consistent)
  if (!createFormData) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 mb-0">Loading form…</p>
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
          <li className="breadcrumb-item active" aria-current="page">
            Create
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1 text-uppercase">
            Create New Event
          </h1>
          <div className="text-muted">
            Publish a new event with date, time, location, and capacity.
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/events" className="btn btn-outline-secondary">
            &larr; Back to Events
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

              <form className="row g-3" onSubmit={handleCreateEvent} noValidate>
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
                    placeholder="e.g., Tech Leaders Summit"
                    value={createFormData.title}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        title: e.target.value,
                      })
                    }
                    required
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
                    placeholder="Tell attendees what to expect…"
                    value={createFormData.description}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
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
                    value={createFormData.date}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        date: e.target.value,
                      })
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
                    value={createFormData.time}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
                        time: e.target.value,
                      })
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
                    placeholder="Venue or address"
                    value={createFormData.location}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
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
                    placeholder="e.g., 150"
                    value={createFormData.capacity}
                    onChange={(e) =>
                      setCreateFormData({
                        ...createFormData,
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
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating...
                      </>
                    ) : (
                      "Create Event"
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
                  {createFormData.title || (
                    <span className="text-muted">—</span>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-muted small">When</div>
                <div className="fw-semibold">
                  {createFormData.date || "—"} <span className="mx-1">•</span>{" "}
                  {String(createFormData.time || "").padStart(5, "0") || "—"}
                </div>
              </div>

              <div className="mb-2">
                <div className="text-muted small">Location</div>
                <div className="fw-semibold text-break">
                  {createFormData.location || (
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
                  ? "Looks good — ready to publish."
                  : "Fill out all fields to publish."}
              </div>

              <hr className="my-4" />

              <div className="d-grid gap-2">
                <Link to="/events" className="btn btn-outline-secondary">
                  &larr; Back to Events
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

export default CreateEvent;
