import Pusher from "pusher";

export function postData(messageData, userId, recipientId, channel) {
    console.log(channel)
  const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.NEXT_PUBLIC_KEY,
    secret: process.env.SECRET_KEY,
    cluster: "us2",
    useTLS: true
  });

  const eventData = {
    messageData,
    senderId: userId
  };

  pusher.trigger(channel, 'new-message', eventData);
}


