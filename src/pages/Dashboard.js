import EventList from "../components/EventList";
import { useData } from "../context/DataContext";

const Dashboard = () => {
  const { currentUser } = useData();

  return (
    <>
      <h5>Welcome {currentUser.firstName}</h5>

      <EventList />
    </>
  );
};

export default Dashboard;
