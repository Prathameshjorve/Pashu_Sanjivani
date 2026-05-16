"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { t } = useTranslation();

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
          <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm border border-green-200">
            {t("dashboard.hero.badge")}
          </span>

          <h1 className="text-5xl md:text-6xl font-black leading-[1.1] text-gray-900 tracking-tight">
            {t("dashboard.hero.title")}
            <span className="text-green-600 block mt-2">{t("dashboard.hero.subtitle")}</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 font-medium max-w-lg leading-relaxed">
            {t("dashboard.hero.description")}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link href="/predict">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-green-100 transition-all font-black text-lg transform hover:-translate-y-1">
                {t("dashboard.hero.startBtn")}
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
            src="https://images.unsplash.com/photo-1595433707802-89cde4b90f3f?q=80&w=1200"
            className="rounded-[2.5rem] shadow-2xl relative z-10 border-8 border-white"
            alt="Animal Health"
          />

        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "📸", key: "photo" },
            { icon: "📝", key: "symptoms" },
            { icon: "🤖", key: "prediction" },
            { icon: "🏥", key: "vets", link: "/vets" }
          ].map((feature, i) => (
            <motion.div 
              key={feature.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all border border-white hover:border-green-200 group"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition duration-300 inline-block">{feature.icon}</div>
              <h3 className="text-2xl font-black text-gray-800 mb-3">{t(`dashboard.features.${feature.key}.title`)}</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-4">
                {t(`dashboard.features.${feature.key}.desc`)}
              </p>
              {feature.link && (
                <Link href={feature.link}>
                  <button className="text-green-600 font-black text-sm uppercase tracking-widest hover:underline">
                    {t("dashboard.vets.viewAll")} →
                  </button>
                </Link>
              )}
            </motion.div>
          ))}

        </div>
      </section>

      {/* RECENT REPORTS PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-white">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {t("dashboard.recentActivity")}
            </h2>
            <Link href="/reports" className="text-green-600 font-black text-sm uppercase tracking-widest hover:underline">
              {t("dashboard.viewReports")} →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">{t("dashboard.table.animal")}</th>
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">{t("dashboard.table.disease")}</th>
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">{t("dashboard.table.severity")}</th>
                  <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">{t("dashboard.table.date")}</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 font-bold">
                <tr className="group">
                  <td className="py-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">🐄</div>
                    {t("predict.animalTypes.buffalo")}
                  </td>
                  <td className="py-6">{t("predict.result.healthAnalysis")}</td>
                  <td className="py-6">
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-xl text-xs font-black uppercase">
                      {t("predict.result.risk")}
                    </span>
                  </td>
                  <td className="py-6 text-gray-400">21 Feb 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>
  );
}