package com.example.todolist.controller;

import com.example.todolist.entity.Subtask;
import com.example.todolist.entity.Todo;
import com.example.todolist.enums.Priority;
import com.example.todolist.service.SubtaskService;
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
 * @CrossOrigin 允许跨域访问
 */
@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://192.168.0.12:3000")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private SubtaskService subtaskService;

    // ==================== Todo 相关接口 ====================

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

    // ==================== Subtask 相关接口 ====================

    /**
     * 获取指定任务的所有子任务（按优先级排序）
     * GET /api/tasks/{id}/subtasks?sortByPriority=true
     * @param id 父任务ID
     * @param sortByPriority 是否按优先级排序（默认true）
     * @return 子任务列表
     */
    @GetMapping("/tasks/{id}/subtasks")
    public ResponseEntity<List<Subtask>> getSubtasks(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean sortByPriority) {
        log.info("获取任务ID{}的子任务列表，优先级排序: {}", id, sortByPriority);
        List<Subtask> subtasks = subtaskService.getSubtasksByParentId(id, sortByPriority);
        return ResponseEntity.ok(subtasks);
    }

    /**
     * 根据完成状态获取子任务
     * GET /api/tasks/{id}/subtasks/status?completed=false
     * @param id 父任务ID
     * @param completed 完成状态
     * @return 子任务列表
     */
    @GetMapping("/tasks/{id}/subtasks/status")
    public ResponseEntity<List<Subtask>> getSubtasksByStatus(
            @PathVariable Long id,
            @RequestParam boolean completed) {
        log.info("获取任务ID{}的子任务，完成状态: {}", id, completed);
        List<Subtask> subtasks = subtaskService.getSubtasksByParentIdAndCompleted(id, completed);
        return ResponseEntity.ok(subtasks);
    }

    /**
     * 根据优先级获取子任务
     * GET /api/tasks/{id}/subtasks/priority?priority=HIGH
     * @param id 父任务ID
     * @param priority 优先级
     * @return 子任务列表
     */
    @GetMapping("/tasks/{id}/subtasks/priority")
    public ResponseEntity<List<Subtask>> getSubtasksByPriority(
            @PathVariable Long id,
            @RequestParam Priority priority) {
        log.info("获取任务ID{}的{}优先级子任务", id, priority);
        List<Subtask> subtasks = subtaskService.getSubtasksByPriority(id, priority);
        return ResponseEntity.ok(subtasks);
    }

    /**
     * 为指定任务添加子任务
     * POST /api/tasks/{id}/subtasks
     * @param id 父任务ID
     * @param subtask 子任务信息（包含优先级）
     * @return 创建的子任务
     */
    @PostMapping("/tasks/{id}/subtasks")
    public ResponseEntity<Subtask> addSubtask(@PathVariable Long id, @RequestBody Subtask subtask) {
        log.info("为任务ID{}添加子任务: {}，优先级: {}", id, subtask.getValue(), subtask.getPriority());
        Subtask createdSubtask = subtaskService.addSubtask(id, subtask);
        return ResponseEntity.ok(createdSubtask);
    }

    /**
     * 更新子任务信息（包含优先级）
     * PUT /api/subtasks/{id}
     * @param id 子任务ID
     * @param subtask 更新的子任务信息
     * @return 更新后的子任务
     */
    @PutMapping("/subtasks/{id}")
    public ResponseEntity<Subtask> updateSubtask(@PathVariable Long id, @RequestBody Subtask subtask) {
        log.info("更新子任务ID{}: {}，优先级: {}", id, subtask.getValue(), subtask.getPriority());
        Subtask updatedSubtask = subtaskService.updateSubtask(id, subtask);
        return ResponseEntity.ok(updatedSubtask);
    }

    /**
     * 单独更新子任务优先级
     * PUT /api/subtasks/{id}/priority
     * @param id 子任务ID
     * @param request 包含优先级的请求体
     * @return 更新后的子任务
     */
    @PutMapping("/subtasks/{id}/priority")
    public ResponseEntity<Subtask> updateSubtaskPriority(
            @PathVariable Long id,
            @RequestBody PriorityUpdateRequest request) {
        log.info("更新子任务ID{}的优先级为: {}", id, request.getPriority());
        Subtask updatedSubtask = subtaskService.updateSubtaskPriority(id, request.getPriority());
        return ResponseEntity.ok(updatedSubtask);
    }

    /**
     * 切换子任务完成状态
     * POST /api/subtasks/{id}/toggle
     * @param id 子任务ID
     * @return 更新后的子任务
     */
    @PostMapping("/subtasks/{id}/toggle")
    public ResponseEntity<Subtask> toggleSubtaskStatus(@PathVariable Long id) {
        log.info("切换子任务ID{}的完成状态", id);
        Subtask updatedSubtask = subtaskService.toggleSubtaskStatus(id);
        return ResponseEntity.ok(updatedSubtask);
    }

    /**
     * 删除子任务
     * DELETE /api/subtasks/{id}
     * @param id 子任务ID
     * @return 空响应
     */
    @DeleteMapping("/subtasks/{id}")
    public ResponseEntity<Void> deleteSubtask(@PathVariable Long id) {
        log.info("删除子任务ID{}", id);
        subtaskService.deleteSubtask(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 获取任务的子任务统计信息（包含优先级统计）
     * GET /api/tasks/{id}/subtasks/stats
     * @param id 父任务ID
     * @return 子任务统计信息
     */
    @GetMapping("/tasks/{id}/subtasks/stats")
    public ResponseEntity<SubtaskService.SubtaskStats> getSubtaskStats(@PathVariable Long id) {
        log.info("获取任务ID{}的子任务统计信息", id);
        SubtaskService.SubtaskStats stats = subtaskService.getSubtaskStats(id);
        return ResponseEntity.ok(stats);
    }

    /**
     * 删除任务的所有子任务
     * DELETE /api/tasks/{id}/subtasks
     * @param id 父任务ID
     * @return 空响应
     */
    @DeleteMapping("/tasks/{id}/subtasks")
    public ResponseEntity<Void> deleteAllSubtasks(@PathVariable Long id) {
        log.info("删除任务ID{}的所有子任务", id);
        subtaskService.deleteSubtasksByParentId(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 获取所有优先级选项
     * GET /api/priorities
     * @return 优先级列表
     */
    @GetMapping("/priorities")
    public ResponseEntity<Priority[]> getPriorities() {
        return ResponseEntity.ok(Priority.values());
    }

    /**
     * 优先级更新请求DTO
     */
    public static class PriorityUpdateRequest {
        private Priority priority;

        public Priority getPriority() {
            return priority;
        }

        public void setPriority(Priority priority) {
            this.priority = priority;
        }
    }
}