import { IconButton } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { toggleLanguage, language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-4 right-16"
    >
      <IconButton
        onClick={toggleLanguage}
        className="bg-surface-light dark:bg-surface-dark"
        title={language === 'zh' ? 'Switch to English' : '切换为中文'}
      >
        <TranslateIcon className="text-gray-600 dark:text-gray-400" />
      </IconButton>
    </motion.div>
  );
};

export default LanguageToggle; 