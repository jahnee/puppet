const { spawn } = require('child_process');

// Path to your server script
const serverScript = 'server.js';

// Spawn the server process
const serverProcess = spawn('node', [serverScript]);

// Listen for stdout data
serverProcess.stdout.on('data', (data) => {
  console.log(`Server stdout: ${data}`);
});

// Listen for stderr data
serverProcess.stderr.on('data', (data) => {
  console.error(`Server stderr: ${data}`);
});

// Listen for the close event
serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});