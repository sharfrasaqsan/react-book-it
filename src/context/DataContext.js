import { createContext, useContext, useEffect, useState } from "react";
import request from "../api/request";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDialog } from "../utils/confirmDialog";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Array State
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

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
  const [userFormData, setUserFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
        toast.error("Failed to fetch Events. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch Users
  useEffect(() => {
    const fetchingUsers = async () => {
      setLoading(true);
      try {
        const res = await request.get("/users");
        if (!res.data) return;
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to fetch Users. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchingUsers();
  }, []);

  // Fetch Bookings
  useEffect(() => {
    const fetchingBookings = async () => {
      setLoading(true);
      try {
        const res = await request.get("/bookings");
        if (!res.data) return;
        setBookings(res.data);
      } catch (err) {
        toast.error("Failed to fetch Bookings. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchingBookings();
  }, []);

  // Create Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (
      !createFormData.title ||
      !createFormData.description ||
      !createFormData.location ||
      !createFormData.capacity
    ) {
      return toast.error("Please fill in all the fields.");
    }

    // Check if date and time are valid
    const now = new Date();
    if (!createFormData.date || !createFormData.time) {
      return toast.error("Please select both date and time.");
    }
    // Combine date and time like: "2025-07-20T14:30"
    const eventDateTimeString = `${createFormData.date}T${createFormData.time}`;
    // Convert to a Date object
    const eventDateTime = new Date(eventDateTimeString);
    // Check if it's a valid date
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }
    // Compare with current date and time
    if (eventDateTime < now) {
      return toast.error("Event date and time must be in the future.");
    }

    // Check if capacity is greater than 0
    if (createFormData.capacity <= 0) {
      return toast.error("Capacity must be greater than 0.");
    }

    try {
      const newEvent = {
        title: createFormData.title,
        description: createFormData.description,
        location: createFormData.location,
        date: createFormData.date,
        time: createFormData.time,
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
      toast.success("Event created successfully.");
      navigate("/");
    } catch (err) {
      toast.error("Failed to create event. " + err.message);
    }
  };

  // Delete Event
  const handleDeleteEvent = async (id) => {
    const confirm = await confirmDialog({
      title: "Delete the event",
      text: "Are you sure you want to delete this event?",
    });

    if (confirm) {
      try {
        await request.delete(`/events/${id}`);
        if (!events) return;
        setEvents((prev) => prev.filter((i) => i.id !== id));
        toast.success("Event deleted successfully.");
        navigate("/");
      } catch (err) {
        toast.error("Failed to delete event. " + err.message);
      }
    }
  };

  // Update Event
  const handleUpdateEvent = async (id) => {
    if (
      !editFormData.title ||
      !editFormData.description ||
      !editFormData.location ||
      !editFormData.capacity
    ) {
      return toast.error("Please fill in all the fields.");
    }

    // Check if date and time are valid
    const now = new Date();
    if (!editFormData.date || !editFormData.time) {
      return toast.error("Please select both date and time.");
    }
    // Combine date and time like: "2025-07-20T14:30"
    const eventDateTimeString = `${editFormData.date}T${editFormData.time}`;
    // Convert to a Date object
    const eventDateTime = new Date(eventDateTimeString);
    // Check if it's a valid date
    if (isNaN(eventDateTime.getTime())) {
      return toast.error("Invalid date and time.");
    }
    // Compare with current date and time
    if (eventDateTime < now) {
      return toast.error("Event date and time must be in the future.");
    }

    // Check if capacity is greater than 0
    if (createFormData.capacity > 0) {
      return toast.error("Capacity must be greater than 0.");
    }

    const confirm = await confirmDialog({
      title: "Update the event",
      text: "Are you sure you want to update this event?",
    });

    if (confirm) {
      try {
        const updatedEvent = {
          title: editFormData.title,
          description: editFormData.description,
          date: editFormData.date,
          time: editFormData.time,
          capacity: Number(editFormData.capacity),
          location: editFormData.location,
          updatedAt: format(new Date(), "yyyy-MM-dd hh:mm:ss a"),
        };

        const res = await request.patch(`/events/${id}`, updatedEvent);
        const updatedEvents = events.map((i) => (i.id === id ? res.data : i));
        setEvents(updatedEvents);
        toast.success("Event updated successfully.");
        navigate(`/event/${id}`);
      } catch (err) {
        toast.error("Failed to update event. " + err.message);
      }
    }
  };

  //   For JSON-SERVER
  const currentUser = {
    id: "user001",
    firstName: "Mohamed",
    lastName: "Sharfras",
    email: "sharfrasaqsan@gmail.com",
    role: "user",
  };

  // Book Event
  const handleBookEvent = async (eventId) => {
    // check if user has already booked this event in bookings
    const alreadyBooked = bookings.find(
      (i) => i.eventId === eventId && i.userId === currentUser.id
    );

    // check if user has already booked this event in events
    const alreadyBookedEvent = events.some(
      // some() returns ture or false
      (i) => i.id === eventId && i.bookedUsers?.includes(currentUser.id)
    );

    // check if user has already booked this event in users
    const alreadyBookedUser = users.some(
      (i) => i.id === currentUser.id && i.bookedEvents?.includes(eventId)
    );

    if (alreadyBooked || alreadyBookedEvent || alreadyBookedUser) {
      toast.error("You have already booked this event.");
      return;
    }

    const event = events.find((i) => i.id === eventId);
    if (event.capacity === 0) {
      toast.error("This event is fully booked.");
      return;
    }

    try {
      const newBooking = {
        userId: currentUser.id,
        eventId: eventId,
        bookedAt: format(new Date(), "yyyy-MM-dd hh:mm:ss a"),
      };

      const res = await request.post("/bookings", newBooking);
      const newBBookings = [...bookings, res.data];
      setBookings(newBBookings);

      // check if event has booked users or not to update the event
      const event = events.find((event) => event.id === eventId);
      const updatedBookedUsers = event.bookedUsers
        ? [...event.bookedUsers, currentUser.id]
        : [...event.bookedUsers];

      // update event booked users
      const eventRes = await request.patch(`/events/${eventId}`, {
        bookedUsers: updatedBookedUsers,
      });
      const updatedEvents = events.map((i) =>
        i.id === eventId ? eventRes.data : i
      );
      setEvents(updatedEvents);

      // check if user has booked events or not to update the user
      const user = users.find((i) => i.id === currentUser.id);
      const updatedBookedEvents = user.bookedEvents
        ? [...user.bookedEvents, eventId]
        : [...user.bookedEvents];

      // update user booked events
      const userRes = await request.patch(`/users/${currentUser.id}`, {
        bookedEvents: updatedBookedEvents,
      });
      const updatedUsers = users.map((i) =>
        i.id === currentUser.id ? userRes.data : i
      );
      setUsers(updatedUsers);

      // update event capacity
      const eventCapacity = event.capacity - 1;
      const eventCapacityRes = await request.patch(`/events/${eventId}`, {
        capacity: eventCapacity,
      });
      setEvents(
        events.map((i) => (i.id === eventId ? eventCapacityRes.data : i))
      );

      toast.success("Event booked successfully.");
      navigate("/my-bookings");
    } catch (err) {
      toast.error("Failed to book event. " + err.message);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (eventId) => {
    const confirm = await confirmDialog({
      title: "Cancel Booking",
      text: "Are you sure you want to cancel this booking?",
    });

    if (confirm) {
      try {
        // Find the booking record
        const booking = bookings.find(
          (i) => i.userId === currentUser.id && i.eventId === eventId
        );

        if (!bookings.length) {
          toast.error("You have not booked any events.");
          return;
        }

        // Remove booking from bookings list
        await request.delete(`/bookings/${booking.id}`);
        setBookings(bookings.filter((i) => i.id !== booking.id));

        // Update event's bookedUsers list
        const event = events.find((i) => i.id === eventId);
        const updatedBookedUsers = event.bookedUsers?.filter(
          (userId) => userId !== currentUser.id
        );

        const eventRes = await request.patch(`/events/${eventId}`, {
          bookedUsers: updatedBookedUsers,
        });

        setEvents(events.map((i) => (i.id === eventId ? eventRes.data : i)));

        // Update user's bookedEvents list
        const user = users.find((i) => i.id === currentUser.id);
        const updatedBookedEvents = user.bookedEvents?.filter(
          (id) => id !== eventId
        );

        const userRes = await request.patch(`/users/${currentUser.id}`, {
          bookedEvents: updatedBookedEvents,
        });

        setUsers(
          users.map((i) => (i.id === currentUser.id ? userRes.data : i))
        );

        // Update event capacity
        const eventCapacity = event.capacity + 1;
        const eventCapacityRes = await request.patch(`/events/${eventId}`, {
          capacity: eventCapacity,
        });
        setEvents(
          events.map((i) => (i.id === eventId ? eventCapacityRes.data : i))
        );

        toast.success("Booking cancelled successfully.");
        navigate("/");
      } catch (err) {
        toast.error("Failed to cancel booking. " + err.message);
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        events,
        setEvents,
        bookings,
        setBookings,
        users,
        loading,
        setLoading,
        currentUser,
        createFormData,
        setCreateFormData,
        editFormData,
        setEditFormData,
        handleCreateEvent,
        handleDeleteEvent,
        handleUpdateEvent,
        handleBookEvent,
        handleCancelBooking,
        userFormData,
        setUserFormData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
