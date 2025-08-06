export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'public' | 'ambulance_driver' | 'fire_driver';
  name: string;
  isOnline?: boolean;
  vehicleId?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyAlert {
  id: string;
  type: 'ambulance' | 'fire';
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  timestamp: number;
  status: 'pending' | 'assigned' | 'en_route' | 'arrived' | 'completed';
  assignedDriverId?: string;
  userId: string;
  description?: string;
  patientPickedUp?: boolean;
  hospitalDestination?: Hospital;
}

export interface Vehicle {
  id: string;
  type: 'ambulance' | 'fire_engine';
  driverId: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'available' | 'busy' | 'en_route' | 'offline';
  currentMissionId?: string;
}

export interface TrafficSignal {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'red' | 'green' | 'yellow';
  isOverridden: boolean;
  lastUpdated: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  specialties: string[];
  emergencyCapacity: number;
}