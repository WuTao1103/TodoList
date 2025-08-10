import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import TodoInput from '../components/TodoInput';
import TodoList from '../components/TodoList';
import TodoStats from '../components/TodoStats';
import TodoFilter from '../components/TodoFilter';
import TodoExtractor from '../components/TodoExtractor';
import { useLanguage } from '../context/LanguageContext';

const MainPage = () => {
  const { t } = useLanguage();

  return (
      <Container maxWidth="md" className="min-h-screen py-8">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
          {/* Header title */}
          <Box className="text-center mb-8">
            <Typography
                variant="h3"
                component="h1"
                className="font-bold text-gray-800 dark:text-gray-100 mb-2"
            >
              {t('title')}
            </Typography>
            <Typography
                variant="subtitle1"
                className="text-gray-600 dark:text-gray-400"
            >
              {t('subtitle')}
            </Typography>
          </Box>

          {/* Statistics */}
          <TodoStats />

          {/* AI Todo Extractor */}
          <TodoExtractor />

          {/* Add task input */}
          <TodoInput />

          {/* Filter */}
          <TodoFilter />

          {/* Task list */}
          <TodoList />
        </motion.div>
      </Container>
  );
};

export default MainPage;