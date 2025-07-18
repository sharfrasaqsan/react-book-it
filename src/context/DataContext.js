import { createContext, useContext, useEffect, useState } from "react";
import request from "../api/request";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Array State
  const [events, setEvents] = useState([]);

  // Boolean State
  const [loading, setLoading] = useState(false);

  // String State
  const [createFormData, setCreateFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  });

  // Navigation
  const navigate = useNavigate();

  // Fetch Event
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await request.get("/events");
        if (!res.data) return;
        setEvents(res.data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Create Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const newEvent = {
        title: createFormData.title,
        description: createFormData.description,
        date: createFormData.date,
        time: createFormData.time,
        location: createFormData.location,
        capacity: createFormData.capacity,
        createdAt: format(new Date(), "yyyy-MM-dd hh:mm:ss a"),
        organizerId: null,
        bookedUsers: [],
      };

      const res = await request.post("/events", newEvent);
      const newEvents = [...events, res.data];
      setEvents(newEvents);
      setCreateFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
      });
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    try {
      await request.delete(`/events/${id}`);
      if (!events) return;
      setEvents((prev) => prev.filter((i) => i.id !== id));
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // Update Event
  const handleUpdateEvent = async (id) => {
    try {
      const updatedEvent = {
        title: editFormData.title,
        description: editFormData.description,
        date: editFormData.date,
        time: editFormData.time,
        location: editFormData.location,
        capacity: editFormData.capacity,
      };

      const res = await request.patch(`/events/${id}`, updatedEvent);
      const updatedEvents = events.map((i) => (i.id === id ? res.data : i));
      setEvents(updatedEvents);
      navigate(`/event/${id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <DataContext.Provider
      value={{
        events,
        setEvents,
        loading,
        setLoading,
        handleCreateEvent,
        handleDeleteEvent,
        handleUpdateEvent,
        createFormData,
        setCreateFormData,
        editFormData,
        setEditFormData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
