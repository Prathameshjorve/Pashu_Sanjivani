"use client";

import { useEffect, useState } from "react";
import { useRoleProtectedRoute } from "@/hooks/useRoleProtectedRoute";

interface Report {
  id: number;
  animal_type: string;
  symptoms: string;
  disease: string;
  severity: string;
  confidence: string;
  suggestion: string;
  image_path?: string;
  review_status: string;
  vet_diagnosis?: string;
  vet_advice?: string;
  vet_medicine?: string;
  follow_up_required?: boolean;
  created_at: string;
}

export default function VetDashboard() {
  const isAuthorized = useRoleProtectedRoute(['vet']);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mode, setMode] = useState<"details" | "review" | null>(null);

  const [vetDiagnosis, setVetDiagnosis] = useState("");
  const [vetAdvice, setVetAdvice] = useState("");
  const [vetMedicine, setVetMedicine] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/vet/reports`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (report: Report) => {
    setSelectedReport(report);
    setMode("details");
  };

  const openReview = (report: Report) => {
    setSelectedReport(report);
    setVetDiagnosis(report.vet_diagnosis || "");
    setVetAdvice(report.vet_advice || "");
    setVetMedicine(report.vet_medicine || "");
    setFollowUpRequired(report.follow_up_required || false);
    setMode("review");
  };

  const closeModal = () => {
    setSelectedReport(null);
    setMode(null);
  };

  const submitReview = async () => {
    if (!selectedReport) return;

    try {
      setSaving(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(
        `${apiUrl}/api/vet/reports/${selectedReport.id}/review`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_status: "reviewed",
            vet_diagnosis: vetDiagnosis,
            vet_advice: vetAdvice,
            vet_medicine: vetMedicine,
            follow_up_required: followUpRequired,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit review");
        return;
      }

      alert("Vet review submitted successfully");
      closeModal();
      fetchReports();
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Something went wrong while submitting review");
    } finally {
      setSaving(false);
    }
  };

  const filteredReports = reports.filter((report) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      report.animal_type?.toLowerCase().includes(searchText) ||
      report.disease?.toLowerCase().includes(searchText) ||
      report.symptoms?.toLowerCase().includes(searchText);

    const matchesSeverity =
      severityFilter === "All" || report.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "reviewed" && report.review_status === "reviewed") ||
      (statusFilter === "pending" && report.review_status !== "reviewed");

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const totalReports = reports.length;
  const pendingReports = reports.filter(
    (r) => r.review_status !== "reviewed"
  ).length;
  const reviewedReports = reports.filter(
    (r) => r.review_status === "reviewed"
  ).length;
  const highSeverityReports = reports.filter(
    (r) => r.severity === "High"
  ).length;

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold bg-gray-100">
        {loading ? "Loading reports..." : "Authorizing..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-green-700">
          Vet Dashboard
        </h1>
        <p className="text-gray-600 mt-2 font-medium">
          Review AI-generated livestock disease reports and provide final advice.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">Total Reports</h2>
          <p className="text-4xl font-black text-green-700 mt-2">
            {totalReports}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">Pending Reviews</h2>
          <p className="text-4xl font-black text-yellow-600 mt-2">
            {pendingReports}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">Reviewed Cases</h2>
          <p className="text-4xl font-black text-blue-600 mt-2">
            {reviewedReports}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-gray-500 font-bold">High Severity</h2>
          <p className="text-4xl font-black text-red-600 mt-2">
            {highSeverityReports}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search animal, disease, or symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Severity</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow text-gray-600 font-bold">
          No reports found.
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white rounded-2xl shadow-lg p-6 border-l-8 ${
                report.severity === "High"
                  ? "border-red-500"
                  : report.severity === "Medium"
                  ? "border-yellow-500"
                  : "border-green-500"
              }`}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {report.animal_type || "Unknown Animal"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Report ID: #{report.id}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <div
                    className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      report.severity === "High"
                        ? "bg-red-100 text-red-700"
                        : report.severity === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {report.severity || "Unknown"}
                  </div>

                  {report.review_status === "reviewed" ? (
                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold">
                      Reviewed
                    </div>
                  ) : (
                    <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-bold">
                      Pending
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-gray-700">
                <p>
                  <span className="font-bold text-gray-900">Disease:</span>{" "}
                  {report.disease || "Not available"}
                </p>

                <p>
                  <span className="font-bold text-gray-900">Symptoms:</span>{" "}
                  {report.symptoms || "Not available"}
                </p>

                <p>
                  <span className="font-bold text-gray-900">Confidence:</span>{" "}
                  {report.confidence || "0"}%
                </p>

                <p>
                  <span className="font-bold text-gray-900">Suggestion:</span>{" "}
                  {report.suggestion || "No suggestion available"}
                </p>
              </div>

              {report.severity === "High" && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-bold">
                  Emergency Case: Requires immediate attention.
                </div>
              )}

              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  onClick={() => openReview(report)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
                >
                  Review Case
                </button>

                <button
                  onClick={() => openDetails(report)}
                  className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl font-bold"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedReport && mode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 gap-4">
              <h2 className="text-3xl font-black text-green-700">
                {mode === "details" ? "Report Details" : "Vet Review"}
              </h2>

              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 mb-6 text-gray-700">
              <p>
                <span className="font-bold text-gray-900">Report ID:</span> #
                {selectedReport.id}
              </p>

              <p>
                <span className="font-bold text-gray-900">Animal:</span>{" "}
                {selectedReport.animal_type || "Not available"}
              </p>

              <p>
                <span className="font-bold text-gray-900">Symptoms:</span>{" "}
                {selectedReport.symptoms || "Not available"}
              </p>

              <p>
                <span className="font-bold text-gray-900">AI Prediction:</span>{" "}
                {selectedReport.disease || "Not available"}
              </p>

              <p>
                <span className="font-bold text-gray-900">Severity:</span>{" "}
                {selectedReport.severity || "Not available"}
              </p>

              <p>
                <span className="font-bold text-gray-900">Confidence:</span>{" "}
                {selectedReport.confidence || "0"}%
              </p>

              <p>
                <span className="font-bold text-gray-900">AI Suggestion:</span>{" "}
                {selectedReport.suggestion || "No suggestion available"}
              </p>

              {selectedReport.image_path && (
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${selectedReport.image_path.startsWith('/') ? '' : '/'}${selectedReport.image_path}`}
                  alt="Uploaded animal"
                  className="w-full max-h-80 object-cover rounded-2xl border"
                />
              )}
            </div>

            {mode === "details" && (
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Existing Vet Review
                </h3>

                <p>
                  <span className="font-bold">Diagnosis:</span>{" "}
                  {selectedReport.vet_diagnosis || "Not reviewed yet"}
                </p>

                <p>
                  <span className="font-bold">Advice:</span>{" "}
                  {selectedReport.vet_advice || "Not reviewed yet"}
                </p>

                <p>
                  <span className="font-bold">Medicine:</span>{" "}
                  {selectedReport.vet_medicine || "Not reviewed yet"}
                </p>

                <p>
                  <span className="font-bold">Follow-up Required:</span>{" "}
                  {selectedReport.follow_up_required ? "Yes" : "No"}
                </p>
              </div>
            )}

            {mode === "review" && (
              <div className="space-y-5">
                <div>
                  <label className="font-bold block mb-2">
                    Vet Final Diagnosis
                  </label>
                  <input
                    value={vetDiagnosis}
                    onChange={(e) => setVetDiagnosis(e.target.value)}
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Example: Suspected Lumpy Skin Disease"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-2">Vet Advice</label>
                  <textarea
                    value={vetAdvice}
                    onChange={(e) => setVetAdvice(e.target.value)}
                    className="w-full border rounded-xl p-3 min-h-28 outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Write treatment advice for farmer..."
                  />
                </div>

                <div>
                  <label className="font-bold block mb-2">
                    Medicine Recommendation
                  </label>
                  <textarea
                    value={vetMedicine}
                    onChange={(e) => setVetMedicine(e.target.value)}
                    className="w-full border rounded-xl p-3 min-h-24 outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Mention medicine or say consult local vet before medicine..."
                  />
                </div>

                <label className="flex items-center gap-3 font-bold">
                  <input
                    type="checkbox"
                    checked={followUpRequired}
                    onChange={(e) => setFollowUpRequired(e.target.checked)}
                  />
                  Follow-up required
                </label>

                <button
                  onClick={submitReview}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-bold"
                >
                  {saving ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}