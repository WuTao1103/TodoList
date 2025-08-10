package com.example.todolist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 配置类
 * 允许前端应用访问后端 API
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 所有路径
                .allowedOriginPatterns("*")  // 允许所有域名（更宽松的配置）
                .allowedOrigins(
                    "http://localhost:3000",              // 本地开发
                    "http://127.0.0.1:3000",              // 本地开发
                    "http://localhost:3001",              // 备用端口
                    "http://127.0.0.1:3001",              // 备用端口
                    "http://192.168.0.50:3000",           // 内网IP访问
                    "http://todo.taowu.me:3000",          // 外网域名访问
                    "https://todo.taowu.me",              // 生产环境HTTPS域名
                    "http://todo.taowu.me"                // 生产环境HTTP域名（备用）
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允许的HTTP方法
                .allowedHeaders("*")  // 允许所有header
                .allowCredentials(true);  // 允许发送cookie
    }
}