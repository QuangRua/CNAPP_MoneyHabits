import { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';

// Initialize Google Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const analyzeReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const localFilePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Read the file buffer for Gemini
    const fileBytes = fs.readFileSync(localFilePath);
    
    // Convert to Base64
    const base64Image = fileBytes.toString('base64');

    // Call Gemini to analyze the image
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: 'Analyze this receipt image and extract the following information in JSON format: amount (total amount as a number), date (transaction date in YYYY-MM-DD string format), and merchant (name of the store/merchant as a string). If you cannot find a value, use null.',
                    },
                    {
                        inlineData: {
                            mimeType,
                            data: base64Image,
                        }
                    }
                ]
            }
        ],
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    amount: {
                        type: Type.NUMBER,
                        description: "The total amount of the transaction",
                        nullable: true,
                    },
                    date: {
                        type: Type.STRING,
                        description: "The date of the transaction in YYYY-MM-DD format",
                        nullable: true,
                    },
                    merchant: {
                        type: Type.STRING,
                        description: "The name of the store or merchant",
                        nullable: true,
                    }
                },
                required: ["amount", "date", "merchant"]
            }
        }
    });

    // Delete the temporary file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Parse the JSON response
    const jsonString = response.text || "{}";
    const parsedData = JSON.parse(jsonString);

    return res.status(200).json({
      message: 'Receipt analyzed successfully',
      data: parsedData,
    });
  } catch (error) {
    console.error('Gemini Analyze Error:', error);
    // Cleanup local file on error
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: 'Failed to analyze receipt' });
  }
};
