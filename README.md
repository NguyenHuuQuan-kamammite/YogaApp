
## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase:
   - The app is already configured to use an existing Firebase project
   - Firebase configuration is located in `src/firebase/config.js`
   - No changes needed if using the existing project (for teacher use)
   - To use a different Firebase project, update the configuration in `src/firebase/config.js`

4. Start the development server:
   ```
   npm start
   ```

5. Use the Expo Go app on your mobile device to scan the QR code or run on an emulator

### For User (Using Existing Firebase Project)



1. The app is already configured to connect to the my Firebase project
2. No Firebase account or project setup is required
3. All existing data (classes, bookings, etc.) will be visible in the app
4. You can browse classes, make bookings, and interact with all features
5. User credentials for testing:
   - Register a new account or use existing test accounts
   - All data will be shared with the student who provided you the app

**Note**: The Firebase configuration in `src/firebase/config.js` contains the project credentials that allow access to the database. This is normal for Firebase web applications.

