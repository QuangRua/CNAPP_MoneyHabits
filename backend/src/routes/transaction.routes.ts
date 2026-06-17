import { Router } from 'express';
import multer from 'multer';
import { analyzeReceipt } from '../controllers/transaction.controller';

const router = Router();

// Configure multer for local temporary storage
const upload = multer({
  dest: 'uploads/', // Temporary folder
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit to 10MB
  },
});

// Issue #18: POST /api/v1/transactions/analyze-receipt
router.post('/analyze-receipt', upload.single('image'), analyzeReceipt);

export default router;
