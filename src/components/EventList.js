import { useData } from "../context/DataContext";
import Event from "../components/Event";

const EventList = () => {
  const { events, loading } = useData();

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {events.map((i) => (
            <Event key={i.id} event={i} />
          ))}
        </>
      )}
    </>
  );
};

export default EventList;
