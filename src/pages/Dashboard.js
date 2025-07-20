import EventList from "../components/EventList";
import { useData } from "../context/DataContext";

const Dashboard = () => {
  const { currentUser } = useData();

  return (
    <>
      <h2>Welcome {currentUser.firstName}</h2>

      <EventList />
    </>
  );
};

export default Dashboard;
