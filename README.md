# 🚀 TDA Website - Full Stack Web Application

![TDA Logo](./frontend/public/logo.png)

A modern, full-stack web application for the TDA (Technology Development Association) organization, built with React.js frontend and Node.js backend.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the Application](#-running-the-application)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Admin Panel](#-admin-panel)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🌐 Public Website
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Events Management** - Display upcoming and past events
- **News & Updates** - Latest organization news and announcements
- **Contact Forms** - Multiple contact forms with validation
- **Modern UI/UX** - Dark theme with cyan/blue gradient accents

### 🔐 Admin Panel
- **Secure Authentication** - JWT-based login system
- **Team Management** - Add, edit, delete team members
- **Event Management** - Create and manage events with image uploads
- **News Management** - Publish and manage news articles
- **File Uploads** - Cloudinary integration for image storage
- **Form Submissions** - View and manage contact form submissions
- **Dashboard Analytics** - Overview of website statistics

### 🔧 Technical Features
- **RESTful API** - Well-structured backend with Express.js
- **Database** - MongoDB with Mongoose ODM
- **File Uploads** - Cloudinary integration for images
- **Authentication** - JWT tokens with secure middleware
- **Validation** - Comprehensive input validation
- **Error Handling** - Robust error handling and logging
- **CORS Configuration** - Secure cross-origin resource sharing

## 🛠 Tech Stack

### Frontend
- **React.js 19** - User interface library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Vercel** - Hosting platform
- **MongoDB Atlas** - Cloud database
- **Git** - Version control
- **ESLint** - Code linting
- **Nodemon** - Development server

## 📁 Project Structure

```
tda_website/
├── frontend/                 # React.js Frontend
│   ├── public/              # Static assets
│   │   ├── logo.png         # TDA logo
│   │   └── vite.svg         # Vite icon
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   │   ├── Hero.jsx     # Hero section component
│   │   │   └── Navbar.jsx   # Navigation component
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin panel pages
│   │   │   ├── About.jsx    # About page
│   │   │   ├── Events.jsx   # Events page
│   │   │   ├── Home.jsx     # Homepage
│   │   │   ├── Login.jsx    # Login page
│   │   │   ├── News.jsx     # News page
│   │   │   ├── OurJourney.jsx # Journey page
│   │   │   ├── Team.jsx     # Team page
│   │   │   └── Work.jsx     # Work page
│   │   ├── context/         # React contexts
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── services/        # API services
│   │   │   └── api.js       # API configuration
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── .env                 # Environment variables
│   ├── package.json         # Dependencies and scripts
│   ├── tailwind.config.js   # Tailwind configuration
│   ├── vite.config.js       # Vite configuration
│   └── vercel.json          # Vercel deployment config
│
├── backend/                  # Node.js Backend
│   ├── middleware/          # Custom middleware
│   │   └── auth.js          # Authentication middleware
│   ├── models/              # Database models
│   │   ├── User.js          # User model
│   │   ├── TeamMember.js    # Team member model
│   │   ├── Event.js         # Event model
│   │   ├── News.js          # News model
│   │   └── FormSubmission.js # Form submission model
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── team.js          # Team management routes
│   │   ├── events.js        # Event management routes
│   │   ├── news.js          # News management routes
│   │   └── forms.js         # Form handling routes
│   ├── utils/               # Utility functions
│   │   └── upload.js        # File upload configuration
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   ├── package.json         # Dependencies and scripts
│   ├── seed.js              # Database seeding script
│   ├── server.js            # Main server file
│   └── vercel.json          # Vercel deployment config
│
├── .gitignore               # Git ignore rules
└── README.md                # Project documentation
```

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas account** (for cloud database) - [Sign up here](https://www.mongodb.com/atlas)
- **Cloudinary account** (for image storage) - [Sign up here](https://cloudinary.com/)
- **Vercel account** (for deployment) - [Sign up here](https://vercel.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/tda_website.git
cd tda_website
```

> **Note:** Replace `yourusername` with your actual GitHub username or the repository URL.

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tda_website?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Default Credentials
ADMIN_EMAIL=admin@tda.com
ADMIN_PASSWORD=admin123

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Optional: App Configuration
VITE_APP_NAME=TDA Website
VITE_APP_VERSION=1.0.0
```

### 🔧 Required Accounts Setup

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Add your IP to the whitelist (0.0.0.0/0 for development)
4. Create database user
5. Get connection string

#### Cloudinary
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from dashboard
3. Add to environment variables

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Seed the Database (Optional)**
```bash
cd backend
node seed.js
```

### Production Mode

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Start Backend**
```bash
cd backend
npm start
```

## 🌐 Deployment

### Vercel Deployment

#### Backend Deployment

1. **Create a new project on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from your Git repository
   - Select the `backend` directory as the root

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Set Environment Variables in Vercel Dashboard:**
   - `MONGODB_URI=mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET=your_super_secret_jwt_key_here`
   - `JWT_EXPIRES_IN=7d`
   - `CLOUDINARY_CLOUD_NAME=your_cloudinary_name`
   - `CLOUDINARY_API_KEY=your_cloudinary_key`
   - `CLOUDINARY_API_SECRET=your_cloudinary_secret`
   - `ADMIN_EMAIL=admin@tda.com`
   - `ADMIN_PASSWORD=admin123`
   - `FRONTEND_URL=https://your-frontend-domain.vercel.app`

4. **Deploy**
   - Click "Deploy"
   - Note down your backend URL (e.g., `https://your-backend.vercel.app`)

#### Frontend Deployment

1. **Create a new project on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import from your Git repository
   - Select the `frontend` directory as the root

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_API_BASE_URL=https://your-backend-url.vercel.app`
   - `VITE_APP_NAME=TDA Website`
   - `VITE_APP_VERSION=1.0.0`

4. **Deploy**
   - Click "Deploy"
   - Your frontend will be available at your Vercel domain

5. **Update Backend CORS**
   - Go back to your backend Vercel project
   - Update the `FRONTEND_URL` environment variable with your frontend URL
   - Redeploy the backend

### 🚀 Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Cloudinary account set up with API credentials
- [ ] Backend deployed to Vercel with all environment variables
- [ ] Frontend deployed to Vercel with correct API URL
- [ ] CORS updated with production frontend URL
- [ ] Admin login tested in production
- [ ] All API endpoints tested
- [ ] File uploads working (images)
- [ ] Database seeded with initial data (if needed)

### 🔄 Post-Deployment Steps

1. **Test Admin Access**
   ```
   URL: https://your-frontend.vercel.app/login
   Email: admin@tda.com
   Password: admin123
   ```

2. **Verify API Health**
   ```
   GET https://your-backend.vercel.app/api/health
   ```

3. **Test File Uploads**
   - Login to admin panel
   - Try uploading an image for team member or event

4. **Update DNS (Optional)**
   - Point your custom domain to Vercel
   - Update environment variables with custom domain

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/verify
```

### Team Management

```http
GET    /api/team           # Get all team members
GET    /api/team/:id       # Get team member by ID
POST   /api/team           # Create team member (Auth required)
PUT    /api/team/:id       # Update team member (Auth required)
DELETE /api/team/:id       # Delete team member (Auth required)
```

### Event Management

```http
GET    /api/events         # Get all events
GET    /api/events/admin   # Get all events (Admin)
GET    /api/events/:id     # Get event by ID
POST   /api/events         # Create event (Auth required)
PUT    /api/events/:id     # Update event (Auth required)
DELETE /api/events/:id     # Delete event (Auth required)
POST   /api/events/:id/register # Register for event
```

### News Management

```http
GET    /api/news           # Get all published news
GET    /api/news/admin     # Get all news (Admin)
GET    /api/news/:id       # Get news by ID
POST   /api/news           # Create news (Auth required)
PUT    /api/news/:id       # Update news (Auth required)
DELETE /api/news/:id       # Delete news (Auth required)
```

### Form Submissions

```http
POST   /api/forms/submit   # Submit contact form
GET    /api/forms          # Get all submissions (Auth required)
GET    /api/forms/:id      # Get submission by ID (Auth required)
DELETE /api/forms/:id      # Delete submission (Auth required)
```

### Health Check

```http
GET    /api/health         # Check server status
```

## 🔐 Admin Panel

### Default Admin Credentials
- **Email:** admin@tda.com
- **Password:** admin123

### Admin Features
- **Dashboard:** Overview of website statistics
- **Team Management:** Add/edit/delete team members
- **Event Management:** Create and manage events
- **News Management:** Publish and manage news articles
- **Form Management:** View contact form submissions
- **File Uploads:** Upload images via Cloudinary

### Access URLs
- **Local:** http://localhost:5173/login
- **Production:** https://your-domain.vercel.app/login

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt for secure password storage
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Server-side validation for all inputs
- **File Upload Security** - Cloudinary with file type restrictions
- **Environment Variables** - Sensitive data stored securely

## 🧪 Testing

### Test Backend Endpoints

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tda.com","password":"admin123"}'

# Test team members
curl http://localhost:5000/api/team
```

## 📝 Available Scripts

### Backend Scripts
```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm test       # Run tests (not implemented)
```

### Frontend Scripts
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB URI format
   - Verify network access in MongoDB Atlas (allow access from anywhere: `0.0.0.0/0`)
   - Ensure correct database name in connection string
   - Verify username and password are URL-encoded

2. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check environment variables in production
   - Ensure `FRONTEND_URL` is set correctly in backend
   - Check that frontend is making requests to correct backend URL

3. **File Upload Issues**
   - Verify Cloudinary credentials are correct
   - Check file size limits (default: 10MB)
   - Ensure proper file types (images only)
   - Verify Cloudinary account has enough quota

4. **Authentication Issues**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Ensure proper middleware order
   - Check if admin user exists in database

5. **Vercel Deployment Issues**
   - Check build logs for errors
   - Verify Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Check environment variables are set correctly

6. **API Not Working in Production**
   - Verify backend URL in frontend environment variables
   - Check if backend is deployed and running
   - Test API endpoints directly in browser
   - Check Vercel function logs for errors

### Error Codes

- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (valid token, insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **500** - Internal Server Error (check server logs)

## 📊 Monitoring & Maintenance

### Performance Monitoring
- **Vercel Analytics** - Track page views and performance
- **MongoDB Atlas Monitoring** - Database performance metrics
- **Cloudinary Usage** - Image storage and bandwidth usage

### Regular Maintenance Tasks
- Update dependencies monthly
- Monitor database storage usage
- Review and clean old form submissions
- Update admin credentials periodically
- Backup important data regularly

### Logs and Debugging
- **Vercel Function Logs** - Check runtime errors
- **Browser DevTools** - Client-side debugging
- **MongoDB Atlas Logs** - Database operation logs
- **Cloudinary Media Library** - Image upload history

## 🔒 Security Best Practices

### In Production
- Change default admin credentials immediately
- Use strong JWT secrets (min 256 bits)
- Enable HTTPS everywhere
- Regularly update dependencies
- Monitor for security vulnerabilities
- Implement rate limiting for API endpoints
- Use environment variables for all secrets
- Enable database encryption at rest

### Data Protection
- Validate all user inputs
- Sanitize form submissions
- Implement proper file upload restrictions
- Use CORS appropriately
- Regularly backup database
- Monitor for suspicious activity

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

### Development Guidelines

- Follow ESLint configuration
- Use meaningful commit messages
- Add proper error handling
- Update documentation for new features
- Test thoroughly before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email admin@tda.com or create an issue on GitHub.

## 🙏 Acknowledgments

- **React.js Team** - For the amazing frontend framework
- **Express.js Team** - For the robust backend framework
- **MongoDB** - For the flexible database solution
- **Vercel** - For excellent hosting platform
- **Cloudinary** - For reliable image hosting
- **Tailwind CSS** - For the utility-first CSS framework

---

**Made with ❤️ by SUYASH ANAND**


