import express from 'express';
import morgan from 'morgan';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import reply from './reply.js';
import { WebSocket, WebSocketServer } from "ws";
import dotenv from 'dotenv';
import User from './models/user.js';
import mongoose from 'mongoose';
import path from 'path';
// import router from "./routes.js";
// import broadcast from './websocket.js';

dotenv.config({
  path: path.join(process.cwd(), '.env')
});
const port = process.env.PORT || 8888;

const app = express();
app.use(morgan('tiny'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use('/api/v1', router);

export const server = app.listen(port, () => console.log(`Application running on PORT:${port}`));
const wss = new WebSocketServer({ server });

mongoose.connect(process.env.MONGO_DB_STRING, {
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

app.post('/api/v1/user/login', async (req, res) => {
  const { first_name, last_name, email, access_token } = req.body;
  // todo: server-side validation with access_token is pending yet

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("user already exists");
    return res.json({ token: access_token });
  }
  const newUser = new User({
    first_name,
    last_name,
    email
  });
  await newUser
    .save()
    .then((result) => {
      console.log("New User Saved: ", result);
    })
    .catch(error => console.error(error.message));
  res.json({ token: access_token });
});

const filterMessages = async (gmail, gmailResponse, res, totalReplied) => {
  // when 0 unread mails
  if (gmailResponse.data.resultSizeEstimate === 0) {
    res.send({
      data: {
        count: 0,
        total: totalReplied,
        messages: []
      }
    });
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
    console.log(email)
    email = email.data;
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
      total: totalReplied,
      messages: filteredMessages,
    }
  })
}

app.post('/api/v1/mails/count', async (req, res) => {
  const credentials = req.body.credentials;
  const client = new OAuth2Client();
  client.setCredentials(credentials);
  const email = await verify(client).catch(console.error);
  const gmail = google.gmail({ version: 'v1', auth: client });
  // todo: check for automail label also to skip those which are earlier replied by automail
  const gmailResponse = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread -category:{promotions} -category:{updates} -category:{forums} -category:{social} -is:snoozed -is:chat'
  });
  let totalReplied = 0;
  await User.findOne({ email: email })
    .then(user => {
      if (user) {
        totalReplied = user.replied_total;
      }
    })
    .catch(error => console.error(error.message))
  await filterMessages(gmail, gmailResponse, res, totalReplied);
});

async function verify(client) {
  const tokenInfo = await client.getTokenInfo(
    client.credentials.access_token
  );
  return tokenInfo.email;
}

app.post('/api/v1/mails/reply', async (req, res) => {
  const { credentials, messages, replyMsg } = req.body;
  const client = new OAuth2Client();
  client.setCredentials(credentials);
  const email = await verify(client).catch(console.error);
  const gmail = google.gmail({ version: 'v1', auth: client });
  // the promises array to store all the promises(mails which are to be replied)
  const promises = [];
  let count = 0; // count, just to check the progress

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
      }, delay * 300);
    });
    // pushing into the promises array earlier we created
    promises.push(promise);
  }
  await Promise.all(promises);
  await User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        await User.updateOne({ email: email }, { replied_total: user.replied_total + count })
          .then(
            res.send({
              message: "Successfully replied to all your mails!",
              totalReplied: user.replied_total + count
            })
          )
      }
    })
    .catch(error => console.error(error.message))
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected.');
  // Send a welcome message to the connected client
  ws.send(JSON.stringify({ message: 'Connected to WebSocket server.' }));
});

app.post('/api/v1/reply/option', async (req, res) => {
  const { option, credentials } = req.body;

});