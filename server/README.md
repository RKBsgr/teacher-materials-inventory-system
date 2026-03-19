# Backend Deployment (Render + MongoDB Atlas)

## 1. MongoDB Atlas Setup
1. Create free cluster: mongodb.com/atlas
2. **Database User**: Create user/password
3. **Network Access**: Add IP `0.0.0.0/0` (Allow All)
4. **Connect** → Drivers → Copy **full SRV string**:
   ```
   mongodb+srv://username:password@clustername.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority
   ```

## 2. Render Environment Variables
```
MONGODB_URI=^ (paste full SRV string above)
DB_NAME=teacherMaterialsDB
JWT_SECRET=your-very-secret-jwt-key-change-this
```

## 3. Deploy
- Build Command: `npm install`
- Start Command: `node index.js`
- Logs show `✅ MongoDB connected`

## Local
```
npm i
copy .env.example .env  # Fill MONGODB_URI, JWT_SECRET
node index.js
```

**Common Errors:**
- `ENOTFOUND _mongodb._tcp.ns4dkeanu`: Wrong/incomplete URI or IP whitelist
- Connection OK but queries fail: Check `DB_NAME` env var
