import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { TodoProvider } from './context/TodoContext';
import { LanguageProvider } from './context/LanguageContext';

// Import page components
import MainPage from './pages/MainPage';
import SubtaskPage from './components/SubtaskPage';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light', // Can switch to 'dark' as needed
    primary: {
      main: '#007AFF',
    },
    secondary: {
      main: '#FF6B6B',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LanguageProvider>
          <TodoProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/todo/:todoId/subtasks" element={<SubtaskPage />} />
                </Routes>
              </div>
            </Router>
          </TodoProvider>
        </LanguageProvider>
      </ThemeProvider>
  );
}

export default App;