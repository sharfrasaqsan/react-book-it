import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const MyBookings = () => {
  const { users, currentUser, events } = useData();

  if (!currentUser || users.length === 0 || events.length === 0) {
    return <p className="text-center mt-5">Loading your bookings...</p>;
  }

  const myUser = users.find((i) => i.id === currentUser.id);

  if (!myUser || !myUser.bookedEvents || myUser.bookedEvents.length === 0) {
    return <p className="text-center mt-5">You have not booked any events!</p>;
  }

  const bookedEventsDetails = myUser.bookedEvents
    .map((eventId) => events.find((event) => event.id === eventId))
    .filter(Boolean);

  return (
    <div className="container mt-2">
      <h2 className="mb-4 text-center">My Booked Events</h2>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {bookedEventsDetails.map((event) => (
          <div className="col" key={event.id}>
            <Link
              to={`/event/${event.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text mb-1">
                    <strong>Date:</strong> {event.date}
                  </p>
                  <p className="card-text mb-1">
                    <strong>Time:</strong> {event.time}
                  </p>
                  <p className="card-text mb-0">
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
