const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== MIDDLEWARE ===================== */

app.use(cors({
  origin: "https://teacher-materials-inventory-system.vercel.app"
}));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

/* ===================== FILE UPLOAD ===================== */

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/* ===================== DATABASE ===================== */

const client = new MongoClient(process.env.MONGODB_URI);

let materials;
let admins;
//added
let users;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db();

    materials = db.collection("materials");
    admins = db.collection("admins");
    //added
    users = db.collection("users");

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

connectDB();

/* ===================== AUTH MIDDLEWARE ===================== */

function verifyUser(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    /*replaced
    req.admin = decoded;
    with this*/
    req.user = decoded; // for both admin and viewer
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

//added
function requireEditor(req, res, next) {
  if (req.user.role !== "admin" && req.user.role !== "editor") {
    return res.status(403).json({ message: "Editors or Admin only" });
  }
  next();
}

/* ===================== ADMIN ROUTES ===================== */

//added
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // strong password check
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      username,
      email,
      password: hashedPassword,
      role: "viewer", // default role
      createdAt: new Date()
    });

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

//added
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Get all users (ADMIN ONLY)
app.get("/api/users", verifyUser, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }
    
    const allUsers = await users.find({}, { projection: { password: 0 } }).toArray();
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Update user role
app.put("/api/users/:id/role", verifyUser, requireEditor, async (req, res) => {
  try {
    const { role } = req.body;

    await users.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { role } }
    );

    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
});

/*removed
// Register admin (ONLY if none exists)
app.post("/api/admin/register", async (req, res) => {
  try {
    const existingAdmin = await admins.findOne({});

    if (existingAdmin) {
      return res.status(403).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await admins.insertOne({
      username: req.body.username,
      password: hashedPassword,
      createdAt: new Date()
    });

    res.json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ message: "Admin registration failed" });
  }
});

// Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const admin = await admins.findOne({
      username: req.body.username
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Verify token
app.get("/api/admin/verify", verifyUser,requireAdmin, (req, res) => {
  res.json({ valid: true });
});*/

/* ===================== MATERIAL ROUTES ===================== */

// Get materials (with filters)
app.get("/api/materials", async (req, res) => {
  try {
    const { subject, type, category } = req.query;

    let filter = { deleted: { $ne: true } };

    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (category) filter.category = category;

    const data = await materials.find(filter).toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch materials" });
  }
});

// Get recycle bin
app.get("/api/materials/bin", verifyUser,requireEditor, async (req, res) => {
  try {
    const data = await materials
      .find({ deleted: true })
      .toArray();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bin" });
  }
});

// Add material
app.post(
  "/api/materials",
  verifyUser, requireEditor, 
  upload.single("file"),
  async (req, res) => {
    try {
      let filePath;

      if (req.file) {
        filePath = `/uploads/${req.file.filename}`;
      } else if (req.body.url) {
        filePath = req.body.url;
      } else {
        return res
          .status(400)
          .json({ message: "File or URL required" });
      }

      await materials.insertOne({
        title: req.body.title,
        subject: req.body.subject,
        type: req.body.type,
        category: req.body.category,
        url: filePath,
        deleted: false,

        //  NEW FIELDS
        uploadedBy: req.user.username,
        uploaderRole: req.user.role,
        uploadedById: req.user.id,

        createdAt: new Date()
      });

      res.json({ message: "Material added" });
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

// Soft delete
app.delete("/api/materials/:id", verifyUser, requireEditor, async (req, res) => {
  try {
    await materials.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { deleted: true } }
    );

    res.json({ message: "Moved to bin" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// Restore material
app.post(
  "/api/materials/:id/restore",
  verifyUser, requireEditor,
  async (req, res) => {
    try {
      await materials.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { deleted: false } }
      );

      res.json({ message: "Restored" });
    } catch (err) {
      res.status(500).json({ message: "Restore failed" });
    }
  }
);

// Get unique subjects
app.get("/api/subjects", async (req, res) => {
  try {
    const all = await materials
      .find({ deleted: { $ne: true } })
      .project({ subject: 1 })
      .toArray();

    const uniqueSubjects = [
      ...new Set(all.map(m => m.subject))
    ];

    res.json(uniqueSubjects);
  } catch (err) {
    res.status(500).json({ message: "Failed to load subjects" });
  }
});

// Get unique types
app.get("/api/types", async (req, res) => {
  try {
    const all = await materials
      .find({ deleted: { $ne: true } })
      .project({ type: 1 })
      .toArray();

    const uniqueTypes = [
      ...new Set(all.map(m => m.type))
    ];

    res.json(uniqueTypes);
  } catch (err) {
    res.status(500).json({ message: "Failed to load types" });
  }
});

/* ===================== START SERVER ===================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});