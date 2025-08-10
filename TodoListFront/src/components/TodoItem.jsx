import { motion } from 'framer-motion';
import { Checkbox, IconButton, Box, Typography, Chip, Badge } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderIcon from '@mui/icons-material/Folder';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoItem = forwardRef(({ todo }, ref) => {
  const { toggleTodo, deleteTodo, subtaskStats } = useTodo();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Get subtask statistics for current task
  const stats = subtaskStats[todo.id];
  const hasSubtasks = stats && stats.total > 0;

  const handleSubtaskClick = (e) => {
    e.stopPropagation();
    navigate(`/todo/${todo.id}/subtasks`);
  };

  const getSubtaskChipColor = () => {
    if (!stats || stats.total === 0) return 'default';
    const completionRate = stats.completed / stats.total;
    if (completionRate === 1) return 'success';
    if (completionRate > 0.5) return 'warning';
    return 'info';
  };

  const getSubtaskChipText = () => {
    if (!stats || stats.total === 0) return '';
    return `${stats.completed}/${stats.total}`;
  };

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
        transition-all duration-300 ease-in-out group"
      >
        <Box className="flex items-center flex-1">
          <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="text-primary-light dark:text-primary-dark"
          />
          <Box className="flex items-center gap-2 flex-1">
            <Typography
                className={`${
                    todo.completed ? 'line-through text-gray-400' : ''
                } transition-colors duration-200`}
            >
              {todo.text[language]}
            </Typography>

            {/* Subtask indicator */}
            {hasSubtasks && (
                <Box className="flex items-center gap-1">
                  <IconButton
                      size="small"
                      onClick={handleSubtaskClick}
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                      title="View subtasks"
                  >
                    <Badge
                        badgeContent={stats.total}
                        color="primary"
                        max={99}
                    >
                      <AssignmentIcon fontSize="small" />
                    </Badge>
                  </IconButton>

                  <Chip
                      size="small"
                      label={getSubtaskChipText()}
                      color={getSubtaskChipColor()}
                      variant="outlined"
                      onClick={handleSubtaskClick}
                      className="cursor-pointer hover:bg-opacity-20 transition-all duration-200"
                      sx={{
                        fontSize: '0.75rem',
                        height: '20px',
                        '& .MuiChip-label': {
                          padding: '0 6px',
                        }
                      }}
                  />
                </Box>
            )}

            {/* Add subtask button for tasks without subtasks */}
            {!hasSubtasks && (
                <IconButton
                    size="small"
                    onClick={handleSubtaskClick}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                    title="Add subtasks"
                >
                  <FolderIcon fontSize="small" />
                </IconButton>
            )}
          </Box>
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