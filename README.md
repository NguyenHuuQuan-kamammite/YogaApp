# Yoga Class Booking App

A React Native mobile application for browsing and booking yoga classes. Built with Expo and Firebase.

## Features

### 🔐 Authentication
- Email/password registration and login
- Secure authentication with Firebase Auth
- Automatic session management

### 🧘‍♀️ Class Browsing
- View all available yoga classes
- Search by class type, day of week, or time
- Real-time data from Firebase Firestore
- Pull-to-refresh functionality

### 🛒 Shopping Cart
- Add multiple classes to cart
- View cart contents and total price
- Remove items from cart
- Batch checkout for multiple bookings

### 📋 Booking Management
- View all your bookings
- Cancel active bookings
- Booking status tracking (Active/Cancelled)
- Detailed booking information

### 🔍 Advanced Search
- Search by teacher name
- Filter by day of week
- Filter by time of day
- Real-time search results

## Tech Stack

- **React Native** with Expo
- **Firebase** (Authentication, Firestore)
- **React Navigation** (Stack & Bottom Tabs)
- **Context API** (State management)

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Shopping cart state
├── screens/            # App screens
│   ├── AuthScreen.js   # Login/Register
│   ├── HomeScreen.js   # Class listing
│   ├── CartScreen.js   # Shopping cart
│   └── MyBookingsScreen.js # User bookings
├── services/           # Firebase service functions
│   └── firebaseService.js
└── utils/              # Utility functions
```

## Firebase Collections

### courses
- id: Course ID
- capacity: Maximum attendees
- classtype: Type of yoga class
- dayOfWeek: Day of the week
- description: Course description
- durationMinutes: Class duration
- price: Price per class
- time: Class time

### instances
- id: Instance ID
- comments: Additional comments
- courseId: Reference to course
- date: Class date
- teacherId: Reference to teacher

### teachers
- id: Teacher ID
- bio: Teacher biography
- email: Teacher email
- name: Teacher name
- phone: Teacher phone
- photoUri: Teacher photo URL

### bookings
- id: Booking ID
- customerId: Customer Firebase UID
- instanceId: Reference to class instance
- courseId: Reference to course
- bookingDate: When booking was made
- status: 'active' or 'cancelled'

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Update the Firebase configuration in `src/services/firebaseService.js`

4. Start the development server:
   ```
   npm start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code or run on an emulator

## License

This project is licensed under the MIT License.
