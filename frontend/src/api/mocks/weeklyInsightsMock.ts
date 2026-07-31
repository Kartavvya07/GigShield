import { WeeklyInsight } from '../../types';

export const MOCK_WEEKLY_INSIGHT: WeeklyInsight = {
  id: 'insight_2026_w31',
  weekEndingDate: '2026-07-31',
  headlineSummary: 'Excellent earnings growth led by Uber weekend surge windows, though DoorDash Thursday trips showed high gas wear and low base pay.',
  topPlatform: 'Uber',
  fairnessRating: '84% Fair Pay',
  highlights: [
    'Gross weekly earnings increased by 16.4% compared to last week.',
    'Uber surge periods generated an average of $25.60/hr.',
    'Customer tips accounted for 24% of your total revenue.',
  ],
  anomaliesOrRisks: [
    '3 DoorDash trips yielded less than local minimum wage before tips.',
    'Gas and mileage expenses absorbed approximately $28.50 of net income.',
  ],
  recommendations: [
    'Focus shifts between 5 PM and 9 PM on Friday and Saturday on Uber.',
    'Track gas receipts and mileage for DoorDash tax deductions.',
    'Use GigShield OCR auto-capture after every shift for accurate dispute tracking.',
  ],
  projectedMonthlyEarnings: 2740.00,
};
