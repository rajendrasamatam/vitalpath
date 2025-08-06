# VitalRoute - Emergency Response System

A comprehensive web-based emergency response system with three role-based interfaces for efficient emergency management.

## Features

### 🚨 Public Dashboard
- Emergency alert creation (Ambulance/Fire Engine)
- GPS-based location detection
- Real-time alert status tracking
- Emergency request history

### 🚑 Driver Dashboard (Ambulance/Fire Engine)
- Mission notifications and acceptance
- GPS navigation and routing
- Hospital selection for ambulances
- Real-time location tracking
- Traffic signal awareness

### 👨‍💼 Admin Dashboard
- System overview and statistics
- Live vehicle tracking map
- Traffic signal control
- Comprehensive system logs
- Emergency overrides

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore + Realtime Database
- **Maps**: Google Maps API (configured via .env)
- **Routing**: React Router

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# App Configuration
VITE_APP_NAME=VitalRoute
VITE_APP_VERSION=1.0.0
```

### 2. Firebase Setup

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication with Email/Password
3. Create Firestore database
4. Enable Realtime Database
5. Add your domain to authorized domains

### 3. Required Firebase Collections

Create these collections in Firestore:

#### `users` collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  role: "admin" | "public" | "ambulance_driver" | "fire_driver",
  name: "User Name",
  isOnline: true,
  vehicleId: "vehicle_id", // for drivers
  location: {
    lat: 37.7749,
    lng: -122.4194
  }
}
```

#### `emergencyAlerts` collection
```javascript
{
  id: "alert_id",
  type: "ambulance" | "fire",
  location: {
    lat: 37.7749,
    lng: -122.4194,
    address: "123 Main St, San Francisco, CA"
  },
  timestamp: 1234567890,
  status: "pending" | "assigned" | "en_route" | "arrived" | "completed",
  assignedDriverId: "driver_id",
  userId: "user_id",
  description: "Emergency description"
}
```

#### `vehicles` collection
```javascript
{
  id: "vehicle_id",
  type: "ambulance" | "fire_engine",
  driverId: "driver_id",
  location: {
    lat: 37.7749,
    lng: -122.4194
  },
  status: "available" | "busy" | "en_route" | "offline",
  currentMissionId: "alert_id"
}
```

### 4. Demo Users

Create these test users in Firebase Authentication:

```
Admin: admin@vitalroute.com / password123
Public User: user@vitalroute.com / password123
Ambulance Driver: amb1@vitalroute.com / password123
Fire Driver: fire1@vitalroute.com / password123
```

### 5. Google Maps Setup

1. Get Google Maps API key from Google Cloud Console
2. Enable these APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
3. Add your domain to API key restrictions

## System Architecture

### Real-time Communication
- Firebase Realtime Database for instant notifications
- Live vehicle tracking updates
- Traffic signal status synchronization

### Emergency Flow
1. Public user creates emergency alert
2. System finds nearest available driver
3. Driver receives notification and accepts mission
4. Route optimization with traffic signal control
5. Mission completion and logging

### Traffic Signal Integration
- Geofencing for automatic signal control
- Manual override capabilities for admins
- ESP32 integration ready (simulated in demo)

## Development

```bash
npm install
npm run dev
```

## Deployment

The application is ready for deployment to:
- Vercel
- Netlify
- Firebase Hosting

Make sure to set environment variables in your deployment platform.

## Production Considerations

1. **Security Rules**: Implement proper Firestore security rules
2. **Rate Limiting**: Add rate limiting for emergency alerts
3. **Monitoring**: Set up error tracking and performance monitoring
4. **Backup**: Configure database backups
5. **Scaling**: Consider Cloud Functions for complex operations

## License

MIT License - Built for emergency services efficiency and public safety.