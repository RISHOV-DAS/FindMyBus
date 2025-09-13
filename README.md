# Real-Time Bus Tracker API

A real-time bus tracking system that provides live bus locations, ETAs, and route information through a RESTful API and WebSocket interface.

## Features

- Real-time bus location tracking
- Live ETA calculations
- WebSocket support for instant updates
- Route information and details
- Support for multiple buses and routes

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Seed the database with sample data (optional):
   ```bash
   node seed/seed.js
   ```
5. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Bus Endpoints

#### Get All Active Buses on a Route
```http
GET /api/buses/live/{routeNumber}
```

**Response:**
```json
[
  {
    "busId": "bus123",
    "routeNumber": "101",
    "stopName": "Central Station",
    "lat": 12.9716,
    "lng": 77.5946,
    "eta": "5 min",
    "distance": "1.2 km"
  }
]
```

#### Get Single Bus Details
```http
GET /api/buses/live/{routeNumber}/{busId}
```

**Response:**
```json
{
  "busId": "bus123",
  "routeNumber": "101",
  "stopName": "Central Station",
  "lat": 12.9716,
  "lng": 77.5946,
  "eta": "5 min",
  "distance": "1.2 km"
}
```

#### Update Bus Location
```http
POST /api/buses/update
Content-Type: application/json

{
  "busId": "bus123",
  "routeNumber": "101",
  "lat": 12.9716,
  "lng": 77.5946
}
```

**Success Response:**
```json
{
  "_id": "...",
  "busId": "bus123",
  "routeNumber": "101",
  "lat": 12.9716,
  "lng": 77.5946,
  "isActive": true,
  "lastUpdated": "2023-05-15T10:30:00.000Z"
}
```

### Route Endpoints

#### Get All Routes
```http
GET /api/route
```

**Response:**
```json
[
  {
    "routeNumber": "101",
    "name": "Downtown Express",
    "stops": [
      {
        "name": "Central Station",
        "lat": 12.9716,
        "lng": 77.5946,
        "sequence": 1
      }
    ]
  }
]
```

#### Get Route by Number
```http
GET /api/route/{routeNumber}
```

**Response:**
```json
{
  "routeNumber": "101",
  "name": "Downtown Express",
  "stops": [
    {
      "name": "Central Station",
      "lat": 12.9716,
      "lng": 77.5946,
      "sequence": 1
    }
  ]
}
```

## WebSocket Events

The application supports real-time updates via WebSocket. Connect to `ws://localhost:5000` to receive live updates.

### Subscribing to Bus Updates
```javascript
const socket = io('http://localhost:5000');

// Subscribe to a specific bus
socket.emit('subscribeBus', 'bus123');

// Handle bus updates
socket.on('bus:update', (busData) => {
  console.log('Bus update:', busData);
});
```

### Subscribing to Route Updates
```javascript
// Subscribe to a specific route
socket.emit('subscribeRoute', '101');

// Handle route updates (e.g., when any bus on the route updates)
socket.on('bus:update', (busData) => {
  console.log('Bus on route updated:', busData);
});
```

## Error Handling

All API endpoints return appropriate HTTP status codes along with error messages in the following format:

```json
{
  "error": "Error message describing the issue"
}
```

## Testing

To test the application, you can use the included simulator:

```bash
node simulator.js
```

This will simulate bus movements and update their positions in real-time.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Quick start:
  - copy .env.example to .env and set MONGO_URI and GOOGLE_MAPS_API_KEY
  - npm install
  - npm run seed
  - npm start
  - npm run simulator (in another terminal) to simulate BUS101/BUS102 moving
