import express from 'express';
import morgan from 'morgan';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import reply from './reply.js';
import { WebSocket, WebSocketServer } from "ws";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './models/user.js';
import mongoose from 'mongoose';

dotenv.config();
const port = process.env.PORT || 8888;
const jwt_secret = process.env.JWT_SECRET_KEY;

const app = express();
app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const server = app.listen(port, () => console.log(`Application running on PORT:${port}`));
const wss = new WebSocketServer({ server });

mongoose.connect('mongodb+srv://pawan:mint@automail.kfm6mu6.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.error('Error connecting to db:', error);
  });

// Function to send data to all connected clients
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

function generateToken(user) {
  console.log("generating jwt token...");
  const payload = {
    user_id: user._id,
    email: user.email
  };
  const token = jwt.sign(payload, jwt_secret, { expiresIn: '1h' });
  return token;
}
function generateStrongPassword(email, access_token) {
  console.log("generating strong password...");
  const password = email + access_token;
  return password;
}

app.post('/api/v1/user/login', async (req, res) => {
  const { first_name, last_name, email, access_token } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("user already exists");
    const token = generateToken(existingUser);
    console.log("sending jwt token to client...");
    return res.json({ token });
  }
  const newUser = new User({
    first_name,
    last_name,
    email
  });
  const password = generateStrongPassword(email, access_token);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  newUser.password = hashedPassword;

  const saved = await newUser.save();
  if (saved) {
    console.log("new user added to db");
  }
  const token = generateToken(newUser);
  console.log("sending jwt token to client...");
  res.json({ token });
});

const filterMessages = async (gmail, gmailResponse, res) => {
  // when 0 unread mails
  if (gmailResponse.data.resultSizeEstimate === 0) {
    res.send({ data: null });
    return;
  }
  const messages = gmailResponse.data.messages.map(message => { return message.id })
  console.log(messages);

  let filteredMessages = new Set();
  const msgWithThreads = [];

  for (const message of messages) {
    let email = await gmail.users.messages.get({
      id: message,
      userId: 'me',
    });
    email = email.data;

    /* // using lable:inbox
    if (email.data.labelIds.includes('INBOX')) {
      filteredMessages.push(message);
    } */

    /* const isReply = headers.find(header => header.name === 'In-Reply-To')
    console.log(isReply); */
    // both if statements are doing same thing
    /* 
      if (isReply && isReply !== undefined) {
        filteredMessages.push(message);
      } 
    */

    if (email.id === email.threadId) {
      filteredMessages.add(email.id);
    }
    else {
      msgWithThreads.push(email.threadId);
    }
  }
  // remove messages which are in relation with threads
  for (const thread of msgWithThreads) {
    if (filteredMessages.has(thread)) {
      console.log(`filteredMessages hash ${thread} and now it's being deleted.`);
      filteredMessages.delete(thread);
    }
  }
  // set() to array
  filteredMessages = Array.from(filteredMessages);
  res.send({
    data: {
      count: filteredMessages.length,
      messages: filteredMessages,
    }
  })
}

app.post('/api/v1/mails/count', async (req, res) => {
  const credentials = req.body.credentials;
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials(credentials);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const gmailResponse = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread -category:{promotions} -category:{updates} -category:{forums} -category:{social} -is:snoozed -is:chat'
  });
  await filterMessages(gmail, gmailResponse, res);
});

app.post('/api/v1/mails/reply', async (req, res) => {
  const { credentials, messages, replyMsg } = req.body;
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials(credentials);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  // the promises array to store all the promises(mails which are to be replied)
  const promises = [];
  let count = 0; // count, just to check the progress

  console.log(messages);
  for (const message of messages) {
    const delay = Math.floor(Math.random() * (60 - 25 + 1)) + 25;
    // here is the fun part, resolving all the replies with random delays
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        // this function is responsible for the reply logic
        const replyResult = await reply(gmail, message, replyMsg);
        console.log(count++);
        broadcast({ count: count });
        resolve(replyResult);
      }, delay * 500);
    });
    // pushing into the promises array earlier we created
    promises.push(promise);
  }
  const response = await Promise.all(promises);
  res.send(response);
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');

  // Send a welcome message to the connected client
  ws.send(JSON.stringify({ message: 'Connected to WebSocket server.' }));
});