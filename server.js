require('dotenv').config();

const express = require("express");
const app = express();
const { ENV } = require("./utils/env");
const apiRoutes = require('./routes');
const path = require('path');

const PORT = ENV.PORT

// reading public folder
app.use(express.static(path.resolve('./public')));

app.use(express.json());

// Routes
app.use('/', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});