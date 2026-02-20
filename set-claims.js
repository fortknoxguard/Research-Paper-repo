const admin = require('firebase-admin');
admin.initializeApp(); 

async function setClaims() {
  let nextPageToken;
  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    nextPageToken = result.pageToken;

    for (const user of result.users) {
      try {
        await admin.auth().setCustomUserClaims(user.uid, { role: 'authenticated' });
        console.log(`Set claim for user: ${user.uid}`);
      } catch (err) {
        console.error(`Failed for ${user.uid}:`, err);
      }
    }
  } while (nextPageToken);
  console.log('Done for all users!');
}

setClaims().catch(console.error);
