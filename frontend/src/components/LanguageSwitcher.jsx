import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded text-xs transition-colors ${i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('hi')}
        className={`px-2 py-1 rounded text-xs transition-colors ${i18n.language === 'hi' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        हिन्दी
      </button>
      <button 
        onClick={() => changeLanguage('gu')}
        className={`px-2 py-1 rounded text-xs transition-colors ${i18n.language === 'gu' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        ગુજરાતી
      </button>
    </div>
  );
};

export default LanguageSwitcher;
