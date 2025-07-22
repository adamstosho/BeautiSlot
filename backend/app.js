const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.json');

const app = express();

app.use(helmet());
const allowedOrigins = process.env.CORSWHITELIST ? process.env.CORSWHITELIST.split(',') : [];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, 
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
const providerRoutes = require('./routes/provider.routes');
app.use('/api/providers', providerRoutes);
const clientRoutes = require('./routes/client.routes');
app.use('/api', clientRoutes);
const bookingRoutes = require('./routes/booking.routes');
app.use('/api/bookings', bookingRoutes);
const reviewRoutes = require('./routes/review.routes');
app.use('/api/reviews', reviewRoutes);
const providerBookingRoutes = require('./routes/providerBooking.routes');
app.use('/api/provider', providerBookingRoutes);
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app; 