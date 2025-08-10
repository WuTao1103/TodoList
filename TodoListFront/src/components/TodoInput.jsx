import React, { useState } from 'react';
import { Box, TextField, IconButton, Card, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';
import AddTaskIcon from '@mui/icons-material/AddTask';

const TodoInput = () => {
  const [inputValue, setInputValue] = useState('');
  const { addTodo, loading } = useTodo();
  const { language } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      await addTodo(inputValue.trim());
      setInputValue('');
    }
  };

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
            <Box className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <AddTaskIcon className="text-white" />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-900 dark:text-white"
                sx={{ fontWeight: 600 }}
              >
                {language === 'zh' ? '添加新任务' : 'Add New Task'}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-gray-500 dark:text-gray-400"
              >
                {language === 'zh' ? '创建您的下一个待办事项' : 'Create your next todo item'}
              </Typography>
            </Box>
          </Box>

          {/* Input Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="flex gap-3"
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder={language === 'zh' ? '输入任务内容...' : 'Enter task content...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  }
                }
              }}
            />
            <IconButton
              type="submit"
              disabled={!inputValue.trim() || loading}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                color: 'white',
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)',
                width: '48px',
                height: '48px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0056CC 0%, #4A47B8 100%)',
                  boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #E5E5EA 0%, #D1D1D6 100%)',
                  boxShadow: 'none',
                  color: '#8E8E93'
                }
              }}
            >
              <Add />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );
};

export default TodoInput;