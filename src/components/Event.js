import { Link } from "react-router-dom";

const Event = ({ event }) => {
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
      <button type="submit">Book Now</button>
    </div>
  );
};

export default Event;
