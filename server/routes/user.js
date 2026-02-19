import express from 'express';
import multer from 'multer';
import {
  register,
  login,
  validUser,
  googleAuth,
  logout,
  searchUsers,
  updateInfo,
  getUserById,
  uploadProfilePic, // NAYA IMPORT
} from '../controllers/user.js';
import { Auth } from '../middleware/user.js';

const router = express.Router();

// ============= MULTER CONFIGURATION =============
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  },
});

// ============= EXISTING ROUTES =============
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/valid', Auth, validUser);
router.get('/auth/logout', Auth, logout);
router.post('/api/google', googleAuth);
router.get('/api/user?', Auth, searchUsers);
router.get('/api/users/:id', Auth, getUserById);
router.patch('/api/users/update/:id', Auth, updateInfo);

// ============= NAYA ROUTE - PROFILE PIC UPLOAD =============
router.post(
  '/api/users/upload-profile-pic',
  Auth,
  upload.single('profilePic'),
  uploadProfilePic
);

export default router;