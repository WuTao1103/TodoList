import { Box, Typography, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';

const TodoStats = () => {
  const { stats } = useTodo();
  const progress = stats.total ? (stats.completed / stats.total) * 100 : 0;
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-surface-light dark:bg-surface-dark rounded-xl p-6
        shadow-sm hover:shadow-md transition-shadow duration-300
        border border-gray-100 dark:border-gray-800"
    >
      <Typography variant="h6" className="mb-4 font-semibold">
        {t('progress')}
      </Typography>
      <Box className="mb-4">
        <LinearProgress
          variant="determinate"
          value={progress}
          className="h-2 rounded-full"
          sx={{
            backgroundColor: 'rgba(0,0,0,0.05)',
            '.MuiLinearProgress-bar': {
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #007AFF, #00C6FF)'
            }
          }}
        />
      </Box>
      <Box className="flex justify-between text-gray-600 dark:text-gray-400">
        <Typography className="font-medium">{t('total')}: {stats.total}</Typography>
        <Typography className="font-medium">{t('completed')}: {stats.completed}</Typography>
        <Typography className="font-medium">{t('active')}: {stats.active}</Typography>
      </Box>
    </motion.div>
  );
};

export default TodoStats; 