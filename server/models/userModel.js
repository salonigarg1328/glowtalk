import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: 'Available',
    },
    profilePic: {
      type: String,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    // ✅ Check both SECRET and JWT_SECRET
    const secret = process.env.SECRET || process.env.JWT_SECRET;
    
    if (!secret) {
      console.error('❌ JWT secret not found in environment variables!');
      throw new Error('JWT secret not configured');
    }
    
    let token = jwt.sign(
      { id: this._id, email: this.email },
      secret,
      {
        expiresIn: '24h',
      }
    );

    console.log('✅ Token generated for user:', this.email);
    return token;
  } catch (error) {
    console.error('❌ Error while generating token:', error.message);
    throw error; // Re-throw to handle in controller
  }
};

const userModel = mongoose.model('User', userSchema);
export default userModel;