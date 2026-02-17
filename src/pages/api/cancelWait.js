import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log(req.body);
        try {
            // Delete the user from the Topics table if they are waiting
            await sql`DELETE FROM Topics WHERE userId=${req.body.userId}`;
            return res.status(200).json({ status: "User removed from waiting list" });
        } catch (error) {
            console.error("Error in /api/cancelWait:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
