import { useData } from "../context/DataContext";

const MyBookings = () => {
  const { bookings } = useData();

  return (
    <div>
      <ol>
        {bookings.map((i) => (
          <li key={i.id}>{i.title}</li>
        ))}
      </ol>
    </div>
  );
};

export default MyBookings;
