import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.NEXT_PUBLIC_KEY,
    secret: process.env.SECRET_KEY,
    cluster: "us2",
    useTLS: true
});

let usersWaiting = 0;
let usersInChat = 0;

export default function handler(req, res) {
  const { userId, status } = req.body;

  if (status === 'waiting') {
    usersWaiting += 1;
  } else if (status === 'inChat') {
    usersWaiting -= 1;
    usersInChat += 1;
  } else if (status === 'left') {
    usersInChat -= 1;
  }

  pusher.trigger('status-channel', 'status-update', {
    usersWaiting,
    usersInChat
  });

  res.status(200).json({ success: true });
}