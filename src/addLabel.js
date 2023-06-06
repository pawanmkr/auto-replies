/*
 * this function is full responsible for creating, and updating the label
 * i.e. creating a label if it doesn't exist already, in case of new user
 * and then add the replied mails into it 
 * 
 * to do so, we first need to list all the available lables, to get the labelId
 * of the 'Auto Replies' label and if not found then create new.
 * after then, tag mails with that label
 */
async function addLabel(gmail, messageId) {
    let labels = await gmail.users.labels.list({
        userId: 'me'
    });
    labels = labels.data.labels;

    // finding 'Auto Replies' label in the array of label
    let labelId = await labels.find((label) => label.name === 'Auto Replies');

    if (!labelId) { // if not available, create one
        console.log('Label Not Found! Creating new...');
        /* 
         * this endpoint provided by GmailAPI create the label for user
         * it takes the authorised user and the request body which consists of
         * the name of the label and it's visibility, we can pass more properties
         * but it isn't required for now
         */
        const newLabel = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
                name: 'Auto Replies',
                labelListVisibility: 'labelShow',
            },
        });
        labelId = newLabel.data.id; // extract labelId from the response JSON
    }
    else { // if label was found from the lables array then extract the Id
        labelId = labelId.id;
    }
    /* 
     * another endpoint to tag mails with labels, it takes auth. user and
     * Whatever we want to update in the message, in this case we want to tag and untag
     * some labels, so we passed the array of labels for the same
     */
    const updatedLabel = await gmail.users.messages.modify({
        id: messageId,
        userId: 'me',
        requestBody: {
            addLabelIds: [labelId],
            removeLabelIds: ['INBOX']
        }
    });
    return updatedLabel;
}

export default addLabel;