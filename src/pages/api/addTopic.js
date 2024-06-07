import { sql } from '@vercel/postgres';
import Pusher from 'pusher';

const pusher = new Pusher({
    appId: process.env.APP_ID,
    key: process.env.NEXT_PUBLIC_KEY,
    secret: process.env.SECRET_KEY,
    cluster: "us2",
    useTLS: true
});

export default async function handler(req, res) {
    if(req.method === 'POST'){
        console.log(req.body);
        try{
            const waitingUsers = await sql`SELECT * FROM Topics WHERE userId != ${req.body.userId}`;
            if(waitingUsers.rows.length > 0){
                const matchedUser = waitingUsers.rows[0];
                const chatChannel = [req.body.userId, matchedUser.userid].sort().join('-');

                // Notify User A of the match via Pusher
                const userAPersonalChannel = `personal-${matchedUser.userid}`;
                pusher.trigger(userAPersonalChannel, 'matched', {
                    chatChannel: chatChannel,
                    recipientId: req.body.userId // Since User B is now the recipient for User A.
                });

                // Delete User A's entry from the Topics table
                await sql`DELETE FROM Topics WHERE userId=${matchedUser.userid}`;

                // Respond to User B with the match details
                return res.status(200).json({
                    status: "Match found",
                    chatChannel,
                    recipientId: matchedUser.userid  // Return the matched userId as recipientId for User B
                });
            }

            await sql`INSERT INTO Topics (userId, topics) VALUES (${req.body.userId}, ${req.body.topics})`;
            return res.status(200).json({ status: "Waiting for match" });
        } catch (error) {
            console.error("Error in /api/addTopic:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

