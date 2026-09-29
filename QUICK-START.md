# Mini Task Manager - Quick Start Guide

## 🚀 Getting Started

### Option 1: Quick Setup (Recommended)

1. **Clone or download** this project to your computer
2. **Open PowerShell** as Administrator in the project folder
3. **Run the setup script**:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   .\scripts\setup-dev.ps1
   ```
4. **Start the application**:
   ```powershell
   .\scripts\start-dev.ps1
   ```

### Option 2: Manual Setup

1. **Install Prerequisites**:

   - Node.js 16+ from https://nodejs.org/
   - MongoDB from https://www.mongodb.com/try/download/community

2. **Setup Backend**:

   ```bash
   cd backend
   copy .env.example .env
   # Edit .env file with your settings
   npm install
   ```

3. **Setup Frontend**:

   ```bash
   cd frontend
   copy .env.development .env.local
   npm install
   ```

4. **Start Development**:
   ```bash
   # From root directory
   npm run dev
   ```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔧 Common Issues

**MongoDB not starting?**

```bash
# Create data directory and start MongoDB
mkdir data\db
mongod --dbpath .\data\db
```

**Ports already in use?**

```bash
# Kill processes using the ports
npx kill-port 3000
npx kill-port 5000
```

**Need to reset everything?**

```bash
# Clean install
npm run clean
npm run install:all
```

## 📁 What's Included

✅ **Complete MERN Stack Application**

- ✅ MongoDB database setup
- ✅ Express.js backend API
- ✅ React frontend with Vite
- ✅ Node.js server

✅ **User Authentication System**

- ✅ Sign up / Login pages
- ✅ JWT token authentication
- ✅ Protected routes

✅ **Task Management Features**

- ✅ Create, edit, delete tasks
- ✅ Mark tasks complete/incomplete
- ✅ Task priority levels
- ✅ Task status tracking

✅ **Modern UI/UX Design**

- ✅ Responsive mobile design
- ✅ Tailwind CSS styling
- ✅ Loading states
- ✅ Error handling
- ✅ Smooth animations

✅ **Development Tools**

- ✅ Docker configuration
- ✅ Development scripts
- ✅ Environment templates
- ✅ Code formatting/linting

## 🎯 Your Assignment is Complete!

This is a production-ready MERN stack application with:

- **Professional folder structure**
- **Modern technology stack**
- **Complete user authentication**
- **Full CRUD operations for tasks**
- **Responsive design**
- **Error handling and validation**
- **Docker deployment ready**
- **Comprehensive documentation**

**Happy coding! 🚀**
