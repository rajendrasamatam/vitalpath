import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';
import {
  ref,
  set,
  onValue,
  off,
} from 'firebase/database';
import { firestore, database } from '../config/firebase';
import { EmergencyAlert } from '../types';

interface Vehicle {
  id: string;
  driverId: string;
  location: {
    lat: number;
    lng: number;
  };
  type: 'ambulance' | 'fire_engine';
  status: 'available' | 'busy';
  currentMissionId?: string;
}

export const emergencyService = {
  // Create emergency alert
  async createEmergencyAlert(
    alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>
  ): Promise<string> {
    const alertData = {
      ...alert,
      timestamp: Date.now(),
      status: 'pending' as const,
    };

    const docRef = await addDoc(collection(firestore, 'emergencyAlerts'), alertData);

    // Also store in Realtime Database for immediate notifications
    await set(ref(database, `alerts/${docRef.id}`), alertData);

    // Assign nearest driver
    this.assignNearestDriver(docRef.id, alert.type, alert.location);

    return docRef.id;
  },

  // Assign nearest driver
  async assignNearestDriver(
    alertId: string,
    vehicleType: 'ambulance' | 'fire',
    location: { lat: number; lng: number }
  ) {
    const vehiclesQuery = query(
      collection(firestore, 'vehicles'),
      where('type', '==', vehicleType === 'ambulance' ? 'ambulance' : 'fire_engine'),
      where('status', '==', 'available')
    );

    const vehiclesSnapshot = await getDocs(vehiclesQuery);
    let nearestVehicle: Vehicle | null = null;
    let minDistance = Infinity;

    vehiclesSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const vehicle: Vehicle = {
        id: docSnap.id,
        driverId: data.driverId,
        location: data.location,
        type: data.type,
        status: data.status,
        currentMissionId: data.currentMissionId,
      };

      const distance = this.calculateDistance(location, vehicle.location);

      if (distance < minDistance) {
        minDistance = distance;
        nearestVehicle = vehicle;
      }
    });

    if (nearestVehicle) {
      // Update emergency alert with assigned driver
      await updateDoc(doc(firestore, 'emergencyAlerts', alertId), {
        assignedDriverId: nearestVehicle.driverId,
        status: 'assigned',
      });

      // Mark vehicle as busy
      await updateDoc(doc(firestore, 'vehicles', nearestVehicle.id), {
        status: 'busy',
        currentMissionId: alertId,
      });

      // Notify driver in Realtime DB
      await set(ref(database, `driverNotifications/${nearestVehicle.driverId}`), {
        alertId,
        type: vehicleType,
        location,
        timestamp: Date.now(),
      });
    }
  },

  // Calculate distance using Haversine formula
  calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
    const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) *
        Math.cos(point2.lat * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Traffic signal control
  async controlTrafficSignal(
    signalId: string,
    status: 'red' | 'green' | 'yellow',
    isOverride = false
  ) {
    const signalData = {
      status,
      isOverridden: isOverride,
      lastUpdated: Date.now(),
    };

    await set(ref(database, `trafficSignals/${signalId}`), signalData);
  },

  // Real-time alert listener
  subscribeToAlerts(callback: (alerts: EmergencyAlert[]) => void) {
    const alertsRef = ref(database, 'alerts');

    onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alerts = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        callback(alerts);
      } else {
        callback([]);
      }
    });

    return () => off(alertsRef);
  },

  // Real-time vehicle location listener
  subscribeToVehicleLocation(
    vehicleId: string,
    callback: (location: { lat: number; lng: number }) => void
  ) {
    const locationRef = ref(database, `vehicleLocations/${vehicleId}`);

    onValue(locationRef, (snapshot) => {
      const location = snapshot.val();
      if (location) {
        callback(location);
      }
    });

    return () => off(locationRef);
  },
};
