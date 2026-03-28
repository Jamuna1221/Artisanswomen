const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage config for product images
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "artisanswomen/products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 800, crop: "limit", quality: "auto:good" },
    ],
  },
});

const _multerUpload = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
}).array("images", 5); // Accept up to 5 images

// Wrap in a standard Express middleware to fix multer-storage-cloudinary
// compatibility issue with Express 5 (next is not a function error)
const uploadProductImages = (req, res, next) => {
  _multerUpload(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};

module.exports = { cloudinary, uploadProductImages };
