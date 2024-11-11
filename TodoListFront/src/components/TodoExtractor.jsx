import { useState } from 'react';
import { TextField, Button, Box, Typography, Card, Alert, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const TodoExtractor = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedTodos, setExtractedTodos] = useState([]);
  const { addTodo } = useTodo();
  const { language } = useLanguage();

  const extractTodos = async () => {
    if (!text.trim()) {
      setError(language === 'zh' ? '请输入文本内容' : 'Please enter some text');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting API call...');
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error(language === 'zh' 
          ? 'OpenAI API密钥未配置' 
          : 'OpenAI API key is not configured');
      }
      
      console.log('API Key available:', !!apiKey);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "system",
            content: "You are a helpful assistant that extracts todo items from text. Return only a JSON array of todo items in both English and Chinese. Format: [{\"en\": \"...\", \"zh\": \"...\"}]"
          }, {
            role: "user",
            content: text
          }],
          temperature: 0.7
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(language === 'zh'
          ? `API请求失败: ${errorData.error?.message || '未知错误'}`
          : `API request failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error(language === 'zh'
          ? 'API返回格式无效'
          : 'Invalid API response format');
      }

      try {
        const todos = JSON.parse(data.choices[0].message.content);
        if (!Array.isArray(todos)) {
          throw new Error(language === 'zh'
            ? 'API返回的不是待办事项数组'
            : 'API did not return an array of todos');
        }
        setExtractedTodos(todos);
        if (todos.length === 0) {
          setError(language === 'zh'
            ? '未能从文本中提取到待办事项'
            : 'No todo items could be extracted from the text');
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        throw new Error(language === 'zh'
          ? '解析API返回数据失败'
          : 'Failed to parse API response');
      }
      
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mb-8"
    >
      <Card className="p-4 bg-surface-light dark:bg-surface-dark">
        <Typography variant="h6" className="mb-4 flex items-center gap-2">
          <AutoAwesomeIcon className="text-primary-light dark:text-primary-dark" />
          {language === 'zh' ? 'AI 提取待办事项' : 'AI Todo Extraction'}
        </Typography>
        
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          placeholder={language === 'zh' ? '粘贴文本以提取待办事项...' : 'Paste text to extract todos...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-4"
          error={!!error}
          disabled={loading}
        />
        
        <Box className="mb-4 flex items-center gap-4">
          <Button
            variant="contained"
            onClick={extractTodos}
            disabled={loading || !text.trim()}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading 
              ? (language === 'zh' ? '提取中...' : 'Extracting...') 
              : (language === 'zh' ? '提取待办事项' : 'Extract Todos')}
          </Button>
          
          {loading && (
            <Typography variant="body2" color="textSecondary">
              {language === 'zh' ? '正在分析文本...' : 'Analyzing text...'}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <AnimatePresence>
          {extractedTodos.map((todo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-2 shadow-sm"
            >
              <Typography className="mb-2">
                {language === 'zh' ? todo.zh : todo.en}
              </Typography>
              <Box className="flex gap-2">
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addTodo(`${language}:${language === 'zh' ? todo.zh : todo.en}`);
                    setExtractedTodos(prev => prev.filter((_, i) => i !== index));
                  }}
                >
                  {language === 'zh' ? '添加' : 'Add'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => setExtractedTodos(prev => prev.filter((_, i) => i !== index))}
                >
                  {language === 'zh' ? '忽略' : 'Ignore'}
                </Button>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default TodoExtractor;