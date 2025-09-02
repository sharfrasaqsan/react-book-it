# React Book-It

[![Live Demo](https://img.icons8.com/?size=100&id=UyjPlooIqDBC&format=png&color=000000)](https://react-book-it.vercel.app/)

A platform for event organizers and attendees to connect, discover, book, and manage events.

## Features and Functionality

*   **Event Discovery:** Browse a list of upcoming events on the homepage or the dedicated `/events` page.
*   **Event Booking:** Registered users can book events, subject to availability and event deadlines.
*   **User Authentication:** Users can register, log in, and log out. Authentication is handled using Firebase Authentication.
*   **Organizer Role:** Organizers can create and manage events.
*   **Profile Management:** Users can view and edit their profiles.
*   **Booking Management:** Users can view and manage their bookings on the `/my-bookings` page.
*   **Event Creation:** Organizers can create new events using the `/create` route.
*   **Event Editing:** Organizers can edit their events using the `/event/edit/:id` route.
*   **Event Deletion:** Organizers can delete their events from the event details page.
*   **Private Routes:**  Certain routes, such as `/profile`, `/my-bookings`, `/create`, and `/event/edit/:id` are protected and require user authentication.
*   **Real-time Updates:** Events and user data are fetched and updated using Firebase Firestore.
*   **Toast Notifications:** User-friendly notifications are displayed using `react-toastify` for actions like booking, registration, and login.
*   **Responsive Design:** The application is designed to be responsive and accessible on various devices.

## Technology Stack

*   **React:** A JavaScript library for building user interfaces.
*   **React Router:** A library for handling routing in React applications.
*   **Firebase:** A platform for building web and mobile applications, used for authentication and database functionalities.  Specifically, Firebase Authentication and Firestore.
*   **Bootstrap:** A CSS framework for building responsive and mobile-first websites.
*   **react-toastify:** For displaying toast notifications.
*   **date-fns:**  For date and time formatting and comparisons.
*   **sweetalert2:** For confirmation dialogs.
*   **Font Awesome:** A library for icons.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (>=16.0.0) - [https://nodejs.org/](https://nodejs.org/)
*   **npm** or **yarn:**  Package managers to install dependencies.
*   **Firebase Project:** You'll need a Firebase project set up with Authentication and Firestore enabled.  Obtain your Firebase configuration from your Firebase project settings.

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/sharfrasaqsan/react-book-it.git
    cd react-book-it
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Configure Firebase:**

    *   Create a `.env` file in the root directory of the project.
    *   Add your Firebase configuration to the `.env` file:

    ```
    REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
    REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"
    REACT_APP_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID"
    ```

    **Important:** Replace `"YOUR_API_KEY"`, `"YOUR_AUTH_DOMAIN"`, etc., with your actual Firebase configuration values.  These values can be found in your Firebase project settings under "Project Overview" -> "Add app" -> "Web".

4.  **Start the development server:**

    ```bash
    npm start  # or yarn start
    ```

    This will start the development server and open the application in your browser.  The application will typically be accessible at `http://localhost:3000`.

## Usage Guide

1.  **Register/Login:**
    *   Navigate to `/register` to create a new account as either an "Attendee" (User) or an "Organizer".  The `src/components/UserRegister.js` and `src/components/OrganizerRegister.js` files contain the registration forms.
    *   Navigate to `/login` to log in to an existing account.  The `src/pages/Login.js` file contains the login form.

2.  **Browse Events:**
    *   Visit the homepage (`/`) to see a list of recent events, or navigate to `/events` to view all events. The events are displayed using components like `src/components/RecentEventList.js` and `src/pages/Events.js`, which utilize the `src/components/Event.js` component for individual event cards.

3.  **Book an Event:**
    *   Click on an event to view its details on the `/event/:id` page. The `src/pages/EventDetails.js` file handles the display of event details.
    *   If you are logged in, you can book the event by clicking the "Book Now" button.  The `handleBookEvent` function in `src/context/DataContext.js` handles the booking logic.  The UI will disable the booking button if the event is full, closed or you already booked the event.

4.  **Manage Bookings:**
    *   Navigate to `/my-bookings` to view and manage your bookings. The `src/pages/MyBookings.js` file handles displaying the user's booked events. You can cancel bookings from here.

5.  **Create an Event (Organizer only):**
    *   If you are logged in as an organizer, navigate to `/create` to create a new event. The `src/pages/CreateEvent.js` file contains the event creation form.

6.  **Edit/Delete an Event (Organizer only):**
    *   If you are the organizer of an event, you can edit it by navigating to `/event/edit/:id`. The `src/pages/EditEvent.js` file handles event editing.
    *   You can delete your event from event details page. The `handleDeleteEvent` function in `src/context/DataContext.js` handles the delete logic.

7.  **Edit Profile:**
    *   Go to `/profile` to view your profile.
    *   Click on "Edit Profile" to go to `/profile/edit/:id`, to edit your user details.  The `src/pages/EditUser.js` handles the user details editing.

## API Documentation

This project uses Firebase Firestore as a backend, so there's no traditional API to document.  However, the `src/context/DataContext.js` file contains all the functions that interact with Firestore:

*   **Fetching Data:**
    *   `fetchEvents()`: Fetches all events from the "events" collection.
    *   `fetchUsers()`: Fetches all users from the "users" collection.
    *   `fetchBookings()`: Fetches all bookings from the "bookings" collection.

*   **Creating Data:**
    *   `handleCreateEvent(event)`: Creates a new event document in the "events" collection.
    *   User registration in `src/components/UserRegister.js` and `src/components/OrganizerRegister.js` create user documents in the "users" collection.
    *   `handleBookEvent(eventId)`: Creates a new booking document in the "bookings" collection.

*   **Updating Data:**
    *   `handleUpdateEvent(eventId, updatedEvent)`: Updates an event document in the "events" collection.
    *   `handleUpdateUser(userId, updatedUser)`: Updates a user document in the "users" collection. The password is not updated using this function. Please refer to the section on Password Update
*   **Password Update**
   *  The Password update occurs in  `src/pages/EditUser.js`. This is done by Firebase Authentication. The password update is only triggered when the user enters a new password. If no password is added the password update is skipped.

*   **Deleting Data:**
    *   `handleDeleteEvent(eventId)`: Deletes an event document from the "events" collection.
    *   `handleCancelBooking(eventId)`: Deletes a booking document from the "bookings" collection.

## Contributing Guidelines

Contributions are welcome! Here are the guidelines:

1.  **Fork the repository:**  Fork the repository to your GitHub account.
2.  **Create a new branch:**  Create a new branch for your feature or bug fix.
3.  **Make your changes:**  Implement your changes, ensuring that you follow the project's coding style and conventions.
4.  **Test your changes:**  Test your changes thoroughly to ensure they are working correctly.
5.  **Commit your changes:**  Commit your changes with clear and concise commit messages.
6.  **Push your changes:**  Push your changes to your forked repository.
7.  **Create a pull request:**  Create a pull request to the `main` branch of the original repository.
8.  **Code Review:**  Your pull request will be reviewed by the project maintainers.
9.  **Merge:** Once the review passes, your code will be merged into the main branch.

## License Information

This project does not currently have a specified license. All rights are reserved by the owner.

## Contact/Support Information

For questions, issues, or contributions, please contact sharfrasaqsan through GitHub.