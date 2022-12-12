import { Request } from 'express';

import multer from 'multer';
import path from 'path';

// Destination to store the images
const imageStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    // let folder = '';

    // if (req.baseUrl.includes('users')) {
    //   folder = 'users';
    // } else if (req.baseUrl.includes('auth')) {
    //   folder = 'auth';
    // } else if (req.baseUrl.includes('notes')) {
    //   folder = 'notes';
    // }

    cb(null, `src/public/uploads/images`);
  },

  filename: (_req: Request, file: any, cb: any) => {
    const imageFileName =
      file.fieldname.substring(0, 7) +
      '-' +
      Date.now() +
      String(Math.floor(Math.random() * Math.pow(20, 15))) +
      path.extname(file.originalname);

    cb(null, imageFileName);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req: Request, file: any, cb: any) => {
    const fileTypes = /jpeg|jpg|png|jfif/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimetype && extname) {
      return cb(null, true);
    }

    cb(
      new Error(
        `Error: O upload de arquivos apenas aceita as seguintes extensões de arquivos: ${fileTypes}`
      )
    );
  },
});

export { imageUpload };
