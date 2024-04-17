const express = require('express');
const app = express();

app.get('/stream', (req, res) => {
  // Set appropriate headers for streaming response
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send an initial response
  res.write('{"message": "Streaming API started"}\n');

  // Simulate streaming by sending data at intervals
  const intervalId = setInterval(() => {
    const data = {
      timestamp: new Date().toISOString(),
      value: Math.random()
    };

    // Send the data as a JSON string
    res.write(JSON.stringify(data) + '\n');
  }, 1000);

  // Handle connection close from the client
  req.on('close', () => {
    console.log('Client connection closed');
    clearInterval(intervalId);
    res.end();
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});