import type { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Get stored access token from localStorage
 */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tirtanexa_token");
}

/**
 * Core fetch wrapper with auth token injection and error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 — redirect to login
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tirtanexa_token");
      localStorage.removeItem("tirtanexa_user");
      window.location.href = "/login";
    }
    throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
  }

  const data: ApiResponse<T> = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || data.error || "Terjadi kesalahan.");
  }

  return data.data as T;
}

/* ============ AUTH ============ */
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ user: import("./types").User; session: { accessToken: string; refreshToken: string; expiresAt: number } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, fullName: string) =>
      request<{ user: import("./types").User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      }),

    getMe: () => request<import("./types").User>("/auth/me"),

    updateProfile: (data: { fullName?: string; avatarUrl?: string }) =>
      request<import("./types").User>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  /* ============ SUBJECTS & CHAPTERS ============ */
  subjects: {
    getAll: () => request<import("./types").Subject[]>("/subjects"),
    getChapters: (subjectId: string) =>
      request<import("./types").Chapter[]>(`/subjects/${subjectId}/chapters`),
    getChapter: (chapterId: string) =>
      request<import("./types").Chapter>(`/chapters/${chapterId}`),
  },

  /* ============ QUESTIONS ============ */
  questions: {
    getAll: (params?: { chapterId?: string; difficulty?: string; page?: number; limit?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.chapterId) searchParams.set("chapterId", params.chapterId);
      if (params?.difficulty) searchParams.set("difficulty", params.difficulty);
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));
      const qs = searchParams.toString();
      return request<import("./types").Question[]>(`/questions${qs ? `?${qs}` : ""}`);
    },
    getById: (id: string) => request<import("./types").Question>(`/questions/${id}`),
    create: (data: Partial<import("./types").Question> & { options?: Partial<import("./types").QuestionOption>[] }) =>
      request<import("./types").Question>("/questions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<import("./types").Question>) =>
      request<import("./types").Question>(`/questions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/questions/${id}`, { method: "DELETE" }),
  },

  /* ============ EXAMS ============ */
  exams: {
    startPractice: (data: { chapterId: string; difficulty?: string; questionCount?: number }) =>
      request<import("./types").ExamSession>("/exams/practice", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    startTryout: (data: { subjectIds: string[] }) =>
      request<import("./types").ExamSession>("/exams/tryout", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getHistory: () => request<import("./types").ExamSession[]>("/exams/history"),
    getDetail: (id: string) => request<import("./types").ExamSession>(`/exams/${id}`),
    submitAnswer: (examId: string, data: { questionId: string; selectedOptionId: string }) =>
      request<import("./types").ExamAnswer>(`/exams/${examId}/answer`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    finish: (examId: string) =>
      request<import("./types").ExamSession>(`/exams/${examId}/finish`, {
        method: "POST",
      }),
  },

  /* ============ TOURNAMENTS ============ */
  tournaments: {
    create: (data: { title: string; description?: string; chapterIds: string[]; questionCount: number; timeLimit: number; maxParticipants?: number }) =>
      request<import("./types").Tournament>("/tournaments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    join: (code: string) =>
      request<import("./types").TournamentParticipant>("/tournaments/join", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    getDetail: (id: string) => request<import("./types").Tournament>(`/tournaments/${id}`),
    start: (id: string) =>
      request<import("./types").Tournament>(`/tournaments/${id}/start`, {
        method: "POST",
      }),
    submitAnswer: (id: string, data: { questionId: string; selectedOptionId: string }) =>
      request<import("./types").ExamAnswer>(`/tournaments/${id}/answer`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    finish: (id: string) =>
      request<import("./types").Tournament>(`/tournaments/${id}/finish`, {
        method: "POST",
      }),
    getLeaderboard: (id: string) =>
      request<import("./types").TournamentParticipant[]>(`/tournaments/${id}/leaderboard`),
  },
};
