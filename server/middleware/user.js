import jwt from 'jsonwebtoken';
import user from '../models/userModel.js';

export const Auth = async (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      console.log('❌ No authorization header');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Extract token - "Bearer TOKEN" format
    // ✅ FIX: Use index [1] for browser (Bearer TOKEN)
    let token = req.headers.authorization.split(' ')[1];
    
    console.log('🔑 Token received (first 20 chars):', token?.substring(0, 20)); // DEBUG
    
    if (!token) {
      console.log('❌ Token is empty');
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Check if it's a JWT token (short) or Google token (long)
    if (token.length < 500) {
      // ============= REGULAR JWT TOKEN =============
      console.log('🔐 Verifying JWT token...');
      
      const verifiedUser = jwt.verify(token, process.env.SECRET);
      
      console.log('✅ JWT verified for user ID:', verifiedUser.id);
      
      const rootUser = await user
        .findOne({ _id: verifiedUser.id })
        .select('-password');
      
      if (!rootUser) {
        console.log('❌ User not found in database');
        return res.status(401).json({ error: 'User not found' });
      }
      
      console.log('✅ User found:', rootUser.email);
      
      req.token = token;
      req.rootUser = rootUser;
      req.rootUserId = rootUser._id;
    } else {
      // ============= GOOGLE TOKEN =============
      console.log('🔐 Verifying Google token...');
      
      let data = jwt.decode(token);
      req.rootUserEmail = data.email;
      
      const googleUser = await user
        .findOne({ email: req.rootUserEmail })
        .select('-password');
      
      if (!googleUser) {
        console.log('❌ Google user not found in database');
        return res.status(401).json({ error: 'User not found' });
      }
      
      console.log('✅ Google user found:', googleUser.email);
      
      req.rootUser = googleUser;
      req.token = token;
      req.rootUserId = googleUser._id;
    }
    
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(401).json({ error: 'Authentication failed' });
  }
};