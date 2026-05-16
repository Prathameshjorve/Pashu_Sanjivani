'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/navbar';
import SymptomChat from '@/components/predict/SymptomChat';
import ResultCard from '@/components/predict/ResultCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function PredictPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isLoading = useProtectedRoute();
  const logout = useAuthStore((state) => state.logout);
  const [prediction, setPrediction] = useState<any>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-green-800 font-bold animate-pulse">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F7F4] text-gray-900 selection:bg-green-100">
      <Navbar onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-200">
              {t('predict.aiDiagnosis')}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mt-4 tracking-tight">
              Pashu <span className="text-green-600">Assistant</span>
            </h1>
            <p className="text-gray-600 font-medium max-w-xl mx-auto text-lg md:text-xl">
              {t('predict.assistantSubtitle')}
            </p>
          </motion.div>
        </header>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {!prediction ? (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <SymptomChat onComplete={setPrediction} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ResultCard 
                  prediction={prediction} 
                  onReset={() => setPrediction(null)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-16 text-center text-gray-500 text-sm max-w-2xl mx-auto">
          <p className="italic">
            {t('predict.disclaimer', { defaultValue: 'Note: This AI-generated report is for preliminary screening only. Always consult a certified veterinarian for official diagnosis and treatment.' })}
          </p>
        </footer>
      </main>
    </div>
  );
}