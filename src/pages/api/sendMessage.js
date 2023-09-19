import {postData} from "../../../action";

export default async function handler(req, res){
    if(req.method === 'POST'){
        console.log(req.body)
        const {message, senderId, recipientId, channel} = req.body
        try {
            postData(message, senderId, recipientId, channel)

            return res.status(200).json("Message sent successfully")
        }catch(error){
            console.error('Error sending message:', error);
            return res.status(500).json('Message sending failed');
        }
    }else{
        return response.status(405).json({ error: 'Method not allowed' });
    }

    }