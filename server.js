// ====================== IMPORTS ======================
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// ====================== APP SETUP ======================
const app = express();
app.use(cors());
app.use(express.json());

// ====================== CLOUDINARY ======================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ====================== MULTER (GALLERY) ======================
const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crr_gallery",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});
const uploadGallery = multer({ storage: galleryStorage });

// ====================== MULTER (CLIPS) ======================
const clipStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "crr_clips",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm"]
  }
});
const uploadClips = multer({ storage: clipStorage });

// ====================== DB CONNECTION ======================
<<<<<<< HEAD
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tarun123",
  database: "college_fest"
});

db.connect(err => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
    return;
  }
  console.log("✅ DB Connected");
=======
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: 0
});

// Optional check
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ DB Pool Connection Failed:", err);
  } else {
    console.log("✅ DB Pool Connected");
    connection.release();
  }
>>>>>>> 0ec76a6d96aae7c97d0649d5d63601571b81aa3d
});

// ======================================================
// ====================== FEST APIs ======================
// ======================================================
<<<<<<< HEAD
=======
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    time: new Date()
  });
});
>>>>>>> 0ec76a6d96aae7c97d0649d5d63601571b81aa3d

// ➕ ADD FEST
app.post("/api/fests", (req, res) => {
  const { fest_name, department } = req.body;

  if (!fest_name || !department) {
    return res.status(400).json({ message: "Fest name & department required" });
  }

  db.query(
    "INSERT INTO fests (fest_name, department) VALUES (?, ?)",
    [fest_name, department],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      res.json({ message: "Fest Added Successfully ✅", fest_id: result.insertId });
    }
  );
});

// 📥 GET FESTS
app.get("/api/fests", (req, res) => {
  db.query("SELECT * FROM fests ORDER BY id DESC", (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// ✏️ UPDATE FEST
app.put("/api/fests/:id", (req, res) => {
  const { fest_name, department } = req.body;

  db.query(
    "UPDATE fests SET fest_name=?, department=? WHERE id=?",
    [fest_name, department, req.params.id],
    err => {
      if (err) return res.status(500).json({ message: "Database Error" });
      res.json({ message: "Fest Updated Successfully ✅" });
    }
  );
});

// 🗑️ DELETE FEST
app.delete("/api/fests/:id", (req, res) => {
  db.query("DELETE FROM fests WHERE id=?", [req.params.id], err => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.json({ message: "Fest Deleted Successfully 🗑️" });
  });
});

// ======================================================
// ====================== EVENT APIs =====================
// ======================================================

// ➕ ADD EVENT
app.post("/api/events", (req, res) => {
  const e = req.body;

  if (!e.fest_id || !e.event_name) {
    return res.status(400).json({ message: "Fest & Event name required" });
  }

  db.query(
    `
    INSERT INTO events
    (fest_id, event_name, event_description, rules, max_team_size,
     whatsapp_link, register_form_link, fee_amount, prize_amount,
     venue, event_date, event_time)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `,
    [
      e.fest_id,
      e.event_name,
      e.event_description,
      e.rules,
      e.max_team_size,
      e.whatsapp_link,
      e.register_form_link,
      e.fee_amount,
      e.prize_amount,
      e.venue,
      e.event_date,
      e.event_time
    ],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database Error" });
      res.json({ message: "Event Added Successfully ✅", event_id: result.insertId });
    }
  );
});

// 📥 GET EVENTS BY FEST
app.get("/api/events/:festId", (req, res) => {
  db.query(
    "SELECT * FROM events WHERE fest_id=? ORDER BY id DESC",
    [req.params.festId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

// ✏️ UPDATE EVENT
app.put("/api/events/:id", (req, res) => {
  const e = req.body;

  db.query(
    `
    UPDATE events SET
    event_name=?, event_description=?, rules=?, max_team_size=?,
    whatsapp_link=?, register_form_link=?, fee_amount=?, prize_amount=?,
    venue=?, event_date=?, event_time=?
    WHERE id=?
    `,
    [
      e.event_name,
      e.event_description,
      e.rules,
      e.max_team_size,
      e.whatsapp_link,
      e.register_form_link,
      e.fee_amount,
      e.prize_amount,
      e.venue,
      e.event_date,
      e.event_time,
      req.params.id
    ],
    err => {
      if (err) return res.status(500).json({ message: "Database Error" });
      res.json({ message: "Event Updated Successfully ✅" });
    }
  );
});

// 🗑️ DELETE EVENT
app.delete("/api/events/:id", (req, res) => {
  db.query("DELETE FROM events WHERE id=?", [req.params.id], err => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.json({ message: "Event Deleted Successfully 🗑️" });
  });
});

// ======================================================
// ==================== GALLERY APIs =====================
// ======================================================

// ➕ UPLOAD IMAGES
app.post("/api/upload-gallery", uploadGallery.array("images"), async (req, res) => {
  try {
    console.log("📸 Gallery upload hit");
    console.log("Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images received" });
    }

    const { fest_id, event_id, description, year } = req.body;

    const values = req.files.map(f => [
      fest_id,
      event_id,
      f.path,       // image_url
      f.filename,   // ✅ cloudinary_id (FIX)
      description,
      year
    ]);

    await db.promise().query(
      `INSERT INTO gallery_images
       (fest_id, event_id, image_url, cloudinary_id, description, year)
       VALUES ?`,
      [values]
    );

    res.json({ message: "Gallery uploaded successfully ✅" });

  } catch (err) {
    console.error("❌ Gallery Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
});


// 📥 GET GALLERY
app.get("/api/gallery/:eventId", (req, res) => {
  db.query(
    "SELECT * FROM gallery_images WHERE event_id=?",
    [req.params.eventId],
    (err, rows) => res.json(rows)
  );
});

// 🗑️ DELETE GALLERY
app.post("/api/delete-gallery-images", async (req, res) => {
  const { images } = req.body;

  if (!images || images.length === 0) {
    return res.status(400).json({ message: "No images selected" });
  }

  try {
    for (const img of images) {
      await cloudinary.uploader.destroy(img.cloudinary_id);

      await new Promise((resolve, reject) => {
        db.query(
          "DELETE FROM gallery_images WHERE id=?",
          [img.id],
          err => err ? reject(err) : resolve()
        );
      });
    }

    res.json({ message: "Gallery images deleted 🗑️" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gallery delete failed" });
  }
});

// ======================================================
// ====================== CLIPS APIs =====================
// ======================================================

// ➕ UPLOAD CLIPS
app.post("/api/upload-clips", uploadClips.array("videos"), async (req, res) => {
  try {
    console.log("🎥 Clips upload hit");
    console.log("Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No videos received" });
    }

    const { fest_id, event_id, year } = req.body;

    const values = req.files.map(v => [
      fest_id,
      event_id,
      v.path,       // video_url
      v.filename,   // ✅ cloudinary_id (FIX)
      year
    ]);

    await db.promise().query(
      `INSERT INTO clips
       (fest_id, event_id, video_url, cloudinary_id, year)
       VALUES ?`,
      [values]
    );

    res.json({ message: "Clips uploaded successfully 🎥" });

  } catch (err) {
    console.error("❌ Clips Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// 📥 GET CLIPS
app.get("/api/clips/:eventId", (req, res) => {
  db.query(
    "SELECT * FROM clips WHERE event_id=?",
    [req.params.eventId],
    (err, rows) => res.json(rows)
  );
});

// 🗑️ DELETE CLIPS
app.post("/api/delete-clips", async (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).json({ message: "No videos selected" });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT cloudinary_id FROM clips WHERE id IN (?)",
      [ids]
    );

    for (const r of rows) {
      await cloudinary.uploader.destroy(r.cloudinary_id, {
        resource_type: "video"
      });
    }

    await db.promise().query(
      "DELETE FROM clips WHERE id IN (?)",
      [ids]
    );

    res.json({ message: "Clips deleted successfully 🗑️" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Clip delete failed" });
  }
});

// ======================================================
// ====================== CLUB APIs ======================
// ======================================================

<<<<<<< HEAD
// ➕ CREATE CLUB
=======
// ➕ pool CLUB
>>>>>>> 0ec76a6d96aae7c97d0649d5d63601571b81aa3d
app.post("/api/clubs", async (req, res) => {
  const {
    club_name,
    department,
    description,
    rules,
    whatsapp_link,
    coordinators
  } = req.body;

  if (!club_name || !department) {
    return res.status(400).json({ message: "Club name & department required" });
  }

  try {
    // 1️⃣ Insert club
    const [result] = await db.promise().query(
      `INSERT INTO clubs 
       (club_name, department, description, rules, whatsapp_link)
       VALUES (?,?,?,?,?)`,
      [club_name, department, description, rules, whatsapp_link]
    );

    const clubId = result.insertId;

    // 2️⃣ Insert coordinators
    if (coordinators && coordinators.length > 0) {
      const values = coordinators.map(c => [
        clubId,
        c.name,
        c.mobile,
        c.branch
      ]);

      await db.promise().query(
        `INSERT INTO club_coordinators
         (club_id, name, mobile, branch)
         VALUES ?`,
        [values]
      );
    }

<<<<<<< HEAD
    res.json({ message: "Club created successfully ✅" });
=======
    res.json({ message: "Club poold successfully ✅" });
>>>>>>> 0ec76a6d96aae7c97d0649d5d63601571b81aa3d

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Club creation failed" });
  }
});

// 📥 GET ALL CLUBS
app.get("/api/clubs", (req, res) => {
  db.query(
    "SELECT * FROM clubs ORDER BY id DESC",
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});
// 📥 GET SINGLE CLUB WITH COORDINATORS
app.get("/api/clubs/:id", async (req, res) => {
  try {
    const clubId = req.params.id;

    const [clubRows] = await db.promise().query(
      "SELECT * FROM clubs WHERE id=?",
      [clubId]
    );

    if (clubRows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    const [coordinators] = await db.promise().query(
      "SELECT name, mobile, branch FROM club_coordinators WHERE club_id=?",
      [clubId]
    );

    res.json({
      ...clubRows[0],
      coordinators
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch club" });
  }
});
// ✏️ UPDATE CLUB
app.put("/api/clubs/:id", async (req, res) => {
  const clubId = req.params.id;
  const {
    club_name,
    department,
    description,
    rules,
    whatsapp_link,
    coordinators
  } = req.body;

  try {
    // 1️⃣ Update club
    await db.promise().query(
      `UPDATE clubs SET
       club_name=?, department=?, description=?, rules=?, whatsapp_link=?
       WHERE id=?`,
      [club_name, department, description, rules, whatsapp_link, clubId]
    );

    // 2️⃣ Delete old coordinators
    await db.promise().query(
      "DELETE FROM club_coordinators WHERE club_id=?",
      [clubId]
    );

    // 3️⃣ Insert new coordinators
    if (coordinators && coordinators.length > 0) {
      const values = coordinators.map(c => [
        clubId,
        c.name,
        c.mobile,
        c.branch
      ]);

      await db.promise().query(
        `INSERT INTO club_coordinators
         (club_id, name, mobile, branch)
         VALUES ?`,
        [values]
      );
    }

    res.json({ message: "Club updated successfully ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Club update failed" });
  }
});
// 🗑️ DELETE CLUB
app.delete("/api/clubs/:id", async (req, res) => {
  try {
    await db.promise().query(
      "DELETE FROM clubs WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Club deleted successfully 🗑️" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Club delete failed" });
  }
});

// ====================== SERVER ======================
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
