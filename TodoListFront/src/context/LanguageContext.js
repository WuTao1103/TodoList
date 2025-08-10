import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    title: 'Todo List',
    subtitle: 'Organize your tasks efficiently',
    progress: 'Progress',
    total: 'Total',
    completed: 'Completed',
    active: 'Active',
    noTodos: 'No tasks yet. Add one above!',
  },
  zh: {
    title: '待办事项',
    subtitle: '高效管理您的任务',
    progress: '进度',
    total: '总计',
    completed: '已完成',
    active: '待完成',
    noTodos: '暂无任务，请添加新任务！',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
      <LanguageContext.Provider value={{
        language,
        setLanguage,
        toggleLanguage,
        t
      }}>
        {children}
      </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};