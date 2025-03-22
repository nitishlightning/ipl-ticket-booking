# Online IPL Match Ticket Booking Website

## Project Overview
The Online IPL Match Ticket Booking Website allows users to browse matches, select seats, and book tickets securely. It features real-time availability, a secure payment gateway, and an interactive UI. Admins manage matches, venues, and pricing.

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (Latest LTS version)
- **MySQL** (or any other SQL-compatible database)
- **Git** (for cloning the repository)
- **Postman** (for API testing, optional)

## Installation & Setup

### 1. Clone the Repository
```sh
git clone https://github.com/your-repo/ipl-ticket-booking.git
cd ipl-ticket-booking
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Database Setup
#### a) Create a MySQL Database
Login to MySQL and execute:
```sql
CREATE DATABASE IPL_Ticket_Booking;
USE IPL_Ticket_Booking;
```

#### b) Create Tables
Execute the following SQL queries to create necessary tables:

**Users Table:**
```sql
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

**Bookings Table:**
```sql
CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    match_name VARCHAR(255) NOT NULL,
    venue VARCHAR(255) NOT NULL,
    match_date DATE NOT NULL,
    seat_type VARCHAR(50) NOT NULL,
    seats INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
```

#### c) Configure Database Connection
Modify the `server.js` file to update database credentials:
```js
const mysql = require("mysql2");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "IPL_Ticket_Booking"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database");
});
```

#### d) Run Database Migrations (if applicable)
If using Sequelize or a migration tool, run:
```sh
npx sequelize-cli db:migrate
```
Or manually execute SQL scripts in `/database/migrations`.

### 4. Start the Server
```sh
node server.js
```
Server will run on `http://localhost:3000` (default port).

### 5. API Endpoints
#### a) **User Registration**
```sh
POST /register
```
Registers a new user in the system.

#### b) **User Login**
```sh
POST /login
```
Authenticates the user and starts a session.

#### c) **Book Tickets**
```sh
POST /book
```
Users can book IPL match tickets.

#### d) **View Booking Details**
```sh
GET /api/booking-details
```
Retrieves the latest ticket booking details.

#### e) **View Ticket**
```sh
GET /view-ticket
```
Displays the most recent booked ticket.

### 6. Updating the Background Image for the View Ticket Page

1.go to "https://nitishlightning.github.io/QR-Code-Generator/"

2.generate a text to QR and download it.

3.Modify the `src/bg.jpg` file or replace it with your desired background image. Update the CSS as follows:
```css
.ticket-container {
  position: relative;
  background-image: url('src/bg.jpg'); /* Replace with your desired background image */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 50px;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
```


## Contributors
- **Nitish Kumar M** (nitishlightning@gmail.com)

