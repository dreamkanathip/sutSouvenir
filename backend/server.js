const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// ใช้งาน middleware
app.use(express.json());
app.use(cookieParser());

// ใช้ morgan เพื่อบันทึก log ของ HTTP requests
app.use(morgan("dev")); // คุณสามารถเลือกได้ว่าอยากใช้ 'combined', 'dev', หรือ 'tiny'

// ใช้ cors สำหรับอนุญาตการเข้าถึงจากโดเมนอื่น
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"], // วิธีการที่อนุญาต
    allowedHeaders: ["Content-Type", "Authorization"], // กำหนด headers ที่อนุญาต
    credentials: true, // ถ้าต้องการให้รับส่งข้อมูลแบบมีคุกกี้
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
