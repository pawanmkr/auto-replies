import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

async function filterMessages(gmail, gmailResponse, res) {
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

export async function unreadMailCount(req, res) {
  const credentials = req.body.credentials;
  const oauth2Client = new OAuth2Client();
  oauth2Client.setCredentials(credentials);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const gmailResponse = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread -category:{promotions} -category:{updates} -category:{forums} -category:{social} -is:snoozed -is:chat'
  });
  await filterMessages(gmail, gmailResponse, res);
}