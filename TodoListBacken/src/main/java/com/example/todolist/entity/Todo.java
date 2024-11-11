package com.example.todolist.entity;

import lombok.Data;
import javax.persistence.*;

/**
 * Todo实体类，对应数据库中的todo_list表
 * @Data 注解自动生成getter、setter、toString等方法
 * @Entity 注解表明这是一个JPA实体类
 */
@Data
@Entity
@Table(name = "todo_list")
public class Todo {
    /**
     * 主键ID，使用自增策略
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 待办事项内容，不允许为空
     */
    @Column(nullable = false)
    private String value;
    
    /**
     * 待办事项完成状态，默认为false（未完成）
     */
    @Column(name = "is_completed")
    private boolean completed = false;
} 