"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Brain,
  Camera,
  Stethoscope,
  Activity,
  ShieldAlert,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useRoleProtectedRoute } from "@/hooks/useRoleProtectedRoute";

export default function Dashboard() {
  const { t } = useTranslation();
  const isAuthorized = useRoleProtectedRoute(['farmer']);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Authorizing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 pb-20">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-10 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >

          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm border border-green-200">
            <Activity className="w-4 h-4" />
            {t("dashboard.hero.badge")}
          </span>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-gray-900 tracking-tight">
            {t("dashboard.hero.title")}
            <span className="text-green-600 block mt-2">
              {t("dashboard.hero.subtitle")}
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 font-medium max-w-lg leading-relaxed">
            {t("dashboard.hero.description")}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">

            <Link href="/predict">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-green-100 transition-all font-black text-lg transform hover:-translate-y-1 flex items-center gap-2">
                {t("dashboard.hero.startBtn")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <Link href="/reports">
              <button className="bg-white border-2 border-green-100 text-green-700 px-8 py-4 rounded-2xl shadow-lg hover:bg-green-50 transition-all font-black text-lg transform hover:-translate-y-1">
                {t("dashboard.hero.viewBtn")}
              </button>
            </Link>

          </div>

        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >

          <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-[3rem] blur-2xl opacity-20"></div>

          <img
            src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1400&auto=format&fit=crop"
            className="rounded-[2.5rem] shadow-2xl relative z-10 border-8 border-white object-cover h-[500px] w-full"
            alt="Livestock Health AI"
          />

        </motion.div>

      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 py-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white">

            <p className="text-sm uppercase tracking-widest text-gray-400 font-black mb-3">
              Total Reports
            </p>

            <h2 className="text-5xl font-black text-green-700">
              128
            </h2>

            <p className="text-sm text-gray-500 font-bold mt-2">
              Farmer submissions
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white">

            <p className="text-sm uppercase tracking-widest text-gray-400 font-black mb-3">
              AI Accuracy
            </p>

            <h2 className="text-5xl font-black text-blue-700">
              97%
            </h2>

            <p className="text-sm text-gray-500 font-bold mt-2">
              Disease prediction
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white">

            <p className="text-sm uppercase tracking-widest text-gray-400 font-black mb-3">
              Vet Reviews
            </p>

            <h2 className="text-5xl font-black text-purple-700">
              54
            </h2>

            <p className="text-sm text-gray-500 font-bold mt-2">
              Expert validations
            </p>

          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-xl border border-white">

            <p className="text-sm uppercase tracking-widest text-gray-400 font-black mb-3">
              Emergency Cases
            </p>

            <h2 className="text-5xl font-black text-red-600">
              12
            </h2>

            <p className="text-sm text-gray-500 font-bold mt-2">
              High severity reports
            </p>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            {
              icon: Camera,
              title: "Upload Images",
              desc: "Farmers can upload livestock images for disease analysis.",
              color: "green",
            },
            {
              icon: Brain,
              title: "AI Prediction",
              desc: "AI predicts disease, confidence score, and severity.",
              color: "blue",
            },
            {
              icon: Stethoscope,
              title: "Vet Review",
              desc: "Veterinary experts review reports and provide final advice.",
              color: "purple",
            },
            {
              icon: ShieldAlert,
              title: "Emergency Alerts",
              desc: "High severity cases can be prioritized for urgent attention.",
              color: "red",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-white hover:border-green-200 group"
              >

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.color === "green"
                    ? "bg-green-100"
                    : feature.color === "blue"
                    ? "bg-blue-100"
                    : feature.color === "purple"
                    ? "bg-purple-100"
                    : "bg-red-100"
                }`}>

                  <Icon className={`w-8 h-8 ${
                    feature.color === "green"
                      ? "text-green-700"
                      : feature.color === "blue"
                      ? "text-blue-700"
                      : feature.color === "purple"
                      ? "text-purple-700"
                      : "text-red-700"
                  }`} />

                </div>

                <h3 className="text-2xl font-black text-gray-800 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 font-medium leading-relaxed">
                  {feature.desc}
                </p>

              </motion.div>
            );
          })}

        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white">

          <div className="flex justify-between items-center mb-10">

            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Quick Actions
            </h2>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <Link href="/predict">
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-[2rem] p-8 shadow-xl hover:scale-[1.02] transition cursor-pointer">

                <Camera className="w-12 h-12 mb-5" />

                <h3 className="text-2xl font-black mb-3">
                  Start Prediction
                </h3>

                <p className="text-green-50 font-medium">
                  Upload symptoms and images for AI analysis.
                </p>

              </div>
            </Link>

            <Link href="/reports">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-[2rem] p-8 shadow-xl hover:scale-[1.02] transition cursor-pointer">

                <FileText className="w-12 h-12 mb-5" />

                <h3 className="text-2xl font-black mb-3">
                  View Reports
                </h3>

                <p className="text-blue-50 font-medium">
                  Track all submitted reports and vet reviews.
                </p>

              </div>
            </Link>

            <Link href="/vets">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-[2rem] p-8 shadow-xl hover:scale-[1.02] transition cursor-pointer">

                <Stethoscope className="w-12 h-12 mb-5" />

                <h3 className="text-2xl font-black mb-3">
                  Find Vets
                </h3>

                <p className="text-purple-50 font-medium">
                  Connect with veterinary experts for guidance.
                </p>

              </div>
            </Link>

          </div>

        </div>

      </section>

      {/* RECENT REPORTS */}
      <section className="max-w-7xl mx-auto px-6 py-12">

        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white">

          <div className="flex justify-between items-center mb-10">

            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Recent Activity
            </h2>

            <Link
              href="/reports"
              className="text-green-600 font-black text-sm uppercase tracking-widest hover:underline"
            >
              View Reports →
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead>

                <tr className="border-b border-gray-100">

                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">
                    Animal
                  </th>

                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">
                    Disease
                  </th>

                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">
                    Severity
                  </th>

                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody className="text-gray-700 font-bold">

                <tr>

                  <td className="py-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                      🐄
                    </div>

                    Buffalo
                  </td>

                  <td className="py-6">
                    Lumpy Skin Disease
                  </td>

                  <td className="py-6">

                    <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase">
                      Medium
                    </span>

                  </td>

                  <td className="py-6 text-gray-400">
                    21 Feb 2026
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  );
}