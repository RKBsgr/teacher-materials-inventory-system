# Teacher Materials Inventory Deployment Guide

## Frontend (Vercel)
1. Push to GitHub (only `teacher-materials-inventory/` folder)
2. Connect Vercel to repo, framework=Vite
3. **Env Var**: `VITE_API_URL=https://teacher-materials-inventory-system.onrender.com`
4. Deploy - site at `*.vercel.app`

## Backend (Render)
1. Push `server/` to separate GitHub repo or deploy folder
2. New Web Service on Render → Node
3. **Build**: `npm install`
4. **Start**: `node index.js`
5. **Env Vars**:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/teacherMaterialsDB
   JWT_SECRET=your-very-long-secret-key-change-this
   ```
6. MongoDB Atlas: IP Whitelist 0.0.0.0/0

## Local Dev
```
cd teacher-materials-inventory
npm i && npm run dev  # http://localhost:5173
cd ../server
npm i && node index.js  # http://localhost:5000
```
Copy .env.example → .env for local (use localhost:5000 for VITE_API_URL)

## First Admin Setup
Login `admin/admin`, change password via register endpoint once.
