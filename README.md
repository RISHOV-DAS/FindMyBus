# Real-Time Bus Tracker API

A real-time bus tracking system that provides live bus locations, ETAs, and route information through a RESTful API and WebSocket interface. Built with Node.js, Express, MongoDB, and Socket.IO.

## ✨ Features

- 🚌 Real-time bus location tracking
- ⏱️ Live ETA calculations using Haversine formula
- 🌐 WebSocket support for instant updates
- 🗺️ Route information and details
- 🔄 Support for multiple buses and routes
- 🚦 Next stop prediction
- 📍 Live position tracking
- 🔄 Automatic database updates

## 🚀 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.IO
- **Geospatial Calculations**: Custom Haversine implementation
- **Environment**: Dotenv for configuration
- **HTTP Client**: Axios for external API calls

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5.0 or higher)
- npm (v8.0 or higher) or yarn

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/real-time-bus-tracker.git
   cd real-time-bus-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/bus_tracker
   PORT=5000
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key_optional
   ```

4. Seed the database with sample data:
   ```bash
   node seed/seed.js
   ```
   This will create a sample route (Route 101) with 4 stops and 2 active buses.

5. Start the server:
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000`

## 🚏 Project Structure

```
.
├── config/               # Configuration files
│   └── db.js            # Database connection
├── controllers/         # Route controllers
│   ├── busController.js # Bus-related operations
│   └── routeController.js # Route operations
├── models/              # Mongoose models
│   ├── Bus.js          # Bus model
│   └── Route.js        # Route model
├── routes/              # API routes
│   ├── bus.js          # Bus endpoints
│   └── route.js        # Route endpoints
├── seed/               # Database seeding
│   └── seed.js         # Sample data
├── utils/              # Utility functions
│   ├── eta.js          # ETA calculations
│   └── haversine.js    # Distance calculations
├── .gitignore          # Git ignore file
├── package.json        # Project dependencies
├── README.md           # This file
├── server.js           # Main server file
└── simulator.js        # Bus simulation script
```

## 🌐 API Endpoints

### 🚌 Bus Endpoints

#### Get All Active Buses on a Route
```http
GET /api/buses/live/{routeNumber}
```

**Response:**
```json
[
  {
    "busId": "BUS101",
    "routeNumber": "101",
    "routeName": "Route 101",
    "stopName": "Stop A",
    "lat": 22.5726,
    "lng": 88.3639,
    "eta": "5 mins (approx)",
    "distance": "1.23 km",
    "nextStopName": "Stop B"
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
  "busId": "BUS101",
  "routeNumber": "101",
  "routeName": "Route 101",
  "stopName": "Stop A",
  "lat": 22.5726,
  "lng": 88.3639,
  "eta": "5 mins (approx)",
  "distance": "1.23 km",
  "nextStopName": "Stop B"
}
```

#### Update Bus Location
```http
POST /api/buses/update
Content-Type: application/json

{
  "busId": "BUS101",
  "routeNumber": "101",
  "stopName": "Stop A",
  "nextStopName": "Stop B",
  "lat": 22.5726,
  "lng": 88.3639
}
```

**Success Response:**
```json
{
  "_id": "...",
  "busId": "BUS101",
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
