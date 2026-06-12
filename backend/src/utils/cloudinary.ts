import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
// It expects CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and optionally deletes the local file afterward.
 * @param localFilePath The absolute path to the local file
 * @param folder The folder in Cloudinary to store the image
 * @returns The Cloudinary upload response containing the URL and other metadata
 */
export const uploadToCloud = async (localFilePath: string, folder: string = 'moneyhabits') => {
  try {
    if (!localFilePath) {
      throw new Error('Local file path is required for upload');
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder,
      resource_type: 'auto',
    });

    // Delete the local temporary file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Attempt to delete local file even if upload fails
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
