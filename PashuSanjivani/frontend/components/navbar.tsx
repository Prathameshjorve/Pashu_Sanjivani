"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type NavbarProps = {
  onLogout?: () => void;
};

export default function Navbar({ onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
      setCurrentLang(savedLang);
    } else {
      setCurrentLang(i18n.language);
    }
  }, [i18n]);

  // Update state when language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };
    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LEFT LOGO */}
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white text-xl">
            ❤
          </div>
          <span className="text-xl font-bold text-green-700">
            {t("common.appName")}
          </span>
        </Link>

        {/* CENTER NAV */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <Link href="/dashboard" className="hover:text-green-600 transition">
            {t("dashboard.welcome")}
          </Link>
          <Link href="/predict" className="hover:text-green-600 transition">
            {t("predict.title")}
          </Link>
          <Link href="/reports" className="hover:text-green-600 transition">
            {t("reports.title")}
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* 🌍 Language */}
          <select
            className="border rounded-lg px-3 py-1 text-sm bg-white"
            value={currentLang}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="mr">MAR</option>
          </select>

          {/* 👤 Profile */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                P
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border">
                <div className="px-4 py-3 border-b">
                  <p className="font-medium">Prathamesh</p>
                  <p className="text-sm text-gray-500">
                    {t("common.language")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                >
                  {t("common.logout")}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}