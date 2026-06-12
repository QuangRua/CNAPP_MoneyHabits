import { Request, Response } from 'express';
import { uploadToCloud } from '../utils/cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const localFilePath = req.file.path;

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadToCloud(localFilePath, 'moneyhabits/receipts');

    return res.status(200).json({
      message: 'Image uploaded successfully',
      image_url: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
};
