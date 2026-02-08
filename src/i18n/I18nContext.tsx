import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language, type Translations } from './translations';

interface I18nContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_KEY = 'auracode_language';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    }
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Add/remove RTL class for styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  }, [language]);

  const t = translations[language];
  const isRTL = language === 'ar';

  return (
    <I18nContext.Provider
      value={{
        language,
        t,
        setLanguage,
        toggleLanguage,
        isRTL,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
