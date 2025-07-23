import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const MyEvents = () => {
  const { currentUser } = useAuth();
  const { events } = useData();

  const myEvents = events?.filter(
    (event) => event.organizerId === currentUser?.id
  );

  if (!events) return <p className="text-center mt-5">Loading...</p>;

  if (myEvents?.length === 0)
    return (
      <p className="text-center mt-5">You haven't created any events yet.</p>
    );

  return (
    <section>
      <div className="container mt-5 mb-5">
        <h2 className="mb-4 text-center">My Events</h2>

        <div className="row row-cols-1 row-cols-md-2 g-4">
          {myEvents.map((event) => (
            <div className="col" key={event.id}>
              <div className="card shadow-sm h-100">
                <Link
                  to={`/event/${event.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.createdAt}</p>
                    <p className="card-text">
                      {event.date} at {event.location}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyEvents;
