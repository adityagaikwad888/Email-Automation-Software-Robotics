const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create the uploads directory if it doesn't exist
const dir = "./uploads";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for Excel files
const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml") ||
    file.originalname.endsWith(".xlsx") ||
    file.originalname.endsWith(".xls") ||
    file.originalname.endsWith(".csv")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Please upload only Excel files (.xlsx, .xls, .csv)"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: excelFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;
