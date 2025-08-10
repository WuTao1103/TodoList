package com.example.todolist.repository;

import com.example.todolist.entity.Subtask;
import com.example.todolist.enums.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Subtask实体的数据访问接口
 * 继承JpaRepository，提供基本的CRUD操作
 * 泛型参数：<Subtask, Long> 表示实体类型是Subtask，主键类型是Long
 */
public interface SubtaskRepository extends JpaRepository<Subtask, Long> {

    /**
     * 根据父任务ID查找所有子任务，按优先级降序排列
     * @param parentTaskId 父任务ID
     * @return 子任务列表（按优先级从高到低）
     */
    @Query("SELECT s FROM Subtask s WHERE s.parentTaskId = :parentTaskId ORDER BY s.priority DESC, s.createdAt ASC")
    List<Subtask> findByParentTaskIdOrderByPriorityDesc(@Param("parentTaskId") Long parentTaskId);

    /**
     * 根据父任务ID查找所有子任务（原方法保留兼容性）
     * @param parentTaskId 父任务ID
     * @return 子任务列表
     */
    List<Subtask> findByParentTaskId(Long parentTaskId);

    /**
     * 根据父任务ID和完成状态查找子任务，按优先级排序
     * @param parentTaskId 父任务ID
     * @param completed 完成状态
     * @return 子任务列表
     */
    @Query("SELECT s FROM Subtask s WHERE s.parentTaskId = :parentTaskId AND s.completed = :completed ORDER BY s.priority DESC, s.createdAt ASC")
    List<Subtask> findByParentTaskIdAndCompletedOrderByPriority(@Param("parentTaskId") Long parentTaskId, @Param("completed") boolean completed);

    /**
     * 根据父任务ID和优先级查找子任务
     * @param parentTaskId 父任务ID
     * @param priority 优先级
     * @return 子任务列表
     */
    List<Subtask> findByParentTaskIdAndPriority(Long parentTaskId, Priority priority);

    /**
     * 统计某个父任务下子任务的总数
     * @param parentTaskId 父任务ID
     * @return 子任务总数
     */
    @Query("SELECT COUNT(s) FROM Subtask s WHERE s.parentTaskId = :parentTaskId")
    long countByParentTaskId(@Param("parentTaskId") Long parentTaskId);

    /**
     * 统计某个父任务下已完成子任务的数量
     * @param parentTaskId 父任务ID
     * @return 已完成子任务数量
     */
    @Query("SELECT COUNT(s) FROM Subtask s WHERE s.parentTaskId = :parentTaskId AND s.completed = true")
    long countCompletedByParentTaskId(@Param("parentTaskId") Long parentTaskId);

    /**
     * 统计某个父任务下指定优先级的子任务数量
     * @param parentTaskId 父任务ID
     * @param priority 优先级
     * @return 指定优先级的子任务数量
     */
    long countByParentTaskIdAndPriority(Long parentTaskId, Priority priority);

    /**
     * 删除某个父任务下的所有子任务
     * @param parentTaskId 父任务ID
     */
    void deleteByParentTaskId(Long parentTaskId);
}