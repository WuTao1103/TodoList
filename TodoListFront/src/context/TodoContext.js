import { createContext, useContext, useState, useEffect } from 'react';

export const TodoContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 添加错误处理函数
  const handleResponse = async (response) => {
    try {
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.message || '请求失败');
        } else {
          throw new Error('服务器错误');
        }
      }
      
      // 如果是删除操作且响应成功
      if (response.status === 200 && response.url.includes('/del-todo/')) {
        return {};
      }
      
      // 处理空响应
      const text = await response.text();
      if (!text) {
        return {};
      }
      
      // 尝试解析JSON
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('JSON解析错误:', e);
        throw new Error('响应格式错误');
      }
    } catch (error) {
      console.error('Response handling error:', error);
      throw error;
    }
  };

  // 获取所有待办事项 - 修改为匹配后端路径
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-todo`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await handleResponse(response);
      if (Array.isArray(data)) {
        setTodos(data.map(todo => ({
          id: todo.id,
          text: {
            zh: todo.value,
            en: todo.value
          },
          completed: todo.completed
        })));
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 添加待办事项 - 修改为匹配后端路径
  const addTodo = async (text) => {
    try {
      setLoading(true);
      let value = text;
      if (text.startsWith('en:') || text.startsWith('zh:')) {
        value = text.slice(3);
      }

      const response = await fetch(`${API_URL}/add-todo`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value,
          completed: false
        })
      });
      await handleResponse(response);
      await fetchTodos();
    } catch (error) {
      setError(error.message);
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换待办事项状态 - 修改为匹配后端路径
  const toggleTodo = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/update-todo/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await handleResponse(response);
      await fetchTodos();
    } catch (error) {
      setError(error.message);
      console.error('Error toggling todo:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除待办事项 - 修改为匹配后端路径
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/del-todo/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await handleResponse(response);
      await fetchTodos();
    } catch (error) {
      setError(error.message);
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  return (
    <TodoContext.Provider value={{
      todos: filteredTodos,
      filter,
      stats,
      loading,
      error,
      addTodo,
      toggleTodo,
      deleteTodo,
      setFilter,
      clearError: () => setError(null)
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);