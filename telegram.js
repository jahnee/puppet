async function sendAlert(){
const axios = require('axios');

// Replace 'YOUR_BOT_TOKEN' with your bot's token obtained from BotFather
const botToken = '7113510326:AAE6o8oa6p1EcuZke2THfDpkILgdRr5EOrQ';

// Replace 'CHAT_ID' with the ID of the chat where you want to send the message
const chatId = '-1002099329026';
const currentTime = new Date().toLocaleTimeString();

// Message to send
const messageText = `Hello, The Monitored App experience Problem at ${currentTime}, please do manual testing!`;

// URL for the Telegram Bot API's sendMessage method
const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

// Data object containing the message details
const data = {
  chat_id: chatId,
  text: messageText
};

// Send the message using axios
axios.post(apiUrl, data)
  .then(response => {
    //console.log('Message sent:', response.data);
    return response.data;
  })
  .catch(error => {
    console.error('Error sending message:', error.message);
  });
}

async function sendSuccess(){
  const axios = require('axios');
  
  // Replace 'YOUR_BOT_TOKEN' with your bot's token obtained from BotFather
  const botToken = '7113510326:AAE6o8oa6p1EcuZke2THfDpkILgdRr5EOrQ';
  
  // Replace 'CHAT_ID' with the ID of the chat where you want to send the message
  const chatId = '-1002099329026';
  const currentTime = new Date().toLocaleTimeString();
  
  // Message to send
  const messageText = `Hello, The Monitored App run successfuly at ${currentTime}`;
  
  // URL for the Telegram Bot API's sendMessage method
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  // Data object containing the message details
  const data = {
    chat_id: chatId,
    text: messageText
  };
  
  // Send the message using axios
  axios.post(apiUrl, data)
    .then(response => {
      //console.log('Message sent:', response.data);
    })
    .catch(error => {
      console.error('Error sending message:', error.message);
    });
  }
module.exports = {
	sendAlert: sendAlert,
  sendSuccess: sendSuccess
};
//sendAlert()