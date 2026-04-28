/* ============ ENUMS ============ */
export type Role = "STUDENT" | "ADMIN" | "TEACHER";
export type Category = "UTBK" | "SD" | "SMP" | "SMA";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type ExamType = "PRACTICE" | "TRYOUT" | "TOURNAMENT";
export type ExamStatus = "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
export type TournamentStatus = "WAITING" | "STARTING" | "IN_PROGRESS" | "FINISHED";

/* ============ USER ============ */
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: Role;
  createdAt: string;
}

/* ============ SUBJECT & CHAPTER ============ */
export interface Subject {
  id: string;
  name: string;
  code: string;
  category: Category;
  description: string | null;
  iconUrl: string | null;
  order: number;
  chapters?: Chapter[];
  _count?: { chapters: number };
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  code: string;
  description: string | null;
  order: number;
  subject?: Subject;
  _count?: { questions: number };
}

/* ============ QUESTION ============ */
export interface QuestionOption {
  id: string;
  questionId: string;
  label: string;
  content: string;
  isCorrect: boolean;
  imageUrl: string | null;
  order: number;
}

export interface Question {
  id: string;
  chapterId: string;
  content: string;
  explanation: string | null;
  difficulty: Difficulty;
  paramA: number;
  paramB: number;
  paramC: number;
  imageUrl: string | null;
  isActive: boolean;
  chapter?: Chapter;
  options?: QuestionOption[];
}

/* ============ EXAM ============ */
export interface ExamSession {
  id: string;
  userId: string;
  type: ExamType;
  title: string;
  status: ExamStatus;
  totalQuestions: number;
  correctAnswers: number;
  rawScore: number | null;
  irtTheta: number | null;
  irtScore: number | null;
  timeLimit: number | null;
  startedAt: string;
  finishedAt: string | null;
  answers?: ExamAnswer[];
}

export interface ExamAnswer {
  id: string;
  examSessionId: string;
  questionId: string;
  selectedOptionId: string | null;
  isCorrect: boolean | null;
  answeredAt: string | null;
  timeSpent: number | null;
  question?: Question;
}

/* ============ TOURNAMENT ============ */
export interface Tournament {
  id: string;
  title: string;
  description: string | null;
  hostUserId: string;
  code: string;
  status: TournamentStatus;
  maxParticipants: number;
  timeLimit: number;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  participants?: TournamentParticipant[];
  questions?: TournamentQuestion[];
  _count?: { participants: number; questions: number };
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  userId: string;
  score: number;
  rank: number | null;
  completedAt: string | null;
  joinedAt: string;
  user?: User;
}

export interface TournamentQuestion {
  id: string;
  tournamentId: string;
  questionId: string;
  order: number;
  question?: Question;
}

/* ============ API RESPONSE ============ */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ============ AUTH ============ */
export interface LoginResponse {
  user: User;
  session: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

export interface RegisterResponse {
  user: User;
}

/* ============ DASHBOARD STATS ============ */
export interface DashboardStats {
  totalExams: number;
  averageScore: number;
  tournamentRank: number | null;
  recentExams: ExamSession[];
}

/* ============ SIDEBAR NAV ============ */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
  children?: NavItem[];
}
