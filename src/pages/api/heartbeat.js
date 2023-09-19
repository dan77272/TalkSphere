import { userHeartbeats } from "@/lib/userHeartbeats";

export default (req, res) => {
    if (req.method === 'POST') {
      const userId = req.body.userId;
      userHeartbeats[userId] = Date.now();
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(405).end();
    }
  };