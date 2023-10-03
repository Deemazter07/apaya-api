require('dotenv').config();

const express = require("express");
const app = express();
const { ENV } = require("./utils/env");
const apiRoutes = require('./routes');

const PORT = ENV.PORT

// Middleware
app.use(express.json());
// Add any other middleware you need, like authentication middleware

// Routes
app.use('/', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});