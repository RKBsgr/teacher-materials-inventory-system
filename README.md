# Teacher Materials Inventory System

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.3-green.svg)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-blue.svg)](https://mongodb.com)

A modern web application for managing and sharing educational materials. Teachers can upload/view/download resources by subject/type, with role-based access (admin/editor/viewer), recycle bin, filters, and search.

## ✨ Features

- **Material Management**: Upload files/links, categorize by subject/type, preview cards (grid/list view).
- **Role-Based Access**: Viewer (read), Editor (add/delete), Admin (full + user management).
- **Recycle Bin**: Soft delete/restore materials.
- **Search & Filters**: By title, subject, type, category.
- **Dark Mode**: Toggle theme.
- **Responsive**: Mobile/desktop optimized.
- **Auth**: JWT login/register with validation.
- **Modern UI**: Glassmorphism, animations, library-themed design.

## 📁 Structure

```
web_eng_proj/
├── server/                 # Express + MongoDB backend
│   ├── index.js            # API routes (auth, materials, users)
│   ├── package.json
│   └── uploads/            # Uploaded files
└── teacher-materials-inventory/ # React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── AdminPanel.jsx
    │   │   ├── Landing.jsx (login/register)
    │   │   ├── Sidebar.jsx (filters)
    │   │   └── ...
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas URI in `.env`)

### Backend
```bash
cd server
npm install
copy .env.example .env  # Add MONGODB_URI, JWT_SECRET
npm start
```

### Frontend
```bash
cd teacher-materials-inventory
npm install
npm run dev
```

Open http://localhost:5173

### Deploy
- Frontend: Vercel (vercel.json ready).
- Backend: Render/Heroku (set env vars).

## 🛠 Usage

1. **Register/Login** (landing page).
2. **Admin**: Add materials (file/URL), manage users/roles.
3. **Users**: Filter/search/download (view/download icons).
4. **Recycle**: Toggle bin view, restore/delete.

## 🔧 Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React 19 | Express | MongoDB |
| Vite | Multer | Mongoose |
| Tailwind-like CSS | JWT/Bcrypt |  |
| ESLint | CORS |  |

## 🤝 Contributing

1. Fork & clone.
2. `npm install` both dirs.
3. Create branch `feat/your-feature`.
4. PR to main.

## 📄 License

MIT
