 Patient Medication Reminder App

Overview

The Patient Medication Reminder App is a React-based web application designed to help patients manage their medication schedules. It provides a user-friendly interface for adding, viewing, and deleting medication reminders, and sends notifications when it's time to take a medication.

Features

- Add medications with name, dosage, and time
- View list of all medications
- Delete medications
- Real-time clock display (Central Time)
- Automatic notifications when it's time to take a medication
- Test notification feature
- Firebase integration for real-time data storage

Technologies Used

- React
- TypeScript
- Firebase (Firestore)
- Tailwind CSS

Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/patient-medication-reminder.git
   cd patient-medication-reminder
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Firestore in your project
   - Copy your Firebase configuration (found in Project Settings)
   - Create a `.env` file in the root directory of the project
   - Add your Firebase configuration to the `.env` file as follows:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```

4. Start the development server:
   ```
   npm start
   ```

5. Open http://localhost:3000 in your browser to view the app.

Usage

- To add a medication: Fill out the form with the medication name, dosage, and time, then click "Add Medication".
- To delete a medication: Click the "Delete" button next to the medication you want to remove.
- To test notifications: Click the "Test Notification" button.

Deployment

To build the app for production:

```
npm run build
```

This creates a `build` folder with a production build of the app. You can then deploy this to your preferred hosting service.

Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

License

This project is open source and available under the [MIT License](LICENSE).
