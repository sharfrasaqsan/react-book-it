import { createContext, useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDialog } from "../utils/confirmDialog";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
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

  // Form State
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

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
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
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsers(data);
      } catch (err) {
        toast.error("Failed to fetch Users. " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Bookings
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "bookings"));
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBookings(data);
      } catch (err) {
        toast.error("Failed to fetch Bookings. " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Delete Event
  const handleDeleteEvent = async (eventId) => {
    const confirm = await confirmDialog({
      title: "Delete the event",
      text: "Are you sure you want to delete this event?",
    });

    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
      toast.success("Event deleted successfully.");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to delete event. " + err.message);
    }
  };

  // Book Event
  const handleBookEvent = async (eventId) => {
    if (!currentUser) {
      toast.error("Please login to book an event.");
      return;
    }

    // Check if user already booked event in bookings
    const alreadyBooked = bookings.find(
      (booking) =>
        booking.eventId === eventId && booking.userId === currentUser.id
    );

    // Check if user is already in event's bookedUsers list
    const alreadyBookedEvent = events.some(
      (event) =>
        event.id === eventId && event.bookedUsers?.includes(currentUser.id)
    );

    // Check if user's bookedEvents includes this event
    const alreadyBookedUser = users.some(
      (user) =>
        user.id === currentUser.id && user.bookedEvents?.includes(eventId)
    );

    if (alreadyBooked || alreadyBookedEvent || alreadyBookedUser) {
      toast.error("You have already booked this event.");
      return;
    }

    const event = events.find((e) => e.id === eventId);
    if (!event) {
      toast.error("Event not found.");
      return;
    }
    if (event.capacity <= 0) {
      toast.error("This event is fully booked.");
      return;
    }

    try {
      const newBooking = {
        userId: currentUser.id,
        eventId,
        bookedAt: format(new Date(), "yyyy-MM-dd hh:mm:ss a"),
      };

      // Add new booking doc
      const bookingDocRef = await addDoc(
        collection(db, "bookings"),
        newBooking
      );
      const newBookingWithId = { id: bookingDocRef.id, ...newBooking };
      setBookings((prev) => [...prev, newBookingWithId]);

      // Update event bookedUsers
      const updatedBookedUsers = event.bookedUsers
        ? [...event.bookedUsers, currentUser.id]
        : [currentUser.id];
      await updateDoc(doc(db, "events", eventId), {
        bookedUsers: updatedBookedUsers,
        capacity: event.capacity - 1,
      });

      // Update local events state
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? {
                ...e,
                bookedUsers: updatedBookedUsers,
                capacity: e.capacity - 1,
              }
            : e
        )
      );

      // Update user's bookedEvents
      const userToUpdate = users.find((user) => user.id === currentUser.id);
      if (!userToUpdate) {
        toast.error("User not found.");
        return;
      }

      const updatedBookedEvents = userToUpdate.bookedEvents
        ? [...userToUpdate.bookedEvents, eventId]
        : [eventId];

      await updateDoc(doc(db, "users", currentUser.id), {
        bookedEvents: updatedBookedEvents,
      });

      // Update local users state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, bookedEvents: updatedBookedEvents }
            : u
        )
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

    if (!confirm) return;

    try {
      const booking = bookings.find(
        (b) => b.userId === currentUser?.id && b.eventId === eventId
      );

      if (!booking) {
        toast.error("You have not booked this event.");
        return;
      }

      // Delete booking document
      await deleteDoc(doc(db, "bookings", booking.id));
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));

      // Update event's bookedUsers list
      const event = events.find((e) => e.id === eventId);
      if (!event) {
        toast.error("Event not found.");
        return;
      }

      const updatedBookedUsers = event.bookedUsers?.filter(
        (userId) => userId !== currentUser.id
      );

      await updateDoc(doc(db, "events", eventId), {
        bookedUsers: updatedBookedUsers,
        capacity: event.capacity + 1,
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? {
                ...e,
                bookedUsers: updatedBookedUsers,
                capacity: e.capacity + 1,
              }
            : e
        )
      );

      // Update user's bookedEvents list
      const userToUpdate = users.find((u) => u.id === currentUser.id);
      if (!userToUpdate) {
        toast.error("User not found.");
        return;
      }

      const updatedBookedEvents = userToUpdate.bookedEvents?.filter(
        (id) => id !== eventId
      );

      await updateDoc(doc(db, "users", currentUser.id), {
        bookedEvents: updatedBookedEvents,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id
            ? { ...u, bookedEvents: updatedBookedEvents }
            : u
        )
      );

      toast.success("Booking cancelled successfully.");
      navigate(-1);
    } catch (err) {
      toast.error("Failed to cancel booking. " + err.message);
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

export const useData = () => useContext(DataContext);
