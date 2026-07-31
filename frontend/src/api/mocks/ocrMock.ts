import { OCRResult } from '../../types';

export const MOCK_OCR_RESULT: OCRResult = {
  platform: 'DoorDash',
  detectedPay: 34.50,
  detectedTips: 8.00,
  detectedTotal: 42.50,
  detectedHours: 2.0,
  detectedDate: '2026-07-31',
  confidenceScore: 0.96,
  rawText: 'DoorDash Earnings Breakdown\nDate: July 31, 2026\nBase Pay: $34.50\nCustomer Tip: $8.00\nTotal Earnings: $42.50\nActive Hours: 2h 00m',
  imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop',
};
