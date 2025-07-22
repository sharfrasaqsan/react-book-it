import { createContext, useContext, useEffect, useState } from "react";
import request from "../api/request";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDialog } from "../utils/confirmDialog";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Array State
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Boolean State
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [editUserFormData, setEditUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  // Navigation
  const navigate = useNavigate();

  // Fetch Event
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const docRef = await getDocs(collection(db, "events"));
        const data = docRef.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (!data) return;
        setEvents(data);
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
        const docRef = await getDocs(collection(db, "users"));
        const data = docRef.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (!data) return;
        setUsers(data);
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
        const docRef = await getDocs(collection(db, "bookings"));
        const data = docRef.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        if (!data) return;
        setBookings(data);
      } catch (err) {
        toast.error("Failed to fetch Bookings. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchingBookings();
  }, []);

  // Delete Event
  const handleDeleteEvent = async (eventId) => {
    const confirm = await confirmDialog({
      title: "Delete the event",
      text: "Are you sure you want to delete this event?",
    });

    if (confirm) {
      try {
        await deleteDoc(collection(db, "events"), { eventId });
        setEvents((prev) => prev.filter((i) => i.id !== eventId));
        toast.success("Event deleted successfully.");
        navigate("/");
      } catch (err) {
        toast.error("Failed to delete event. " + err.message);
      }
    }
  };

  // Book Event
  const handleBookEvent = async (eventId) => {
    if (!currentUser) {
      toast.error("Please login to book an event.");
      return;
    }

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
        setUsers,
        loading,
        setLoading,
        currentUser,
        setCurrentUser,
        createFormData,
        setCreateFormData,
        editFormData,
        setEditFormData,
        handleDeleteEvent,
        handleBookEvent,
        handleCancelBooking,
        userFormData,
        setUserFormData,
        editUserFormData,
        setEditUserFormData,
        navigate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
