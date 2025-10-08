const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const router = express.Router();

// Registration endpoint
router.post("/register", async (req, res) => {
  const { Username, password, Email, Phone_no } = req.body;
  if (!Username || !password || !Email) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Check if user already exists
    const exists = await pool.query('SELECT * FROM "user" WHERE "Email" = $1', [Email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Insert user
    const result = await pool.query(
      'INSERT INTO "user" ("Username", "password", "Email", "Phone_no") VALUES ($1, $2, $3, $4) RETURNING *',
      [Username, hashed, Email, Phone_no || null]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login endpoint
router.post("/login", async (req, res) => {
  const { Email, password } = req.body;
  if (!Email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }
  try {
    const result = await pool.query('SELECT * FROM "user" WHERE "Email" = $1', [Email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Optionally, generate a session or token here
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
