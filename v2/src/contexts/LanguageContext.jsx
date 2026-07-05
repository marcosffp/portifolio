import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('portfolio-lang') || 'pt-BR'
  );

  const toggleLanguage = () => {
    const next = language === 'pt-BR' ? 'en' : 'pt-BR';
    setLanguage(next);
    localStorage.setItem('portfolio-lang', next);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export const useTranslation = () => {
  const { language, toggleLanguage } = useLanguage();
  return { t: translations[language], language, toggleLanguage };
};
