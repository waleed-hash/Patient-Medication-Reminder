import React, { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

interface Medication {
  id?: string;
  name: string;
  dosage: string;
  time: string;
}

const DEBUG = true; // Set this to false in production

const App: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', time: '' });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastNotificationTime, setLastNotificationTime] = useState<string | null>(null);

  const formatTimeForDisplay = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false, 
      timeZone: 'America/Chicago' 
    });
  }, []);

  const formatTimeForComparison = useCallback((date: Date) => {
    const padZero = (num: number) => num.toString().padStart(2, '0');
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
  }, []);

  const fallbackNotification = useCallback((med: Medication) => {
    alert(`Time to take ${med.name} - ${med.dosage}`);
  }, []);

  const sendNotification = useCallback((med: Medication) => {
    if (DEBUG) console.log("Attempting to send notification for:", med.name);
    if ("Notification" in window) {
      if (DEBUG) console.log("Notification API is supported");
      if (Notification.permission === "granted") {
        if (DEBUG) console.log("Notification permission is granted");
        try {
          new Notification("Medication Reminder", {
            body: `Time to take ${med.name} - ${med.dosage}`,
          });
          if (DEBUG) console.log("Notification sent successfully for", med.name);
        } catch (error) {
          console.error("Error sending notification:", error);
          fallbackNotification(med);
        }
      } else {
        if (DEBUG) console.log("Notification permission is not granted. Current status:", Notification.permission);
        Notification.requestPermission().then(permission => {
          if (DEBUG) console.log("Notification permission after request:", permission);
          if (permission === "granted") {
            sendNotification(med);
          } else {
            fallbackNotification(med);
          }
        });
      }
    } else {
      if (DEBUG) console.log("This browser does not support notifications");
      fallbackNotification(med);
    }
  }, [fallbackNotification]);

  const checkMedications = useCallback((now: Date) => {
    const currentTimeStr = formatTimeForComparison(now);
    if (DEBUG) console.log("Checking medications at:", currentTimeStr);
    medications.forEach(med => {
      if (DEBUG) console.log(`Comparing medication ${med.name} time: ${med.time} with current time: ${currentTimeStr}`);
      if (med.time === currentTimeStr) {
        if (DEBUG) console.log("Time match found for:", med.name);
        sendNotification(med);
        setLastNotificationTime(currentTimeStr);
      }
    });
  }, [medications, sendNotification, formatTimeForComparison]);

  useEffect(() => {
    if (DEBUG) console.log("Initial notification permission:", Notification.permission);
    const requestNotificationPermission = async () => {
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (DEBUG) console.log("Notification permission status after request:", permission);
        if (permission !== "granted") {
          alert("Please allow notifications to receive medication reminders.");
        }
      }
    };
    requestNotificationPermission();

    const unsubscribe = onSnapshot(collection(db, 'medications'), (snapshot) => {
      const medicationData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medication));
      setMedications(medicationData);
    });

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      checkMedications(now);
    }, 1000); // Check every second for more precise notifications

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, [checkMedications]);

  const addMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'medications'), newMedication);
    setNewMedication({ name: '', dosage: '', time: '' });
  };

  const deleteMedication = async (id: string) => {
    await deleteDoc(doc(db, 'medications', id));
  };

  const testNotification = () => {
    const now = new Date();
    const testMed: Medication = { 
      id: 'test-' + Date.now(),
      name: "Test Med", 
      dosage: "10mg", 
      time: formatTimeForComparison(now)
    };
    sendNotification(testMed);
    console.log("Test notification triggered for time:", testMed.time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Medication Reminder</h1>
          <div className="mb-6 text-center">
            <p className="text-4xl font-bold text-purple-600">{formatTimeForDisplay(currentTime)}</p>
            <p className="text-sm text-gray-500 mt-2">Central Time (CT)</p>
            {lastNotificationTime && (
              <p className="text-sm text-blue-500 mt-2">Last notification sent at: {lastNotificationTime}</p>
            )}
          </div>

          <form onSubmit={addMedication} className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="Medication name"
              value={newMedication.name}
              onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="text"
              placeholder="Dosage"
              value={newMedication.dosage}
              onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
              type="time"
              value={newMedication.time}
              onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:from-purple-700 hover:to-pink-700 transform hover:-translate-y-1 hover:shadow-lg">
              Add Medication
            </button>
          </form>

          <button 
            onClick={testNotification} 
            className="w-full mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:from-green-500 hover:to-blue-600 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Test Notification
          </button>

          <div className="space-y-4">
            {medications.map((med) => (
              <div key={med.id} className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{med.name}</h2>
                <p className="text-gray-600">Dosage: {med.dosage}</p>
                <p className="text-gray-600">Time: {med.time}</p>
                {med.time === formatTimeForComparison(currentTime) && (
                  <p className="text-green-600 font-bold mt-2">Time to take your medication!</p>
                )}
                <button 
                  onClick={() => med.id && deleteMedication(med.id)} 
                  className="mt-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out hover:from-red-600 hover:to-orange-600 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
