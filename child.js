const { exec } = require('child_process');

exec(`chrome --profile-directory="Default"  --remote-debugging-port=9222`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the command: ${error}`);
      return;
    }
    // Log the output of the command
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });