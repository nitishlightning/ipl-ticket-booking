const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors=require("cors");
const session = require("express-session");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
session({
secret: "your_secret_key",
resave: false,
saveUninitialized: true,
cookie: { secure: false }, // Set to true if using HTTPS
})
);

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "IPL_Ticket_Booking",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database");
});



db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
  });
  
  // Serve static files (HTML, CSS, JS)
  app.use(express.static("public"));
  
  // Register a new user
  app.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  const query = "INSERT INTO Users (name, email, phone, password) VALUES (?, ?, ?, ?)";
  
  db.query(query, [name, email, phone, password], (err) => {
  if (err) {
  console.log(err);
  res.send("Error registering user.");
  } else {
  res.redirect("/login.html");
  }
  });
  });
  
  // Login user
  app.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  const query = "SELECT * FROM Users WHERE email = ?";
  
  db.query(query, [email], (err, results) => {
  if (err) {
  console.error(err);
  res.json({ success: false, message: "An error occurred during login." });
  } else if (results.length === 0) {
  res.json({ success: false, message: "No account found with this email." });
  } else if (results[0].password !== password) {
  res.json({ success: false, message: "Incorrect password." });
  } else {
  req.session.userId = results[0].user_id; // Save user ID in session
  res.json({ success: true }); // Redirect handled by frontend
  }
  });
  });

// Ticket booking
app.post("/book", (req, res) => {
  const { match_name, venue, match_date, seat_type, seats } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
    return res.status(401).send("User not logged in.");
  }

  if (!match_name || !venue || !match_date || !seat_type || !seats ) {
    return res.status(400).send("All fields are required.");
  }

  const query = 'INSERT INTO Bookings (user_id, match_name, venue, match_date, seat_type, seats) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [user_id, match_name, venue, match_date, seat_type, seats], (err) => {
    if (err) {
      console.error("Error booking ticket:", err);
      return res.status(500).send("Error booking ticket.");
    }
    res.redirect("/view-ticket.html");
  });
});

// Fetch booking details
app.get("/api/booking-details", (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "User not logged in." });
  }

  const query = 'SELECT match_name, venue, match_date, seat_type, seats FROM Bookings WHERE user_id = ? ORDER BY booking_id DESC LIMIT 1';

  db.query(query, [req.session.userId], (err, results) => {
    if (err) {
      console.error("Error fetching booking details:", err);
      return res.status(500).json({ error: "Failed to retrieve booking details." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "No bookings found for the user." });
    }

    res.json(results[0]);
  });
});

// View tickets

// Route to handle ticket view
app.get("/view-ticket", (req, res) => {
  if (!req.session.userId) {
  console.error("User not logged in.");
  res.status(401).send("Please login to view your ticket.");
  return;
  }
  
  const query = `
  SELECT * FROM Bookings
  WHERE user_id = ?
  ORDER BY booking_id DESC
  LIMIT 1`;
  
  db.query(query, [req.session.userId], (err, results) => {
  if (err) {
  console.error("Database error:", err);
  res.status(500).send("Error retrieving booking details.");
  } else if (results.length === 0) {
  console.log("No booking found for this user.");
  res.status(404).send("No booking found for this user.");
  } else {
  console.log("Booking details retrieved:", results[0]);
  res.json(results[0]); // Send the latest booking as JSON
  }
  });
  });
  

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
