import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller';

const router = Router();

// Configure multer for local temporary storage
const upload = multer({
  dest: 'uploads/', // Temporary folder
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB
  },
});

// Use 'image' as the field name in the form-data
router.post('/', upload.single('image'), uploadImage);

export default router;
