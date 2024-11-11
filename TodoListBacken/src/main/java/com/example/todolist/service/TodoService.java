package com.example.todolist.service;

import com.example.todolist.entity.Todo;
import com.example.todolist.repository.TodoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

/**
 * Todo业务逻辑服务类
 * @Slf4j 提供日志功能
 * @Service 标记这是一个服务类
 */
@Slf4j
@Service
public class TodoService {
    
    /**
     * 注入TodoRepository用于数据库操作
     */
    @Autowired
    private TodoRepository todoRepository;
    
    /**
     * 获取所有待办事项
     * @return 待办事项列表
     */
    public List<Todo> getAllTodos() {
        log.info("获取所有待办事项");
        return todoRepository.findAll();
    }
    
    /**
     * 添加新的待办事项
     * @param todo 待添加的待办事项
     * @return 添加后的待办事项（包含ID）
     */
    public Todo addTodo(Todo todo) {
        log.info("添加新的待办事项: {}", todo.getValue());
        return todoRepository.save(todo);
    }
    
    /**
     * 更新待办事项的完成状态
     * @param id 待办事项ID
     * @return 更新后的待办事项
     * @throws EntityNotFoundException 当待办事项不存在时抛出
     */
    public Todo updateTodoStatus(Long id) {
        log.info("更新待办事项状态, id: {}", id);
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("待办事项未找到"));
        todo.setCompleted(!todo.isCompleted());
        return todoRepository.save(todo);
    }
    
    /**
     * 删除待办事项
     * @param id 待删除的待办事项ID
     */
    public void deleteTodo(Long id) {
        log.info("删除待办事项, id: {}", id);
        todoRepository.deleteById(id);
    }
} 