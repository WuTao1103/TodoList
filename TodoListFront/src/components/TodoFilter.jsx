import { ButtonGroup, Button } from '@mui/material';
import { useTodo } from '../context/TodoContext';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TodoFilter = () => {
  const { filter, setFilter } = useTodo();
  const { t } = useLanguage();

  const filters = [
    { label: t('all'), value: 'all' },
    { label: t('active'), value: 'active' },
    { label: t('completed'), value: 'completed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <ButtonGroup
        variant="contained"
        className="shadow-sm rounded-xl overflow-hidden"
        sx={{
          '& .MuiButton-root': {
            borderColor: 'rgba(0,0,0,0.08)',
            transition: 'all 0.2s ease-in-out',
          }
        }}
      >
        {filters.map(({ label, value }) => (
          <Button
            key={value}
            onClick={() => setFilter(value)}
            variant={filter === value ? 'contained' : 'outlined'}
            className={`px-6 py-2 ${
              filter === value
                ? 'bg-primary-light dark:bg-primary-dark shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
            } transition-all duration-200`}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
    </motion.div>
  );
};

export default TodoFilter; 