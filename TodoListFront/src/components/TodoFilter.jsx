import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import { useTodo } from '../context/TodoContext';

const TodoFilter = () => {
  const { filter, setFilter } = useTodo();

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
      >
        <Box className="flex justify-center">
          <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={handleFilterChange}
              className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm"
          >
            <ToggleButton value="all" className="px-6 py-2">
              All
            </ToggleButton>
            <ToggleButton value="active" className="px-6 py-2">
              Active
            </ToggleButton>
            <ToggleButton value="completed" className="px-6 py-2">
              Completed
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </motion.div>
  );
};

export default TodoFilter;