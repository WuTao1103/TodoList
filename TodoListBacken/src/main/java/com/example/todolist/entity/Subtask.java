package com.example.todolist.entity;

import com.example.todolist.enums.Priority;
import lombok.Data;
import javax.persistence.*;

/**
 * Subtask实体类，对应数据库中的subtask表
 * @Data 注解自动生成getter、setter、toString等方法
 * @Entity 注解表明这是一个JPA实体类
 */
@Data
@Entity
@Table(name = "subtask")
public class Subtask {
    /**
     * 主键ID，使用自增策略
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 子任务内容，不允许为空
     */
    @Column(nullable = false)
    private String value;

    /**
     * 子任务完成状态，默认为false（未完成）
     */
    @Column(name = "is_completed")
    private boolean completed = false;

    /**
     * 父任务ID，外键关联到todo表
     */
    @Column(name = "parent_task_id", nullable = false)
    private Long parentTaskId;

    /**
     * 优先级，默认为中等优先级
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    /**
     * 创建时间
     */
    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    /**
     * 在保存前自动设置创建时间和更新时间
     */
    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    /**
     * 在更新前自动设置更新时间
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}