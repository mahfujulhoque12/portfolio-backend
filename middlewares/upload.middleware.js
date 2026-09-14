// import multer from "multer";
// import path from "path";

// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

//   const extension = path.extname(file.originalname).toLowerCase();

//   if (allowedExtensions.includes(extension)) {
//     cb(null, true);
//   } else {
//     cb(
//       new Error("Only JPG, JPEG, PNG, WEBP and GIF images are allowed"),
//       false,
//     );
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },
// });

// export default upload;

import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
