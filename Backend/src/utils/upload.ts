// src/utils/upload.ts

import multer from "multer";
import path from "path";
import fs from "fs";

// Pasta física onde as fotos ficarão salvas
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");

// Se não existir a pasta uploads/, cria
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    // Exemplo: "1623456789012_avatar.jpg"
    const finalName = `${timestamp}_${file.originalname}`;
    cb(null, finalName);
  },
});

export const uploadMiddleware = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de arquivo não permitido."));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por arquivo (ajuste conforme necessário)
  },
});
