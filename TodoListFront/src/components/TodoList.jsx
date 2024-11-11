import { AnimatePresence } from 'framer-motion';
import { Typography, Box } from '@mui/material';
import TodoItem from './TodoItem';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';

const TodoList = () => {
  const { todos } = useTodo();
  const { t } = useLanguage();

  if (todos.length === 0) {
    return (
      <Box className="text-center py-8">
        <Typography variant="body1" className="text-gray-500">
          {t('noTodos')}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="popLayout">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TodoList; 