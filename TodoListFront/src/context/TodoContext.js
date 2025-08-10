import { createContext, useContext, useState, useEffect } from 'react';

export const TodoContext = createContext();

// 从环境变量获取API地址，如果没有则使用默认值
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
console.log('🔧 当前使用的API地址:', API_URL);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subtaskStats, setSubtaskStats] = useState({});

  // 添加错误处理函数
  const handleResponse = async (response) => {
    try {
      console.log('🔧 处理响应，状态码:', response.status);
      console.log('🔧 响应URL:', response.url);
      
      const contentType = response.headers.get("content-type");
      console.log('🔧 响应内容类型:', contentType);
      
      if (!response.ok) {
        console.error('❌ 响应不成功，状态码:', response.status);
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error('❌ JSON错误数据:', errorData);
          throw new Error(errorData.message || '请求失败');
        } else {
          const errorText = await response.text();
          console.error('❌ 文本错误数据:', errorText);
          throw new Error('服务器错误');
        }
      }
      
      // 如果是删除操作且响应成功
      if (response.status === 200 && response.url.includes('/del-todo/')) {
        console.log('✅ 删除操作成功');
        return {};
      }
      
      // 如果是更新操作且响应成功
      if (response.status === 200 && response.url.includes('/update-todo/')) {
        console.log('✅ 更新操作成功');
        return {};
      }
      
      // 处理空响应
      const text = await response.text();
      console.log('📄 响应文本:', text);
      
      if (!text) {
        console.log('⚠️ 响应为空');
        return {};
      }
      
      // 尝试解析JSON
      try {
        const parsedData = JSON.parse(text);
        console.log('✅ JSON解析成功:', parsedData);
        return parsedData;
      } catch (e) {
        console.error('❌ JSON解析错误:', e);
        console.error('❌ 原始文本:', text);
        throw new Error('响应格式错误');
      }
    } catch (error) {
      console.error('❌ Response handling error:', error);
      throw error;
    }
  };

  // 获取所有待办事项 - 修改为匹配后端路径
  const fetchTodos = async () => {
    try {
      setLoading(true);
      console.log('🔍 开始获取待办事项，API地址:', API_URL);
      
      const response = await fetch(`${API_URL}/get-todo`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 API响应状态:', response.status);
      console.log('📡 API响应头:', response.headers);
      
      const data = await handleResponse(response);
      console.log('📦 解析后的数据:', data);
      
      if (Array.isArray(data)) {
        const mappedTodos = data.map(todo => ({
          id: todo.id,
          text: {
            zh: todo.value,
            en: todo.value
          },
          completed: todo.completed
        }));
        console.log('✅ 映射后的待办事项:', mappedTodos);
        setTodos(mappedTodos);
      } else {
        console.warn('⚠️ 返回的数据不是数组:', data);
      }
    } catch (error) {
      console.error('❌ 获取待办事项失败:', error);
      setError(error.message);
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
      // 找到当前任务
      const currentTodo = todos.find(todo => todo.id === id);
      if (!currentTodo) {
        throw new Error('Task not found');
      }
      
      const response = await fetch(`${API_URL}/update-todo/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: currentTodo.text.zh || currentTodo.text.en,
          completed: !currentTodo.completed
        })
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

  // 获取子任务
  const getSubtasks = async (todoId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${todoId}/subtasks`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await handleResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting subtasks:', error);
      return [];
    }
  };

  // 添加子任务
  const addSubtask = async (todoId, subtask) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${todoId}/subtasks`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subtask)
      });
      await handleResponse(response);
    } catch (error) {
      setError(error.message);
      console.error('Error adding subtask:', error);
      throw error;
    }
  };

  // 更新子任务
  const updateSubtask = async (subtaskId, subtask) => {
    try {
      const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subtask)
      });
      await handleResponse(response);
    } catch (error) {
      setError(error.message);
      console.error('Error updating subtask:', error);
      throw error;
    }
  };

  // 切换子任务状态
  const toggleSubtask = async (subtaskId, todoId) => {
    try {
      const response = await fetch(`${API_URL}/subtasks/${subtaskId}/toggle`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await handleResponse(response);
    } catch (error) {
      setError(error.message);
      console.error('Error toggling subtask:', error);
      throw error;
    }
  };

  // 删除子任务
  const deleteSubtask = async (subtaskId) => {
    try {
      const response = await fetch(`${API_URL}/subtasks/${subtaskId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      await handleResponse(response);
    } catch (error) {
      setError(error.message);
      console.error('Error deleting subtask:', error);
      throw error;
    }
  };

  // 获取子任务统计
  const getSubtaskStats = async (todoId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${todoId}/subtasks/stats`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await handleResponse(response);
      if (data && typeof data === 'object') {
        setSubtaskStats(prev => ({
          ...prev,
          [todoId]: data
        }));
      }
    } catch (error) {
      console.error('Error getting subtask stats:', error);
      // 如果API不存在，设置默认统计
      setSubtaskStats(prev => ({
        ...prev,
        [todoId]: { total: 0, completed: 0 }
      }));
    }
  };

  // 获取优先级选项
  const getPriorities = async () => {
    try {
      const response = await fetch(`${API_URL}/priorities`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await handleResponse(response);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error getting priorities:', error);
      return [];
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
      subtaskStats,
      addTodo,
      toggleTodo,
      deleteTodo,
      getSubtasks,
      addSubtask,
      updateSubtask,
      toggleSubtask,
      deleteSubtask,
      getSubtaskStats,
      getPriorities,
      setFilter,
      clearError: () => setError(null)
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => useContext(TodoContext);