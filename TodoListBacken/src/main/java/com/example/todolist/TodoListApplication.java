package com.example.todolist;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * hhhhhh
 * Spring Boot 应用程序的入口类
 * @SpringBootApplication 注解表明这是一个 Spring Boot 应用程序
 * 它包含了 @Configuration, @EnableAutoConfiguration 和 @ComponentScan
 */
@SpringBootApplication
public class TodoListApplication {
    /**
     * 应用程序的主入口方法
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        SpringApplication.run(TodoListApplication.class, args);
    }
} 