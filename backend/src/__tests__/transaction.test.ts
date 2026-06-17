process.env.GEMINI_API_KEY = 'dummy';

import request from 'supertest';
import { app } from '../index';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// Mock the GoogleGenAI class
jest.mock('@google/genai', () => {
    return {
        GoogleGenAI: jest.fn().mockImplementation(() => {
            return {
                models: {
                    generateContent: jest.fn().mockResolvedValue({
                        text: JSON.stringify({
                            amount: 150000,
                            date: '2026-06-15',
                            merchant: 'Highlands Coffee'
                        })
                    })
                }
            };
        }),
        Type: {
            OBJECT: 'object',
            STRING: 'string',
            NUMBER: 'number',
        }
    };
});

describe('Transaction API - AI OCR', () => {
  const dummyFilePath = path.join(__dirname, 'dummy_receipt.jpg');

  beforeAll(() => {
    // Create a dummy image file for upload testing
    fs.writeFileSync(dummyFilePath, 'dummy image content');
  });

  afterAll(() => {
    // Clean up dummy file
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
  });

  it('should return 400 if no image is provided', async () => {
    const res = await request(app).post('/api/v1/transactions/analyze-receipt');
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'No image file provided');
  });

  it('should analyze receipt and return structured data', async () => {
    const res = await request(app)
      .post('/api/v1/transactions/analyze-receipt')
      .attach('image', dummyFilePath);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Receipt analyzed successfully');
    expect(res.body.data).toHaveProperty('amount', 150000);
    expect(res.body.data).toHaveProperty('date', '2026-06-15');
    expect(res.body.data).toHaveProperty('merchant', 'Highlands Coffee');
  });
});
