package com.example.todolist.repository;

import com.example.todolist.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Todo实体的数据访问接口
 * 继承JpaRepository，提供基本的CRUD操作
 * 泛型参数：<Todo, Long> 表示实体类型是Todo，主键类型是Long
 */
public interface TodoRepository extends JpaRepository<Todo, Long> {
} 