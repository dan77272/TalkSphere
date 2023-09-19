// Inside /pages/api/userLeaving.js
import Pusher from 'pusher';

// You might want to move the Pusher instance creation to a separate utility file
// so that it can be reused across multiple files.
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.NEXT_PUBLIC_KEY,
  secret: process.env.SECRET_KEY,
  cluster: 'us2',
  useTLS: true
});

export default (req, res) => {
    if (req.method === 'POST') {
      const userId = req.body.userId;
      const chatChannel = req.body.channel;  // Get the chatChannel from the request
  
      // If there's a chatChannel, notify the other user
      if (chatChannel) {
        // We're sending a message on the shared chatChannel.
        pusher.trigger(chatChannel, 'user-left', {
          leaverId: userId
        });
      }
  
      console.log(`User with ID ${userId} has left`);
  
      res.status(200).json({ status: 'User marked as left' });
    } else {
      res.status(405).end();
    }
  };

