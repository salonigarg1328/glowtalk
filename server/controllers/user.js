import user from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import cloudinary from '../config/cloudinary.js';

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already Exits' });
    const fullname = firstname + ' ' + lastname;
    const newuser = new user({ email, password, name: fullname });
    const token = await newuser.generateAuthToken();
    await newuser.save();
    res.json({ message: 'success', token: token });
  } catch (error) {
    console.log('Error in register ' + error);
    res.status(500).send(error);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const valid = await user.findOne({ email });
    if (!valid) {
      return res.status(200).json({ message: 'User dont exist' });
    }
    const validPassword = await bcrypt.compare(password, valid.password);
    if (!validPassword) {
      res.status(200).json({ message: 'Invalid Credentials' });
    } else {
      const token = await valid.generateAuthToken();
      await valid.save();
      res.cookie('userToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: token, status: 200 });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const validUser = async (req, res) => {
  try {
    console.log('🔍 Validating user ID:', req.rootUserId);
    
    const validuser = await user
      .findOne({ _id: req.rootUserId })
      .select('-password');
    
    if (!validuser) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'user is not valid' });
    }
    
    console.log('✅ User validated:', validuser.email);
    
    res.status(201).json({
      user: validuser,
      token: req.token,
    });
  } catch (error) {
    console.log('❌ Error in validUser:', error);
    res.status(500).json({ error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID,
    });
    const { email_verified, email, name, picture } = verify.payload;
    if (!email_verified) res.json({ message: 'Email Not Verified' });
    const userExist = await user.findOne({ email }).select('-password');
    if (userExist) {
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ token: tokenId, user: userExist });
    } else {
      const password = email + process.env.CLIENT_ID;
      const newUser = await user({
        name: name,
        profilePic: picture,
        password,
        email,
      });
      await newUser.save();
      res.cookie('userToken', tokenId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: 'User registered Successfully', token: tokenId });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log('error in googleAuth backend' + error);
  }
};

export const logout = (req, res) => {
  req.rootUser.tokens = req.rootUser.tokens.filter((e) => e.token != req.token);
};

export const searchUsers = async (req, res) => {
  try {
    console.log('🔍 Search request - Query:', req.query.search, 'User:', req.rootUserId);

    const searchQuery = req.query.search;
    
    if (!searchQuery || searchQuery.trim() === '') {
      return res.status(200).json([]);
    }

    const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    const search = {
      $or: [
        { name: { $regex: escapedQuery, $options: 'i' } },
        { email: { $regex: escapedQuery, $options: 'i' } },
      ],
    };

    const users = await user
      .find(search)
      .find({ _id: { $ne: req.rootUserId } })
      .select('-password');

    console.log('✅ Search complete - Found:', users.length, 'users');

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed',
      message: error.message 
    });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const selectedUser = await user.findOne({ _id: id }).select('-password');
    res.status(200).json(selectedUser);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const updateInfo = async (req, res) => {
  const { id } = req.params;
  const { bio, name } = req.body;
  try {
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { name, bio },
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log('📸 Profile pic upload request for user:', userId);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Upload to Cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'chat-app-profiles',
          transformation: [{ width: 300, height: 300, crop: 'fill' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    console.log('☁️ Uploaded to Cloudinary:', result.secure_url);

    // Update user in database
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log('✅ Profile pic updated in database for:', updatedUser.email);

    res.json({
      success: true,
      profilePicUrl: result.secure_url,
      user: updatedUser, // ✅ Return full updated user data
      message: 'Profile picture updated successfully',
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    });
  }
};