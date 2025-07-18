import { Link, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { SlCalender } from "react-icons/sl";
import { FaLocationDot } from "react-icons/fa6";

const EventDetails = () => {
  const { events, handleDeleteEvent, handleBookEvent } = useData();

  const { id } = useParams();

  const event = events.find((i) => i.id === id);

  return (
    <div>
      {!event ? (
        <p>No Event available here!</p>
      ) : (
        <>
          <h2>{event.title}</h2>
          <p>
            <SlCalender /> <span>{event.date}</span> <span>{event.time}</span>
          </p>
          <p>
            <FaLocationDot /> {event.location}
          </p>
          <p>Available seats: {event.capacity}</p>
          <p>{event.description}</p>
          <div>
            <button onClick={() => handleBookEvent(event.id)}>Book Now</button>
            <button>Cancel Booking</button>
            <Link to={`/event/edit/${event.id}`}>
              <button>Edit Event</button>
            </Link>
            <button onClick={() => handleDeleteEvent(event.id)}>
              Delete Event
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EventDetails;
