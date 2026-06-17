process.env.GEMINI_API_KEY = 'dummy';

import request from 'supertest';
import { app } from '../index';
import * as cloudinaryUtils from '../utils/cloudinary';
import fs from 'fs';
import path from 'path';

// Mock the Cloudinary utility function
jest.mock('../utils/cloudinary', () => ({
  uploadToCloud: jest.fn(),
}));

describe('Upload API', () => {
  const dummyFilePath = path.join(__dirname, 'dummy.txt');

  beforeAll(() => {
    // Create a dummy file for upload testing
    fs.writeFileSync(dummyFilePath, 'dummy image content');
  });

  afterAll(() => {
    // Clean up dummy file
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
  });

  it('should return 400 if no image is provided', async () => {
    const res = await request(app).post('/api/v1/upload');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'No image file provided');
  });

  it('should upload image and return image_url', async () => {
    // Mock the uploadToCloud function to return a dummy URL
    (cloudinaryUtils.uploadToCloud as jest.Mock).mockResolvedValue({
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg',
    });

    const res = await request(app)
      .post('/api/v1/upload')
      .attach('image', dummyFilePath);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Image uploaded successfully');
    expect(res.body).toHaveProperty('image_url', 'https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg');
    expect(cloudinaryUtils.uploadToCloud).toHaveBeenCalled();
  });
});
