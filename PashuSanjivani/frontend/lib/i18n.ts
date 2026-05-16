"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// import translation files
import en from "../i18n/en.json";
import hi from "../i18n/hi.json";
import mr from "../i18n/mr.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },

    lng:
      typeof window !== "undefined"
        ? localStorage.getItem("lang") || "en"
        : "en",

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },
  });
}

export default i18n;