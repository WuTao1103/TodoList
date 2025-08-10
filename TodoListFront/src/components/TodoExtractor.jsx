import { useState } from 'react';
import { TextField, Button, Box, Typography, Card, Alert, CircularProgress, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodo } from '../context/TodoContext';
import { useLanguage } from '../context/LanguageContext';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SmartToyIcon from '@mui/icons-material/SmartToy';

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
            <Box className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <SmartToyIcon className="text-white" />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                className="font-semibold text-gray-900 dark:text-white"
                sx={{ fontWeight: 600 }}
              >
                {language === 'zh' ? 'AI 智能提取' : 'AI Smart Extraction'}
              </Typography>
              <Typography 
                variant="body2" 
                className="text-gray-500 dark:text-gray-400"
              >
                {language === 'zh' ? '从文本中自动识别待办事项' : 'Automatically extract todos from text'}
              </Typography>
            </Box>
          </Box>
          
          {/* Input Area */}
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder={language === 'zh' ? '粘贴文本内容，AI将自动识别待办事项...' : 'Paste text content, AI will automatically identify todos...'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mb-4"
            error={!!error}
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
          
          {/* Action Button */}
          <Box className="flex items-center gap-3 mb-4">
            <Button
              variant="contained"
              onClick={extractTodos}
              disabled={loading || !text.trim()}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)',
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0056CC 0%, #4A47B8 100%)',
                  boxShadow: '0 6px 20px rgba(0, 122, 255, 0.4)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #E5E5EA 0%, #D1D1D6 100%)',
                  boxShadow: 'none',
                }
              }}
            >
              {loading 
                ? (language === 'zh' ? '分析中...' : 'Analyzing...') 
                : (language === 'zh' ? '智能提取' : 'Smart Extract')}
            </Button>
            
            {loading && (
              <Chip
                label={language === 'zh' ? 'AI正在分析...' : 'AI is analyzing...'}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ borderRadius: '8px' }}
              />
            )}
          </Box>

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              className="mb-4"
              sx={{ 
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 59, 48, 0.1)',
                border: '1px solid rgba(255, 59, 48, 0.2)'
              }}
            >
              {error}
            </Alert>
          )}

          {/* Results */}
          <AnimatePresence>
            {extractedTodos.length > 0 && (
              <Box className="space-y-3">
                <Typography 
                  variant="subtitle2" 
                  className="text-gray-600 dark:text-gray-400 font-medium"
                >
                  {language === 'zh' ? '提取结果' : 'Extracted Results'}
                </Typography>
                {extractedTodos.map((todo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-gray-50/80 dark:bg-gray-800/80 p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
                  >
                    <Typography 
                      className="mb-3 text-gray-900 dark:text-white font-medium"
                      sx={{ fontWeight: 500 }}
                    >
                      {language === 'zh' ? todo.zh : todo.en}
                    </Typography>
                    <Box className="flex gap-2">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => {
                          addTodo(`${language}:${language === 'zh' ? todo.zh : todo.en}`);
                          setExtractedTodos(prev => prev.filter((_, i) => i !== index));
                        }}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          background: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)',
                          boxShadow: '0 2px 8px rgba(52, 199, 89, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #28A745 0%, #24B33E 100%)',
                            boxShadow: '0 4px 12px rgba(52, 199, 89, 0.4)',
                          }
                        }}
                      >
                        {language === 'zh' ? '添加到列表' : 'Add to List'}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setExtractedTodos(prev => prev.filter((_, i) => i !== index))}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: 'rgba(255, 59, 48, 0.3)',
                          color: '#FF3B30',
                          '&:hover': {
                            borderColor: '#FF3B30',
                            backgroundColor: 'rgba(255, 59, 48, 0.05)',
                          }
                        }}
                      >
                        {language === 'zh' ? '忽略' : 'Ignore'}
                      </Button>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </AnimatePresence>
        </Box>
      </Card>
    </motion.div>
  );
};

export default TodoExtractor;