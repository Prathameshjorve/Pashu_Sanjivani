"use client";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n";
import { ReactNode, useEffect, useState } from "react";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      const handleInitialized = () => setIsReady(true);
      i18n.on("initialized", handleInitialized);
      return () => {
        i18n.off("initialized", handleInitialized);
      };
    }
  }, []);

  // Listen for language changes to ensure all components re-render
  useEffect(() => {
    const handleLanguageChanged = () => {
      // Force sync with i18n state
    };
    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  if (!isReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}