import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, ErrorType } from "./types";
import { translations } from "./translations";

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
  selectedErrorType: ErrorType | 'all';
  setSelectedErrorType: (type: ErrorType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// Create a context with default values
const AppContext = createContext<AppContextType>({
  language: 'zh',
  setLanguage: () => {},
  translate: (key) => key,
  selectedErrorType: 'all',
  setSelectedErrorType: () => {},
  searchQuery: '',
  setSearchQuery: () => {}
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const translate = (key: string): string => {
    if (!translations[language]) {
      return key;
    }
    
    // Type-safe way to access translations
    const translationMap = translations[language] as Record<string, string>;
    if (!translationMap[key]) {
      return key;
    }
    
    return translationMap[key];
  };

  // Store user preferences in localStorage
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [language]);

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      translate,
      selectedErrorType,
      setSelectedErrorType,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  return useContext(AppContext);
};
