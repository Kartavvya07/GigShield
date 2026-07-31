import { ChatResponse } from '../../types';

export function generateMockChatResponse(userMessage: string): ChatResponse {
  const lower = userMessage.toLowerCase();

  if (lower.includes('pay') || lower.includes('hourly') || lower.includes('rate')) {
    return {
      reply: 'Your effective net hourly rate this week across all platforms is $23.10/hr. Uber offered your top rate at $25.60/hr, while DoorDash averaged $17.20/hr.',
      suggestedActions: [
        'Compare platform hourly rates',
        'Check fuel expense impact',
        'Log a new shift',
      ],
      confidenceScore: 0.98,
      timestamp: new Date().toISOString(),
    };
  }

  if (lower.includes('fairness') || lower.includes('underpaid') || lower.includes('dispute')) {
    return {
      reply: 'We flagged 2 jobs as underpaid this week due to long waiting times and high mileage costs relative to base pay. You can request a fairness review report to document these discrepancies.',
      suggestedActions: [
        'View flagged underpaid jobs',
        'Download fairness report PDF',
        'Recalculate mileage costs',
      ],
      confidenceScore: 0.95,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    reply: `GigShield Assistant active. I analyzed your recent logs: You've logged 4 shifts totaling $259.50. How can I help optimize your earnings today?`,
    suggestedActions: [
      'Show weekly summary',
      'Upload job screenshot',
      'Check fair pay threshold',
    ],
    confidenceScore: 0.90,
    timestamp: new Date().toISOString(),
  };
}
