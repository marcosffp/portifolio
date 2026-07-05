import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ floating = false }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      aria-label={language === 'pt-BR' ? 'Switch to English' : 'Mudar para Português'}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all duration-300 ${
        floating
          ? 'fixed top-4 right-4 z-50 shadow-lg bg-black/70 border-white/20 backdrop-blur-md hover:bg-black/80'
          : 'border-white/10 bg-white/5 hover:bg-white/10'
      }`}
    >
      <span className={language === 'pt-BR' ? 'text-white' : 'text-gray-500'}>PT</span>
      <span className="text-gray-500 mx-0.5">|</span>
      <span className={language === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
    </button>
  );
};

export default LanguageToggle;
