// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Use the port provided by the environment or default to 3000

// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
