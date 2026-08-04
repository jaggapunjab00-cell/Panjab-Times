import connectDB from '../../../lib/mongodb';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      // Fetch the last 100 messages, sorted chronologically (oldest to newest for chat flow)
      const messages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(100);
      
      return res.status(200).json({
        success: true,
        data: messages.reverse(), // Reverse to get oldest first for top-to-bottom reading
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { sender, content } = req.body;

      if (!sender || !sender.trim() || !content || !content.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Sender and content are required',
        });
      }

      const message = new Message({
        sender: sender.trim(),
        content: content.trim(),
      });

      await message.save();

      return res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
