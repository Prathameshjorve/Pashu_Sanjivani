"use client";

import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Phone, ArrowLeft, Heart, Award, Clock } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useRoleProtectedRoute } from "@/hooks/useRoleProtectedRoute";

const VET_DATA = [
  {
    name: "Pet Clinic Pune",
    location: "Kothrud, Pune",
    specialty: "Multi-Specialty Hospital",
    phone: "+91 98765 43210",
    rating: "4.8",
    timing: "24/7"
  },
  {
    name: "Bombay Veterinary College",
    location: "Parel, Mumbai",
    specialty: "Government Research Hospital",
    phone: "+022 2413 1180",
    rating: "4.5",
    timing: "9:00 AM - 6:00 PM"
  },
  {
    name: "Happy Tails Vet",
    location: "Deccan, Pune",
    specialty: "Livestock & Pet Care",
    phone: "+91 88888 77777",
    rating: "4.9",
    timing: "8:00 AM - 10:00 PM"
  },
  {
    name: "Nashik Pet Care Centre",
    location: "College Road, Nashik",
    specialty: "Advanced Surgery & Diagnostics",
    phone: "+91 99999 11111",
    rating: "4.7",
    timing: "24 Hours"
  },
  {
    name: "Aurangabad Animal Hospital",
    location: "Kranti Chowk, Chhatrapati Sambhajinagar",
    specialty: "Emergency Veterinary Care",
    phone: "+91 77777 55555",
    rating: "4.6",
    timing: "9:00 AM - 9:00 PM"
  }
];

export default function VetsPage() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const isAuthorized = useRoleProtectedRoute(['farmer']);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
      <Navbar onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-green-700 font-bold mb-8 hover:gap-3 transition-all">
            <ArrowLeft className="w-5 h-5" />
            {t("common.back")}
          </button>
        </Link>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {t("dashboard.vets.title")}
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              {t("dashboard.vets.subtitle")}
            </p>
          </motion.div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VET_DATA.map((vet, i) => (
            <motion.div
              key={vet.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white hover:border-green-200 transition-all group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart className="w-24 h-24 text-green-600" />
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-700">
                  <Award className="w-8 h-8" />
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-xl text-xs font-black tracking-tighter">
                  ⭐ {vet.rating}
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                {vet.name}
              </h3>
              <p className="text-green-600 font-bold text-sm mb-6 flex items-center gap-1">
                <Award className="w-3 h-3" />
                {vet.specialty}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-sm">{vet.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-sm">{vet.timing}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="font-bold text-sm">{vet.phone}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-black text-sm shadow-lg shadow-green-100 transition-all transform hover:-translate-y-1">
                  {t("dashboard.vets.call")}
                </button>
                <button className="flex-1 bg-white border-2 border-green-50 hover:bg-green-50 text-green-700 py-3 rounded-2xl font-black text-sm transition-all transform hover:-translate-y-1">
                  {t("dashboard.vets.directions")}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
