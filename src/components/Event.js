import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const Event = ({ event }) => {
  const { handleBookEvent } = useData();

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <>
        <Link to={`/event/${event.id}`}>
          <h3>{event.title}</h3>

          <p>{event.location}</p>
          <p>
            <span>{event.date}</span> <span>{event.time}</span>
          </p>
        </Link>
      </>

      {event.capacity === 0 ? (
        <span>Booking full!!</span>
      ) : (
        <span>
          {event.capacity < 10
            ? `Only ${event.capacity} ${
                event.capacity === 1 ? "seat" : "seats"
              } left!`
            : null}
        </span>
      )}

      <button
        type="submit"
        onClick={() => handleBookEvent(event.id)}
        disabled={event.capacity === 0}
        title={event.capacity === 0 ? "This event is full right now!" : null}
      >
        Book Now
      </button>
    </div>
  );
};

export default Event;
