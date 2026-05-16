import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
}));

interface Report {
  id: string;
  animal_type: string;
  symptoms: string;
  disease: string;
  severity: string;
  suggestion: string;
  created_at: string;
}

interface ReportStore {
  reports: Report[];
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({ reports: [report, ...state.reports] })),
}));
