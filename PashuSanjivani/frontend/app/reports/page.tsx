'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { predictAPI } from '@/lib/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/navbar';

interface Report {
  id: string;
  animal_type: string;
  symptoms: string;
  disease: string;
  severity: string;
  suggestion: string;
  created_at: string;
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const isLoading = useProtectedRoute();
  const logout = useAuthStore((state) => state.logout);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await predictAPI.getReports();
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('reports.title')}</h1>
            <p className="text-gray-600">{t('reports.subtitle')}</p>
          </div>
          <a
            href="/predict"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            {t('predict.newReport')}
          </a>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500 mb-4">{t('reports.noReports')}</p>
            <a
              href="/predict"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              {t('predict.newReport')}
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {t(`predict.animalTypes.${report.animal_type}`)} · {new Date(report.created_at).toLocaleDateString()}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">{t('reports.symptoms')}</p>
                        <p className="text-gray-900">{report.symptoms}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                      <p className="text-sm text-red-700 font-medium">{t('predict.disease')}</p>
                      <p className="text-2xl font-bold text-red-700">{report.disease}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 font-medium">{t('predict.severity')}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${
                          report.severity === 'High' ? 'bg-red-100 text-red-800' :
                          report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.severity}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-700 font-medium">{t('predict.suggestion')}</p>
                      <p className="text-gray-900 mt-2">{report.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
