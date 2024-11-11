package com.example.todolist.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.persistence.EntityNotFoundException;

/**
 * 全局异常处理器
 * @Slf4j 提供日志功能
 * @RestControllerAdvice 标记这是一个REST全局异常处理器
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    /**
     * 处理EntityNotFoundException异常
     * @param e 实体未找到异常
     * @return 404响应
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFoundException(EntityNotFoundException e) {
        log.error("实体未找到: {}", e.getMessage());
        return ResponseEntity.notFound().build();
    }
    
    /**
     * 处理所有其他未捕获的异常
     * @param e 异常
     * @return 500响应
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception e) {
        log.error("发生错误: {}", e.getMessage());
        return ResponseEntity.internalServerError().body("服务器内部错误");
    }
} 