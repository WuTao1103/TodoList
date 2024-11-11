import { motion } from 'framer-motion';
import { Checkbox, IconButton, Box, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';
import { forwardRef } from 'react';

const TodoItem = forwardRef(({ todo }, ref) => {
  const { toggleTodo, deleteTodo } = useTodo();
  const { language } = useLanguage();

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="todo-item bg-surface-light dark:bg-surface-dark rounded-xl p-4 mb-3 
        flex items-center justify-between shadow-sm hover:shadow-md 
        border border-gray-100 dark:border-gray-800
        transition-all duration-300 ease-in-out"
    >
      <Box className="flex items-center flex-1">
        <Checkbox
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="text-primary-light dark:text-primary-dark"
        />
        <Typography
          className={`ml-2 ${
            todo.completed ? 'line-through text-gray-400' : ''
          } transition-colors duration-200`}
        >
          {todo.text[language]}
        </Typography>
      </Box>
      <IconButton
        onClick={() => deleteTodo(todo.id)}
        className="text-gray-400 hover:text-red-500 transition-colors duration-200"
      >
        <DeleteOutlineIcon />
      </IconButton>
    </motion.div>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem; 