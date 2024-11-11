import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { Container, Box, Typography } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { TodoProvider } from './context/TodoContext';
import { LanguageProvider } from './context/LanguageContext';
import { lightTheme, darkTheme } from './theme';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';
import TodoStats from './components/TodoStats';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import TodoExtractor from './components/TodoExtractor';

const AppContent = () => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-background-dark text-white' : 'bg-background-light text-black'
      }`}>
        <ThemeToggle />
        <LanguageToggle />
        <Container maxWidth="md" className="py-12">
          <Box className="text-center mb-12">
            <Typography
              variant="h3"
              component="h1"
              className="font-bold mb-4 bg-gradient-to-r from-primary-light to-blue-500 dark:from-primary-dark dark:to-blue-400 bg-clip-text text-transparent"
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

          <TodoStats />
          <TodoFilter />
          <TodoExtractor />
          <TodoInput />
          <TodoList />
        </Container>
      </div>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TodoProvider>
          <AppContent />
        </TodoProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App; 