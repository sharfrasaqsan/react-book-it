# 🎉 Event Manager Web App

A full-stack event management platform built with **React**, **Firebase**, and **Tailwind CSS**. It allows users to register, book events, and manage their profiles, while organizers can create, edit, and delete events in real time.

---

## 🚀 Live Demo

[Visit the App]([https://your-deployment-link.com](https://react-book-it.vercel.app/))  

---

## 📌 Features

### 🔐 Authentication

- Firebase Authentication
- Role-based access (Attendee & Organizer)
- Persistent login

### 👥 User Roles

- **Attendee**
  - Register and login
  - View all events
  - Book and cancel bookings
  - View booked events
- **Organizer**
  - Register and login
  - Create new events
  - Edit or delete owned events
  - View attendees

### 🗓️ Events

- Create events with:
  - Title, description, date, time, location, capacity
- Real-time updates using Firestore
- Dynamic UI rendering based on event status (booked/full)

### 🛆 Firebase Services Used

- Firestore (real-time database)
- Firebase Auth (user management)
- Firebase Hosting (optional)

---

## 🥯 Test Accounts

> You can use the following test accounts to explore both user and organizer functionality:

### 👤 Attendee Accounts

| Email                                              | Password  | First Name | Last Name |
| -------------------------------------------------- | --------- | ---------- | --------- |
| testuser1@gmail.com                                | testuser1 | Ayaan      | Silva     |
| testuser2@gmail.com                                | testuser2 | Dilan      | Fernando  |
| testuser3@gmail.com                                | testuser3 | Nimesha    | Perera    |

### 🧑‍💼 Organizer Accounts

| Email                                              | Password   | First Name | Last Name   |
| -------------------------------------------------- | ---------- | ---------- | ----------- |
| organizer1@gmail.com                               | organizer1 | Kasun      | Jayawardena |
| organizer2@gmail.com                               | organizer2 | Harsha     | Weerasinghe |
| organizer3@gmail.com                               | organizer3 | Amaya      | Rodrigo     |

> Note: Roles are defined in Firestore under the `users` collection.

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend/Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **State Management**: React Context API
- **Form Handling**: useState, controlled components
- **Notifications**: React-Toastify

---

## 📂 Folder Structure

```
src/
│
├── components/          # Reusable UI components
├── pages/               # Route-based pages (Home, Event Details, etc.)
├── context/             # Context for auth and data (e.g., AuthContext, DataContext)
├── services/            # Firebase configurations and helpers
├── utils/               # Helper functions (e.g., date formatters)
├── App.jsx
└── main.jsx
```

---

## ⚙️ Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/your-username/event-manager.git
cd event-manager
```

2. **Install Dependencies**

```bash
npm install
```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Firestore and Authentication (Email/Password)
   - Get your Firebase config and replace in `src/firebase.js`

```js
// src/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  ...
};
```

4. **Run the Project**

```bash
npm run dev
```

---

## 🔐 Firebase Firestore Structure (Example)

```
users/
  uid123/
    firstName: "Ayaan"
    lastName: "Silva"
    role: "attendee"

events/
  eventId456/
    title: "AI & Web Summit"
    bookedUsers: [uid123]
```

---

## 📌 Future Improvements

- Add search, filter & sort functionality
- Pagination for event lists
- Role-based dashboards
- Email notifications
- Admin panel

---

## 📧 Contact

If you have any questions or feedback, feel free to reach out.

**Developer:** Mohamed Sharfras  
**Email:** sharfrasaqsan@gmail.com  
**GitHub:** [@yourusername](https://github.com/yourusername)

---

> Built with ❤️ using React & Firebase
