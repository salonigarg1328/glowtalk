import Message from '../models/messageModel.js';
import user from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import cloudinary from '../config/cloudinary.js';

export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;

  try {
    // ✅ Safe message object - crash nahi hoga
    const messageData = {
      sender: req.rootUserId,
      chatId,
    };

    // ✅ Text message sirf tab add karo jab ho
    if (message && message.trim()) {
      messageData.message = message.trim();
    }

    // ✅ File sirf tab process karo jab ho
    if (req.file) {
      console.log('📎 File received:', req.file.originalname);

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'chat-app-files',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      messageData.file = {
        url: result.secure_url,
        type: req.file.mimetype,
        name: req.file.originalname,
        size: req.file.size,
      };

      console.log('☁️ File uploaded:', result.secure_url);
    }

    // ✅ Kuch toh hona chahiye
    if (!messageData.message && !messageData.file) {
      return res.status(400).json({ error: 'Message or file required' });
    }

    let msg = await Message.create(messageData);

    msg = await (
      await msg.populate('sender', 'name profilePic email')
    ).populate({
      path: 'chatId',
      select: 'chatName isGroup users',
      model: 'Chat',
      populate: {
        path: 'users',
        select: 'name email profilePic',
        model: 'User',
      },
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });

    res.status(200).send(msg);
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};