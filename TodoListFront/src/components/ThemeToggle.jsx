import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-4 right-4"
    >
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        className="bg-surface-light dark:bg-surface-dark"
      >
        {darkMode ? (
          <Brightness7Icon className="text-yellow-400" />
        ) : (
          <Brightness4Icon className="text-gray-600" />
        )}
      </IconButton>
    </motion.div>
  );
};

export default ThemeToggle; 