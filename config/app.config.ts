export default () => ({
  // Auth Service Configuration
  authService: {
    mongoUri:
      process.env.AUTH_SERVICE_MONGO_URI ||
      'mongodb://localhost:27017/uber-microservice-auth-service',
    port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
  },

  // Passenger Service Configuration
  passengerService: {
    mongoUri:
      process.env.PASSENGER_SERVICE_MONGO_URI ||
      'mongodb://localhost:27017/uber-microservice-passenger-service',
    port: parseInt(process.env.PASSENGER_SERVICE_PORT || '3002', 10),
  },

  // Rider Service Configuration
  riderService: {
    mongoUri:
      process.env.RIDER_SERVICE_MONGO_URI ||
      'mongodb://localhost:27017/uber-microservice-rider-service',
    port: parseInt(process.env.RIDER_SERVICE_PORT || '3003', 10),
  },

  // Main Application Configuration
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
  },
});
