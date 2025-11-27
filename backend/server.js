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

fs.readdirSync("./routes")
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const route = require(path.join(__dirname, "routes", file));
    app.use("/api", route);
  });

const PORT = process.env.PORT || 5000;

if (PORT) {
  app.listen(PORT, () => {
    console.log(`เซิร์ฟเวอร์กำลังทำงานบนพอร์ต ${PORT}`);
  });
} else {
  console.error("ไม่พบพอร์ตในการตั้งค่า");
}
