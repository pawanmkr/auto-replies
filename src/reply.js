import addLabel from "./addLabel.js";

async function reply(gmail, id, replyBody) {
    // the gmail-api endpoint to get the single message using ID with metadata included
    const details = await gmail.users.messages.get({
        id: id,
        userId: 'me',
        format: 'metadata',
    });
    const originalMessage = details.data;
    const originalHeaders = originalMessage.payload.headers;
    console.log(originalHeaders);

    /*
    * finding Required Headers in the headers Array, to compose the reply
    * this is what we need: From, To, Subject, and Message-Id from the original
    * message's header and then send these headers:
    * From, To, Subject, In-Reply-To, and References
    * we also need to encode the message body into base64 string before sending
    */
    const from = originalHeaders.find(
        header => header.name === 'From'
    ).value;

    const to = originalHeaders.find(
        (header) => header.name === 'To'
    ).value;

    const originalSubject = originalHeaders.find(
        (header) => header.name === 'Subject'
    ).value;

    const messageId = originalHeaders.find(
        header => header.name === 'Message-ID' || header.name === 'Message-Id'
    ).value;

    // adding Re: to the subject if not present
    const replySubject = originalSubject.startsWith('Re:') ? originalSubject : `Re: ${originalSubject}`;
    // the actual message which will be sent to the receiver
    // const replyBody = 'Hey, Sorry to inform you but i am on vacation right now! Would reply ASAP';

    /*
    * as discussed above these are the headers we need to send in reply, 
    * or it won't work correctly
    */
    const replyHeaders = {
        'From': to,
        'To': from,
        'Subject': replySubject,
        'In-Reply-To': messageId,
        'References': messageId,
    };

    // formatting message again including body
    const replyMessageParts = [
        ...Object.entries(replyHeaders).map(([key, value]) => `${key}: ${value}`),
        '',
        replyBody,
    ];

    // encoding the message into base64 string using Buffer
    const replyRaw = replyMessageParts.join('\n');
    const encodedMessage = Buffer.from(replyRaw)
        .toString('base64')
        .replace(/=+$/, '')
        .replace(/\//g, '_')
        .replace(/\+/g, '-');

    /* 
    * this is the send endpoint of GmailAPI that requires the user who is authorised
    * with the request body of the message
    */
    await gmail.users.messages.send({
        userId: 'me',
        resource: {
            threadId: originalMessage.threadId,
            raw: encodedMessage,
        },
    });

    // after sending the reply, we also need to add the label to the mail, to organize
    const updatedLabel = await addLabel(gmail, id);
    return updatedLabel;
}

export default reply;