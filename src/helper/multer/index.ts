import multer from "multer";

const uploadMulter = multer({
  storage: multer.memoryStorage(), // Store the file in memory temporarily
});

export default uploadMulter;
