// 前端配置文件
const config = {
  // API配置
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  // OpenAI配置（如果需要AI功能）
  OPENAI_API_KEY: process.env.REACT_APP_OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.REACT_APP_OPENAI_MODEL || 'gpt-3.5-turbo',
  OPENAI_TEMPERATURE: process.env.REACT_APP_OPENAI_TEMPERATURE || 0.7,
  OPENAI_MAX_TOKENS: process.env.REACT_APP_OPENAI_MAX_TOKENS || 1000,
};

export default config; 