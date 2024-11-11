import { useState } from 'react';
import { TextField, IconButton, Alert, Snackbar } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useTodo } from '../context/TodoContext';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TodoInput = () => {
  const [text, setText] = useState('');
  const { addTodo, error, clearError, loading } = useTodo();
  const { t, language } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      const enMatch = text.match(/^en:(.*)/);
      const zhMatch = text.match(/^zh:(.*)/);
      
      if (enMatch || zhMatch) {
        await addTodo(text.trim());
      } else {
        await addTodo(`${language}:${text.trim()}`);
      }
      if (!error) {
        setText('');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`${t('addTodo')} (${language === 'zh' ? '使用 en: 前缀添加英文' : 'Use zh: prefix to add Chinese'})`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '16px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              },
              '& fieldset': {
                borderColor: 'rgba(0,0,0,0.08)',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          className="w-12 h-12 shadow-sm hover:shadow-md transition-shadow duration-200"
          disabled={loading || !text.trim()}
        >
          <AddCircleIcon className="text-3xl" />
        </IconButton>
      </form>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </motion.div>
  );
};

export default TodoInput; 