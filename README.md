# 🌟 GlowTalk

A beautiful real-time chat application with a stunning purple-pink gradient theme, built with the MERN stack.

## ✨ Features

- 💬 **Real-time Messaging** - Instant message delivery powered by Socket.io
- 📁 **File Sharing** - Upload and share images and files seamlessly
- 🔐 **Authentication** - Secure login with Email/Password and Google OAuth
- 🔔 **Live Notifications** - Get notified of new messages instantly
- 👤 **User Profiles** - Customizable profiles with bio and profile pictures
- 🎨 **Beautiful UI** - Purple-pink gradient theme with smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔍 **User Search** - Find and connect with other users easily

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **Socket.io Client** - Real-time communication
- **React Router** - Navigation
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket implementation
- **JWT** - Authentication
- **Cloudinary** - File storage
- **Bcrypt.js** - Password hashing

## 🚀 Live Demo

**Frontend:** [https://glowtalk.vercel.app](https://glowtalk.vercel.app)

**Backend API:** [https://glowtalk-api.onrender.com](https://glowtalk-api.onrender.com)

## 🏃‍♀️ Running Locally

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/salonigarg1328/glowtalk.git
cd glowtalk
```

2. **Install dependencies**

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd clients
npm install
```

3. **Environment Variables**

Create `.env` file in `server/` directory:
```env
PORT=8000
URL=your_mongodb_connection_string
SECRET=your_jwt_secret
CLIENT_ID=your_google_client_id
BASE_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

Create `.env` file in `clients/` directory:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

4. **Run the application**

Backend (from `server/` directory):
```bash
npm start
```

Frontend (from `clients/` directory):
```bash
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

## 📁 Project Structure

```
glowtalk/
├── clients/                 # Frontend React app
│   ├── public/
│   ├── src/
│   │   ├── apis/           # API service functions
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store & slices
│   │   └── utils/          # Utility functions
│   └── package.json
│
└── server/                  # Backend Node.js app
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    ├── middleware/         # Custom middleware
    ├── mongoDB/            # Database connection
    └── package.json
```
    
## 🎨 Color Palette

- **Primary Purple:** `#7c3aed`
- **Mid Purple:** `#a855f7`
- **Pink:** `#ec4899`
- **Light Backgrounds:** `#fdf4ff`, `#faf5ff`, `#f3e8ff`

## 🔑 Key Learnings

- Implementing real-time features with WebSockets
- Managing complex application state with Redux Toolkit
- Secure authentication with JWT and OAuth
- File upload and cloud storage integration
- Full-stack application deployment
- Responsive UI design with TailwindCSS

## 🚀 Deployment

### Frontend (Vercel)
- Framework: Create React App
- Build Command: `CI=false npm run build`
- Install Command: `npm install --legacy-peer-deps`
- Root Directory: `clients`

### Backend (Render)
- Runtime: Node.js
- Build Command: `npm install`
- Start Command: `npm start`
- Root Directory: `server`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the MIT License.

## 👩‍💻 Author

**Saloni Garg**

- GitHub: [@salonigarg1328](https://github.com/salonigarg1328)
- LinkedIn: https://www.linkedin.com/in/salonigarg13/

## 🙏 Acknowledgments

- Icons from Lucide React
- Inspiration from modern chat applications
- Color scheme inspired by purple-pink gradients

---

⭐ If you like this project, please give it a star on GitHub!
