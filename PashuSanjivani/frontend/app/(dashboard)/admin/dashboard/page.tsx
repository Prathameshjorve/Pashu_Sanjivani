"use client";

import { useEffect, useState } from "react";
import { useRoleProtectedRoute } from "@/hooks/useRoleProtectedRoute";

interface Report {
  id: number;
  animal_type: string;
  disease: string;
  severity: string;
  review_status: string;
}

export default function AdminDashboard() {
  const isAuthorized = useRoleProtectedRoute(['admin']);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vet/reports`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchReports();
    }
  }, [isAuthorized]);

  const totalReports = reports.length;

  const reviewedReports = reports.filter(
    (r) => r.review_status === "reviewed"
  ).length;

  const pendingReports = reports.filter(
    (r) => r.review_status !== "reviewed"
  ).length;

  const highSeverityReports = reports.filter(
    (r) => r.severity === "High"
  ).length;

  const diseaseCounts: Record<string, number> = {};

  reports.forEach((report) => {
    const disease = report.disease || "Unknown";

    diseaseCounts[disease] = (diseaseCounts[disease] || 0) + 1;
  });

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        {loading ? "Loading admin dashboard..." : "Authorizing..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">

      <div className="mb-8">
        <h1 className="text-4xl font-black text-purple-700">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-2 font-medium">
          Platform monitoring and analytics overview.
        </p>
      </div>

      {/* TOP STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">
            Total Reports
          </h2>

          <p className="text-4xl font-black text-purple-700 mt-2">
            {totalReports}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">
            Reviewed Cases
          </h2>

          <p className="text-4xl font-black text-blue-600 mt-2">
            {reviewedReports}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">
            Pending Reviews
          </h2>

          <p className="text-4xl font-black text-yellow-600 mt-2">
            {pendingReports}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">
            High Severity Cases
          </h2>

          <p className="text-4xl font-black text-red-600 mt-2">
            {highSeverityReports}
          </p>
        </div>

      </div>

      {/* DISEASE ANALYTICS */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="text-2xl font-black text-gray-900 mb-6">
          Disease Analytics
        </h2>

        {Object.keys(diseaseCounts).length === 0 ? (
          <p className="text-gray-500">
            No disease data available.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {Object.entries(diseaseCounts).map(([disease, count]) => (

              <div
                key={disease}
                className="border rounded-2xl p-5 bg-gray-50"
              >

                <h3 className="text-lg font-bold text-gray-900">
                  {disease}
                </h3>

                <p className="text-3xl font-black text-purple-700 mt-3">
                  {count}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Total Cases
                </p>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}