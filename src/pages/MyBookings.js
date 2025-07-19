import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const MyBookings = () => {
  const { users, currentUser, events } = useData();

  // If data is still loading or unavailable, show a loading or nothing
  if (!currentUser || users.length === 0 || events.length === 0) {
    return <p>Loading your bookings...</p>;
  }

  // Find the logged-in user from the users array
  const myUser = users.find((i) => i.id === currentUser.id);

  // Get the full event objects based on booked event IDs
  const bookedEventsDetails = myUser.bookedEvents
    .map((eventId) => events.find((event) => event.id === eventId))
    .filter(Boolean);

  // Early return if data is not ready or user has no bookings
  if (!myUser || !myUser.bookedEvents || myUser.bookedEvents.length === 0) {
    return <p>You have not booked any events!</p>;
  }

  return (
    <div>
      <h2>My Booked Events</h2>
      <ul>
        {bookedEventsDetails.map((event) => (
          <Link to={`/event/${event.id}`} key={event.id}>
            <li>
              <strong>{event.title}</strong> – {event.date} at {event.time} in{" "}
              {event.location}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default MyBookings;
