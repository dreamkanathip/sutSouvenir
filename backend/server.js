const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.disable("etag");
// ใช้งาน middleware
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

// โหลด routes อัตโนมัติจากโฟลเดอร์ "routes"
fs.readdirSync("./routes")
  .filter((file) => file.endsWith(".js")) // กรองเฉพาะไฟล์ .js
  .forEach((file) => {
    const route = require(path.join(__dirname, "routes", file)); // โหลดไฟล์ route
    app.use("/api", route); // ใช้ route พร้อมกับ prefix /api
  });

// กำหนด port ที่ต้องการให้ server รัน
const PORT = process.env.PORT || 5000;

// เช็คว่า PORT มีค่าหรือไม่ และเริ่มต้นเซิร์ฟเวอร์
if (PORT) {
  app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${PORT}`); // ข้อความแสดงใน console เป็นภาษาไทย
  });
} else {
  console.error("ไม่พบพอร์ตในการตั้งค่า"); // ถ้าไม่มีพอร์ตให้แสดง error
}
