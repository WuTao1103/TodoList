package com.example.todolist.service;

import com.example.todolist.entity.Subtask;
import com.example.todolist.entity.Todo;
import com.example.todolist.enums.Priority;
import com.example.todolist.repository.SubtaskRepository;
import com.example.todolist.repository.TodoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

/**
 * Subtask业务逻辑服务类
 * @Slf4j 提供日志功能
 * @Service 标记这是一个服务类
 */
@Slf4j
@Service
@Transactional
public class SubtaskService {

    @Autowired
    private SubtaskRepository subtaskRepository;

    @Autowired
    private TodoRepository todoRepository;

    /**
     * 根据父任务ID获取所有子任务（按优先级排序）
     * @param parentTaskId 父任务ID
     * @param sortByPriority 是否按优先级排序
     * @return 子任务列表
     */
    public List<Subtask> getSubtasksByParentId(Long parentTaskId, boolean sortByPriority) {
        log.info("获取父任务ID为{}的所有子任务，优先级排序: {}", parentTaskId, sortByPriority);

        // 验证父任务是否存在
        if (!todoRepository.existsById(parentTaskId)) {
            throw new EntityNotFoundException("父任务不存在，ID: " + parentTaskId);
        }

        if (sortByPriority) {
            return subtaskRepository.findByParentTaskIdOrderByPriorityDesc(parentTaskId);
        } else {
            return subtaskRepository.findByParentTaskId(parentTaskId);
        }
    }

    /**
     * 根据父任务ID获取所有子任务（默认按优先级排序）
     * @param parentTaskId 父任务ID
     * @return 子任务列表
     */
    public List<Subtask> getSubtasksByParentId(Long parentTaskId) {
        return getSubtasksByParentId(parentTaskId, true);
    }

    /**
     * 根据优先级和完成状态获取子任务
     * @param parentTaskId 父任务ID
     * @param completed 完成状态
     * @return 子任务列表
     */
    public List<Subtask> getSubtasksByParentIdAndCompleted(Long parentTaskId, boolean completed) {
        log.info("获取父任务ID为{}的子任务，完成状态: {}", parentTaskId, completed);
        return subtaskRepository.findByParentTaskIdAndCompletedOrderByPriority(parentTaskId, completed);
    }

    /**
     * 根据优先级获取子任务
     * @param parentTaskId 父任务ID
     * @param priority 优先级
     * @return 子任务列表
     */
    public List<Subtask> getSubtasksByPriority(Long parentTaskId, Priority priority) {
        log.info("获取父任务ID为{}的{}优先级子任务", parentTaskId, priority);
        return subtaskRepository.findByParentTaskIdAndPriority(parentTaskId, priority);
    }

    /**
     * 新增子任务
     * @param parentTaskId 父任务ID
     * @param subtask 子任务对象
     * @return 保存后的子任务
     */
    public Subtask addSubtask(Long parentTaskId, Subtask subtask) {
        log.info("为父任务ID{}添加子任务: {}，优先级: {}", parentTaskId, subtask.getValue(), subtask.getPriority());

        // 验证父任务是否存在
        Todo parentTask = todoRepository.findById(parentTaskId)
                .orElseThrow(() -> new EntityNotFoundException("父任务不存在，ID: " + parentTaskId));

        // 设置父任务ID
        subtask.setParentTaskId(parentTaskId);

        // 如果没有设置优先级，默认为中等优先级
        if (subtask.getPriority() == null) {
            subtask.setPriority(Priority.MEDIUM);
        }

        return subtaskRepository.save(subtask);
    }

    /**
     * 更新子任务
     * @param subtaskId 子任务ID
     * @param updatedSubtask 更新的子任务信息
     * @return 更新后的子任务
     */
    public Subtask updateSubtask(Long subtaskId, Subtask updatedSubtask) {
        log.info("更新子任务，ID: {}", subtaskId);

        Subtask existingSubtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new EntityNotFoundException("子任务不存在，ID: " + subtaskId));

        // 更新字段
        if (updatedSubtask.getValue() != null) {
            existingSubtask.setValue(updatedSubtask.getValue());
        }
        if (updatedSubtask.isCompleted() != existingSubtask.isCompleted()) {
            existingSubtask.setCompleted(updatedSubtask.isCompleted());
        }
        if (updatedSubtask.getPriority() != null) {
            existingSubtask.setPriority(updatedSubtask.getPriority());
        }

        return subtaskRepository.save(existingSubtask);
    }

    /**
     * 更新子任务优先级
     * @param subtaskId 子任务ID
     * @param priority 新优先级
     * @return 更新后的子任务
     */
    public Subtask updateSubtaskPriority(Long subtaskId, Priority priority) {
        log.info("更新子任务优先级，ID: {}，新优先级: {}", subtaskId, priority);

        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new EntityNotFoundException("子任务不存在，ID: " + subtaskId));

        subtask.setPriority(priority);
        return subtaskRepository.save(subtask);
    }

    /**
     * 切换子任务完成状态
     * @param subtaskId 子任务ID
     * @return 更新后的子任务
     */
    public Subtask toggleSubtaskStatus(Long subtaskId) {
        log.info("切换子任务状态，ID: {}", subtaskId);

        Subtask subtask = subtaskRepository.findById(subtaskId)
                .orElseThrow(() -> new EntityNotFoundException("子任务不存在，ID: " + subtaskId));

        subtask.setCompleted(!subtask.isCompleted());
        return subtaskRepository.save(subtask);
    }

    /**
     * 删除子任务
     * @param subtaskId 子任务ID
     */
    public void deleteSubtask(Long subtaskId) {
        log.info("删除子任务，ID: {}", subtaskId);

        if (!subtaskRepository.existsById(subtaskId)) {
            throw new EntityNotFoundException("子任务不存在，ID: " + subtaskId);
        }

        subtaskRepository.deleteById(subtaskId);
    }

    /**
     * 删除父任务下的所有子任务
     * @param parentTaskId 父任务ID
     */
    public void deleteSubtasksByParentId(Long parentTaskId) {
        log.info("删除父任务ID为{}的所有子任务", parentTaskId);
        subtaskRepository.deleteByParentTaskId(parentTaskId);
    }

    /**
     * 获取子任务统计信息（包含优先级统计）
     * @param parentTaskId 父任务ID
     * @return 包含总数、完成数和优先级分布的统计信息
     */
    public SubtaskStats getSubtaskStats(Long parentTaskId) {
        log.info("获取父任务ID为{}的子任务统计信息", parentTaskId);

        long totalCount = subtaskRepository.countByParentTaskId(parentTaskId);
        long completedCount = subtaskRepository.countCompletedByParentTaskId(parentTaskId);

        // 统计各优先级的子任务数量
        Map<Priority, Long> priorityStats = new HashMap<>();
        for (Priority priority : Priority.values()) {
            long count = subtaskRepository.countByParentTaskIdAndPriority(parentTaskId, priority);
            priorityStats.put(priority, count);
        }

        return new SubtaskStats(totalCount, completedCount, priorityStats);
    }

    /**
     * 子任务统计信息类（包含优先级统计）
     */
    public static class SubtaskStats {
        private final long totalCount;
        private final long completedCount;
        private final Map<Priority, Long> priorityStats;

        public SubtaskStats(long totalCount, long completedCount, Map<Priority, Long> priorityStats) {
            this.totalCount = totalCount;
            this.completedCount = completedCount;
            this.priorityStats = priorityStats;
        }

        public long getTotalCount() {
            return totalCount;
        }

        public long getCompletedCount() {
            return completedCount;
        }

        public long getActiveCount() {
            return totalCount - completedCount;
        }

        public double getCompletionRate() {
            return totalCount == 0 ? 0.0 : (double) completedCount / totalCount;
        }

        public Map<Priority, Long> getPriorityStats() {
            return priorityStats;
        }

        public long getUrgentCount() {
            return priorityStats.getOrDefault(Priority.URGENT, 0L);
        }

        public long getHighCount() {
            return priorityStats.getOrDefault(Priority.HIGH, 0L);
        }

        public long getMediumCount() {
            return priorityStats.getOrDefault(Priority.MEDIUM, 0L);
        }

        public long getLowCount() {
            return priorityStats.getOrDefault(Priority.LOW, 0L);
        }
    }
}