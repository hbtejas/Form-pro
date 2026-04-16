<div align="center">
 
# Forms Pro MERN

**Web Forms on steroids - Now on MERN Stack!**
 
A powerful, modern form builder migrated from Frappe to the MERN (MongoDB, Express, Vue 3, Node.js) stack. Forms Pro takes web forms to the next level with an intuitive drag-and-drop interface, advanced field types, and high-performance architecture.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js 18+](https://img.shields.io/badge/node-18+-blue.svg)](https://nodejs.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)](https://vuejs.org/)

</div>

---

## ✨ Features

- 🎨 **Modern Drag-and-Drop Builder** - Intuitive visual form builder with real-time preview
- 📝 **Rich Field Types** - Support for Data, Number, Email, Date, DateTime, DateRange, TimePicker, Password, Select, Switch, Textarea, and Text Editor fields
- 👥 **Team Collaboration** - Built-in team support for multi-user form management
- 🔐 **Access Control** - JWT-based login requirements and permission management
- 💾 **Save Progress** - Allow incomplete submissions with draft saving functionality
- 🎯 **Custom Routes** - Publish forms with custom URLs for easy sharing
- 📱 **Responsive Design** - Beautiful, mobile-friendly forms that work everywhere
- ⚡ **High Performance** - Powered by MongoDB and Express for lightning-fast responses

## 🚀 Installation

Forms Pro is now a standard MERN application and can be set up in minutes.

### Prerequisites

- Node.js 18 or higher
- MongoDB (Local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hbtejas/Form-pro.git
   cd Form-pro
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure backend environment**:
   ```bash
   cd backend
   # macOS/Linux
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env
   ```
   Update `.env` values for your MongoDB and JWT secret.

4. **Create a default admin user (first time only)**:
   ```bash
   cd ..
   npm run setup:app
   ```
   Default login (customizable via env vars):
   - Email: `admin@formpro.local`
   - Password: `admin123456`

5. **Run the full app (backend + frontend)**:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5175` (or the next available port if occupied).
Backend runs on `http://localhost:5000`.

## ▲ Deploy To Vercel

This repository is configured for a single Vercel project with:

- Static frontend build from `frontend/`
- Node serverless API from `backend/server.js`
- SPA route fallback for Vue Router

### 1. Import Project

Import this repository in Vercel as a new project (root directory).

### 2. Set Environment Variables (Vercel Project Settings)

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN` (use your Vercel frontend URL, e.g. `https://your-app.vercel.app`)

### 3. Deploy

Trigger deployment from Vercel UI or push to your configured branch.

### 4. Important Note About Uploads

The current upload endpoint writes files to local disk (`backend/uploads`).
On Vercel serverless functions, filesystem storage is ephemeral.
For production uploads, move file storage to a persistent provider (for example Vercel Blob, S3, or Cloudinary).

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Vue 3, TypeScript, Vite, Pinia
- **Styling**: Tailwind CSS
- **Form Builder**: Vue Draggable
- **Validation**: Zod
- **Icons**: Lucide Vue

## 👥 Authors

- **Tejas** - Lead Developer & Migrator

---

<div align="center">

**Made with ❤️ by Tejas**

[Report Bug](https://github.com/hbtejas/Form-pro/issues) · [Request Feature](https://github.com/hbtejas/Form-pro/issues)

</div>

