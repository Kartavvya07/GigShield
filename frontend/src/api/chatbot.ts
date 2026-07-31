import { apiClient, executeApiCall } from './client';
import { APIResponse, ChatRequest, ChatResponse } from '../types';
import { generateMockChatResponse } from './mocks/chatbotMock';

/**
 * Send a message to the AI Chatbot companion
 */
export async function sendChatMessage(request: ChatRequest): Promise<APIResponse<ChatResponse>> {
  return executeApiCall<ChatResponse>(
    async () => {
      const response = await apiClient.post<APIResponse<ChatResponse>>('/chatbot/message', request);
      return response.data.data;
    },
    () => generateMockChatResponse(request.message)
  );
}
