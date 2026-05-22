import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  role: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  const storedUser = typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  return {
    user: storedUser,
    role: storedUser?.role || null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    setUser: (user) => {
      set({ user, role: user?.role || null });
      if (typeof window !== 'undefined') {
        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
      }
    },
    setToken: (token) => {
      set({ token });
      if (typeof window !== 'undefined') {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
      }
    },
    logout: () => {
      set({ user: null, token: null, role: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
  };
});

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
