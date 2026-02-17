import { userHeartbeats } from '@/lib/userHeartbeats';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const now = Date.now();
  const ONLINE_THRESHOLD = 10000; // 10 seconds

  const usersOnline = Object.values(userHeartbeats).filter(
    (lastSeen) => now - lastSeen < ONLINE_THRESHOLD
  ).length;
  
  res.status(200).json({ usersOnline });
}