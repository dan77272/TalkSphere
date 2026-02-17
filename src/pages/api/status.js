import {usersWaiting, usersInChat} from './updateStatus'

export default function handler(req, res) {
    res.status(200).json({ usersWaiting, usersInChat });
  }