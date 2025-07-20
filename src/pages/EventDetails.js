import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { SlCalender } from "react-icons/sl";
import { FaLocationDot } from "react-icons/fa6";

const EventDetails = () => {
  const { events, handleDeleteEvent, handleBookEvent, handleCancelBooking } =
    useData();

  const { id } = useParams();

  if (events.length === 0) {
    return <p>Loading...</p>;
  }

  const event = events.find((i) => i.id === id);

  if (!event) {
    return <p>No Event available here!</p>;
  }

  return (
    <div>
      <p>
        Back to <Link to="/">Events</Link>
      </p>
      <h2>{event.title}</h2>
      <p>
        <SlCalender /> <span>{event.date}</span> <span>{event.time}</span>
      </p>
      <p>
        <FaLocationDot /> {event.location}
      </p>

      {event.capacity === 0 ? (
        <span>Booking full!!</span>
      ) : (
        <span>
          Available {event.capacity === 1 ? "seat" : "seats"}: {event.capacity}
        </span>
      )}

      <p>{event.description}</p>
      <div>
        <button
          type="button"
          onClick={() => handleBookEvent(event.id)}
          disabled={event.capacity === 0}
          title={event.capacity === 0 ? "This event is full right now!" : null}
        >
          Book Now
        </button>
        <button type="button" onClick={() => handleCancelBooking(event.id)}>
          Cancel Booking
        </button>
        <Link to={`/event/edit/${event.id}`}>
          <button type="button">Edit Event</button>
        </Link>
        <button type="button" onClick={() => handleDeleteEvent(event.id)}>
          Delete Event
        </button>
      </div>
    </div>
  );
};

export default EventDetails;
