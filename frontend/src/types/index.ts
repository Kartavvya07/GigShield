/**
 * GigShield - Core TypeScript Interfaces and Type Definitions
 */

// ==========================================
// Generic API Wrapper Types
// ==========================================

export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface APIError {
  success: false;
  message: string;
  statusCode?: number;
  errorCode?: string;
  details?: Record<string, any>;
}

// ==========================================
// 1 & 6. Job Logging & Multi-Platform Aggregation
// ==========================================

export type GigPlatform = 'Uber' | 'Lyft' | 'DoorDash' | 'Instacart' | 'Deliveroo' | 'Other';

export interface Job {
  id: string;
  platform: GigPlatform;
  title?: string;
  date: string; // ISO date string YYYY-MM-DD
  basePay: number;
  tips: number;
  totalEarnings: number;
  hoursWorked: number;
  distanceMiles?: number;
  location?: string;
  notes?: string;
  isFair?: boolean;
  createdAt: string;
}

export interface CreateJobInput {
  platform: GigPlatform;
  title?: string;
  date: string;
  basePay: number;
  tips?: number;
  hoursWorked: number;
  distanceMiles?: number;
  location?: string;
  notes?: string;
}

// ==========================================
// 2. Screenshot Upload & OCR Extraction
// ==========================================

export interface OCRResult {
  jobId?: string;
  platform: GigPlatform;
  detectedPay: number;
  detectedTips: number;
  detectedTotal: number;
  detectedHours: number;
  detectedDate: string;
  confidenceScore: number; // 0 to 1
  rawText: string;
  imageUrl?: string;
}

// ==========================================
// 3. Fairness Check
// ==========================================

export interface FairnessResult {
  jobId?: string;
  hourlyRate: number;
  regionalMinimumWage: number;
  marketAverageHourlyRate: number;
  fairnessScore: number; // 0 to 100
  status: 'FAIR' | 'UNDERPAID' | 'EXCELLENT';
  breakdown: {
    basePayRatio: number;
    tipDependencyPercentage: number;
    estimatedGasExpense: number;
    netHourlyPay: number;
  };
  warnings: string[];
}

// ==========================================
// 4. AI Chatbot
// ==========================================

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  userContext?: {
    totalWeeklyEarnings?: number;
    primaryPlatform?: string;
  };
}

export interface ChatResponse {
  reply: string;
  suggestedActions?: string[];
  confidenceScore?: number;
  timestamp: string;
}

// ==========================================
// 5 & 6. Weekly Dashboard & Earnings Aggregation
// ==========================================

export interface PlatformEarnings {
  platform: GigPlatform;
  totalAmount: number;
  jobCount: number;
  hoursWorked: number;
}

export interface DashboardSummary {
  periodStart: string;
  periodEnd: string;
  totalEarnings: number;
  totalHoursWorked: number;
  overallHourlyRate: number;
  totalJobsCount: number;
  fairJobsCount: number;
  underpaidJobsCount: number;
  platformBreakdown: PlatformEarnings[];
  dailyEarningsTrend: {
    day: string; // e.g. "Mon", "Tue"
    earnings: number;
    hours: number;
  }[];
}

// ==========================================
// 7. AI Weekly Insight Summary
// ==========================================

export interface WeeklyInsight {
  id: string;
  weekEndingDate: string;
  headlineSummary: string;
  topPlatform: GigPlatform;
  fairnessRating: string; // e.g., "85% Fair Pay"
  highlights: string[];
  anomaliesOrRisks: string[];
  recommendations: string[];
  projectedMonthlyEarnings: number;
}
