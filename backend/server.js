const express = require("express");
const app = express();
const morgan = require("morgan");
const { readdirSync } = require("fs");
const cors = require("cors");

// Step 1: CORS configuration
const corsOptions = {
  origin: "http://localhost:4200", // กำหนดต้นทางที่อนุญาต (จะต้องเป็น URL ของ frontend)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // กำหนดวิธีการที่อนุญาต
  allowedHeaders: ["Content-Type", "Authorization"], // กำหนด headers ที่อนุญาต
  credentials: true, // เปิดใช้งานการส่ง credentials (cookies หรือ HTTP authentication headers)
};

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors(corsOptions)); // ใช้ CORS middleware พร้อมกับการตั้งค่า

// Step 2: Load routes dynamically only for JavaScript files
readdirSync("./routes")
  .filter((file) => file.endsWith(".js")) // Filter to include only .js files
  .map((file) => {
    const route = require("./routes/" + file);
    app.use("/api", route); // Use the routes with /api prefix
  });

// Step 3: Handling undefined routes (404)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Step 4: Global error handling middleware (for server-side errors)
app.use((err, req, res, next) => {
  console.error(err.stack); // log error stack trace
  res.status(500).json({ message: "Something went wrong!" });
});

// Step 5: Start the server
app.listen(5000, () => console.log("Server is running on port 5000"));
