import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const Event = ({ event }) => {
  const { handleBookEvent } = useData();

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
      <button type="submit" onClick={() => handleBookEvent(event.id)}>
        Book Now
      </button>
    </div>
  );
};

export default Event;
