'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { predictAPI } from '@/lib/api';
import { useRoleProtectedRoute } from '@/hooks/useRoleProtectedRoute';


interface Report {
  id: string;
  animal_type: string;
  symptoms: string;
  disease: string;
  severity: string;
  suggestion: string;
  created_at: string;

  review_status?: string;
  vet_diagnosis?: string;
  vet_advice?: string;
  vet_medicine?: string;
  follow_up_required?: boolean;
  image_path?: string;
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const isAuthorized = useRoleProtectedRoute(['farmer']);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthorized) {
      fetchReports();
    }
  }, [isAuthorized]);

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


  return (
    <>
      {!isAuthorized ? (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">{t('common.loading')}</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

        <main className="container mx-auto px-4 py-8 max-w-6xl">

          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {t('reports.title')}
              </h1>

              <p className="text-gray-600">
                {t('reports.subtitle')}
              </p>
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
              <p className="text-gray-500">
                {t('common.loading')}
              </p>
            </div>

          ) : reports.length === 0 ? (

            <div className="bg-white rounded-lg shadow p-6 text-center">

              <p className="text-gray-500 mb-4">
                {t('reports.noReports')}
              </p>

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

                <div
                  key={report.id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
                >

                  <div className="grid md:grid-cols-2 gap-6">

                    {/* LEFT SIDE */}
                    <div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {t(`predict.animalTypes.${report.animal_type}`)} ·{" "}
                        {new Date(report.created_at).toLocaleDateString()}
                      </h3>

                      <div className="space-y-3">

                        <div>
                          <p className="text-sm text-gray-600 font-medium">
                            {t('reports.symptoms')}
                          </p>

                          <p className="text-gray-900">
                            {report.symptoms}
                          </p>
                        </div>
                        
                        {report.image_path && (
                          <div className="mt-4">
                            <img 
                              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${report.image_path.startsWith('/') ? '' : '/'}${report.image_path}`}
                              alt="Uploaded animal"
                              className="w-full max-h-60 object-cover rounded-xl border shadow-sm"
                            />
                          </div>
                        )}

                      </div>

                    </div>

                    {/* RIGHT SIDE */}
                    <div className="space-y-4">

                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">

                        <p className="text-sm text-red-700 font-medium">
                          {t('predict.disease')}
                        </p>

                        <p className="text-2xl font-bold text-red-700">
                          {report.disease}
                        </p>

                      </div>

                      <div className="flex gap-4">

                        <div className="flex-1 bg-gray-50 rounded-xl p-4">

                          <p className="text-sm text-gray-600 font-medium">
                            {t('predict.severity')}
                          </p>

                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold ${
                              report.severity === 'High'
                                ? 'bg-red-100 text-red-800'
                                : report.severity === 'Medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {report.severity}
                          </span>

                        </div>

                      </div>

                      <div className="bg-blue-50 rounded-xl p-4">

                        <p className="text-sm text-blue-700 font-medium">
                          {t('predict.suggestion')}
                        </p>

                        <p className="text-gray-900 mt-2">
                          {report.suggestion}
                        </p>

                      </div>

                      {/* VET REVIEW */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">

                        <div className="flex items-center justify-between mb-4">

                          <h3 className="text-lg font-bold text-green-700">
                            Vet Review
                          </h3>

                          {report.review_status === "reviewed" ? (

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                              Reviewed
                            </span>

                          ) : (

                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                              Pending
                            </span>

                          )}

                        </div>

                        <div className="space-y-3">

                          <div>

                            <p className="text-sm text-gray-600 font-medium">
                              Vet Diagnosis
                            </p>

                            <p className="text-gray-900">
                              {report.vet_diagnosis || "Waiting for vet review"}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-gray-600 font-medium">
                              Vet Advice
                            </p>

                            <p className="text-gray-900">
                              {report.vet_advice || "Waiting for vet advice"}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-gray-600 font-medium">
                              Medicine Recommendation
                            </p>

                            <p className="text-gray-900">
                              {report.vet_medicine || "No medicine prescribed yet"}
                            </p>

                          </div>

                          <div>

                            <p className="text-sm text-gray-600 font-medium">
                              Follow-up Required
                            </p>

                            <p className="text-gray-900">
                              {report.follow_up_required ? "Yes" : "No"}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </main>

      </div>
      )}
    </>
  );
}