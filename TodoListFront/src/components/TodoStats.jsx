import { Box, Typography, LinearProgress, Card, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const TodoStats = () => {
  const { stats } = useTodo();
  const progress = stats.total ? (stats.completed / stats.total) * 100 : 0;
  const { t, language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card 
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        sx={{
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <Box className="p-6">
          {/* Header */}
          <Box className="flex items-center gap-3 mb-4">
            <Box className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
              <TrendingUpIcon className="text-white" />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-900 dark:text-white"
                sx={{ fontWeight: 600 }}
              >
                {t('progress')}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-gray-500 dark:text-gray-400"
              >
                {language === 'zh' ? '任务完成进度' : 'Task completion progress'}
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box className="mb-6">
            <Box className="flex justify-between items-center mb-2">
              <Typography 
                variant="body2" 
                className="text-gray-600 dark:text-gray-400 font-medium"
              >
                {language === 'zh' ? '完成度' : 'Completion'}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-gray-900 dark:text-white font-semibold"
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: '8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, #007AFF 0%, #5856D6 100%)',
                  boxShadow: '0 2px 4px rgba(0, 122, 255, 0.3)'
                }
              }}
            />
          </Box>

          {/* Stats Grid */}
          <Box className="grid grid-cols-3 gap-3">
            <Box className="text-center p-3 bg-gray-50/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <Typography 
                variant="h4" 
                className="font-bold text-gray-900 dark:text-white mb-1"
                sx={{ fontWeight: 700 }}
              >
                {stats.total}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-gray-500 dark:text-gray-400 font-medium"
              >
                {t('total')}
              </Typography>
            </Box>
            
            <Box className="text-center p-3 bg-green-50/80 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30">
              <Typography 
                variant="h4" 
                className="font-bold text-green-600 dark:text-green-400 mb-1"
                sx={{ fontWeight: 700 }}
              >
                {stats.completed}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-green-600 dark:text-green-400 font-medium"
              >
                {t('completed')}
              </Typography>
            </Box>
            
            <Box className="text-center p-3 bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-200/50 dark:border-orange-700/30">
              <Typography 
                variant="h4" 
                className="font-bold text-orange-600 dark:text-orange-400 mb-1"
                sx={{ fontWeight: 700 }}
              >
                {stats.active}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-orange-600 dark:text-orange-400 font-medium"
              >
                {t('active')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default TodoStats; 