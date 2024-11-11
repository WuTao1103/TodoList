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
                .allowedOrigins(
                    "http://192.168.0.12:3000",           // 内网IP访问
                    "http://taonasn1.synology.me:3000"    // 外网域名访问
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // 允许的HTTP方法
                .allowedHeaders("*")  // 允许所有header
                .allowCredentials(true);  // 允许发送cookie
    }
}