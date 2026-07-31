import { apiClient, executeApiCall } from './client';
import { APIResponse, OCRResult } from '../types';
import { MOCK_OCR_RESULT } from './mocks/ocrMock';

/**
 * Upload pay stub/shift screenshot for AI OCR extraction
 */
export async function analyzeScreenshot(file: File): Promise<APIResponse<OCRResult>> {
  return executeApiCall<OCRResult>(
    async () => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post<APIResponse<OCRResult>>('/ocr/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    () => {
      // Simulate dynamic preview URL creation from uploaded file in mock mode
      const simulatedUrl = URL.createObjectURL(file);
      return {
        ...MOCK_OCR_RESULT,
        imageUrl: simulatedUrl,
      };
    },
    800 // slightly longer simulated delay for OCR process
  );
}
