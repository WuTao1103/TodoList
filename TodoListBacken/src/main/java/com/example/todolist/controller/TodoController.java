package com.example.todolist.controller;

import com.example.todolist.entity.Todo;
import com.example.todolist.service.TodoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Todo REST API控制器
 * @Slf4j 提供日志功能
 * @RestController 标记这是一个REST控制器
 * @RequestMapping("/api") 所有接口都以/api开头
 * @CrossOrigin(origins = "http://192.168.0.12:3000") 允许前端域名访问
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://192.168.0.12:3000")
public class TodoController {
    
    /**
     * 注入TodoService用于处理业务逻辑
     */
    @Autowired
    private TodoService todoService;
    
    /**
     * 获取所有待办事项
     * @return 待办事项列表的ResponseEntity
     */
    @GetMapping("/get-todo")
    public ResponseEntity<List<Todo>> getAllTodos() {
        return ResponseEntity.ok(todoService.getAllTodos());
    }
    
    /**
     * 添加新的待办事项
     * @param todo 待添加的待办事项
     * @return 添加后的待办事项ResponseEntity
     */
    @PostMapping("/add-todo")
    public ResponseEntity<Todo> addTodo(@RequestBody Todo todo) {
        return ResponseEntity.ok(todoService.addTodo(todo));
    }
    
    /**
     * 更新待办事项状态
     * @param id 待更新的待办事项ID
     * @return 更新后的待办事项ResponseEntity
     */
    @PostMapping("/update-todo/{id}")
    public ResponseEntity<Todo> updateTodoStatus(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.updateTodoStatus(id));
    }
    
    /**
     * 删除待办事项
     * @param id 待删除的待办事项ID
     * @return 空的ResponseEntity
     */
    @PostMapping("/del-todo/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.ok().build();
    }
} 