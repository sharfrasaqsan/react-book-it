import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const MyBookings = () => {
  const { users, currentUser, events } = useData();

  // Find the logged-in user from the users array
  const myUser = users.find((i) => i.id === currentUser.id);

  // Get the full event objects based on booked event IDs
  const bookedEventsDetails = myUser.bookedEvents.map((eventId) =>
    events.find((event) => event.id === eventId)
  );

  return (
    <div>
      <h2>My Booked Events</h2>
      <ul>
        {bookedEventsDetails.map((event) => (
          <Link to={`/event/${event.id}`}>
            <li key={event.id}>
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
