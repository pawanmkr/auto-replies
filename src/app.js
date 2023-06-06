import express from 'express';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import reply from './reply.js';

const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");
const SCOPES = [ // these are the permissions we need from Gmail App
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://mail.google.com/'
];

const app = express();
app.listen(8888, () => console.log("Application running on PORT:8888"));

// there is only one endpoint, as more than one is not required for this task
app.get('/', async (req, res) => {
  // google authentication part
  const auth = await authenticate({
    keyfilePath: CREDENTIALS_PATH,
    scopes: SCOPES
  });
  const gmail = google.gmail({ version: 'v1', auth }); // instance of gmail

  // this is the list of all mails which are unread and unreplied
  const unreadMails = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread -category:{promotions} -category:{updates} -category:{forums} -category:{social} -is:snoozed -is:chat'
  });

  // return if there are no unread mails
  if (unreadMails.data.resultSizeEstimate === 0) {
    res.send("No Unread mails found :)");
    return;
  }

  // array of all the unread messages, the messageId in exact words
  const threadsArr = unreadMails.data.messages.map(message => {
    return message.threadId;
  });

  // the promises array to store all the promises(mails which are to be replied)
  const promises = [];
  let count = 1; // count, just to check the progress

  for (const thread of threadsArr) {
    const delay = Math.floor(Math.random() * (120 - 45 + 1)) + 45;

    // here is the fun part, resolving all the replies with random delays
    const promise = new Promise((resolve) => {
      setTimeout(async () => {
        // this function is responsible for the reply logic
        const replyResult = await reply(gmail, thread);
        console.log(count++);
        resolve(replyResult);
      }, delay * 1000);
    });
    // pushing into the promises array earlier we created
    promises.push(promise);
  }

  await Promise.all(promises);
  res.sendStatus(200);
});