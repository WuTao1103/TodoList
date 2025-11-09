# 全栈待办事项管理应用

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.0-green?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

一个功能丰富的现代化待办事项管理应用，采用 React 和 Spring Boot 构建，具有 AI 驱动的任务提取、子任务管理和多语言支持等特性。

[在线演示](https://todo.taowu.me) · [报告问题](https://github.com/WuTao1103/TodoList/issues) · [功能建议](https://github.com/WuTao1103/TodoList/issues)

</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [系统架构](#-系统架构)
- [API 设计](#-api-设计)
- [快速开始](#-快速开始)
- [环境变量](#-环境变量)
- [项目结构](#-项目结构)
- [CI/CD 与部署](#-cicd-与部署)
- [未来改进](#-未来改进)

---

## 🎯 项目概述

这是一个超越基础任务管理功能的全栈待办事项应用。它提供了现代化的用户体验，包括层级化任务组织（带子任务的待办事项）、基于自然语言的 AI 任务提取、优先级管理以及对中英文用户的国际化支持。

该应用遵循清晰的架构模式，React 前端通过 RESTful API 与 Spring Boot 后端通信，数据存储在 MySQL 数据库中。

**在线演示：** https://todo.taowu.me

---

## ✨ 功能特性

### 核心功能
- ✅ **增删改查** - 创建、读取、更新和删除待办事项
- 🎯 **任务完成** - 可视化反馈的任务完成状态切换
- 📊 **子任务管理** - 将复杂任务拆分为可管理的子任务
- 🔢 **优先级级别** - 四个优先级（低、中、高、紧急）并带有颜色标识

### 高级功能
- 🤖 **AI 任务提取** - 使用 OpenAI 从自然语言文本自动提取待办事项
- 🌐 **国际化** - 完整支持中文和英文（中文/English）
- 🌓 **主题支持** - 暗色模式和亮色模式，带平滑过渡
- 📈 **统计数据** - 实时进度跟踪和完成统计
- 🎨 **精美 UI** - Material-UI 组件搭配自定义样式和 Framer Motion 动画
- 🔍 **任务筛选** - 按完成状态筛选（全部、进行中、已完成）
- ⚡ **实时更新** - 乐观渲染的即时 UI 更新

### 技术特性
- 🐳 **Docker 化** - 前后端完整的 Docker 配置
- 🔒 **错误处理** - 全面的错误处理和用户友好的错误消息
- 📝 **日志记录** - 详细的日志用于调试和监控
- 🌍 **跨域支持** - 配置了跨域请求支持

---

## 🛠 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2.0 | UI 框架 |
| Material-UI | 5.13.0 | 组件库 |
| Tailwind CSS | 3.3.2 | 工具优先的 CSS |
| Framer Motion | 10.12.8 | 动画库 |
| React Router | 7.8.0 | 客户端路由 |
| React Context API | - | 状态管理 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Spring Boot | 2.7.0 | 应用框架 |
| Spring Data JPA | - | 数据持久化 |
| MySQL | 8.0 | 数据库 |
| Lombok | - | 减少样板代码 |
| Maven | 3.9+ | 构建工具 |
| Java | 11+ | 编程语言 |

### 运维
- Docker & Docker Compose
- Maven 用于 Java 构建
- npm 用于前端构建

---

## 🏗 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                         前端 (React)                         │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │  TodoList  │  │ SubtaskPage  │  │ TodoExtractor │       │
│  └────────────┘  └──────────────┘  └───────────────┘       │
│         │                │                   │               │
│  ┌──────▼────────────────▼───────────────────▼──────┐       │
│  │           Context API (状态管理)                  │       │
│  │  • TodoContext   • ThemeContext   • LanguageCtx   │       │
│  └───────────────────────────┬───────────────────────┘       │
└────────────────────────────────┼─────────────────────────────┘
                                 │ HTTP/REST
                                 │
┌────────────────────────────────▼─────────────────────────────┐
│                    后端 (Spring Boot)                         │
│  ┌───────────────────────────────────────────────────┐       │
│  │              TodoController (@RestController)      │       │
│  │  • Todo CRUD APIs     • 子任务管理 APIs            │       │
│  └─────────────────────┬─────────────────────────────┘       │
│                        │                                      │
│  ┌─────────────────────▼─────────────────────────────┐       │
│  │           Service 层 (业务逻辑)                     │       │
│  │  • TodoService        • SubtaskService             │       │
│  └─────────────────────┬─────────────────────────────┘       │
│                        │                                      │
│  ┌─────────────────────▼─────────────────────────────┐       │
│  │       Repository 层 (Spring Data JPA)              │       │
│  │  • TodoRepository     • SubtaskRepository          │       │
│  └─────────────────────┬─────────────────────────────┘       │
└────────────────────────┼─────────────────────────────────────┘
                         │ JDBC
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                        MySQL 数据库                           │
│  ┌──────────────┐              ┌─────────────┐              │
│  │  todo_list   │──────────────│   subtask   │              │
│  │  • id (主键) │         1:N  │ • id (主键) │              │
│  │  • value     │              │ • value     │              │
│  │  • completed │              │ • completed │              │
│  └──────────────┘              │ • parent_id │              │
│                                │ • priority  │              │
│                                │ • timestamps│              │
│                                └─────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### 关键架构决策

1. **分层架构**：后端遵循清晰的三层架构（Controller → Service → Repository）
2. **基于上下文的状态**：前端使用 React Context API 进行全局状态管理，而非 Redux，更加简洁
3. **RESTful API**：标准的 REST 端点，采用适当的 HTTP 方法（主任务的删除/更新使用 POST 是历史遗留）
4. **实体关系**：子任务通过外键链接到父任务，支持 1:N 关系
5. **国际化**：优先级枚举和 UI 组件内置双语支持

---

## 📡 API 设计

基础 URL：`http://localhost:8080/api`

### 待办事项端点

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| GET | `/get-todo` | 获取所有待办事项 | - |
| POST | `/add-todo` | 创建新待办事项 | `{value: string, completed: boolean}` |
| POST | `/update-todo/{id}` | 更新待办事项（切换完成状态） | `{value: string, completed: boolean}` |
| POST | `/del-todo/{id}` | 删除待办事项 | - |

### 子任务端点

| 方法 | 端点 | 描述 | 查询参数 |
|------|------|------|----------|
| GET | `/tasks/{id}/subtasks` | 获取待办事项的子任务 | `sortByPriority=true` |
| POST | `/tasks/{id}/subtasks` | 为待办事项添加子任务 | 请求体：`{value, completed, priority}` |
| PUT | `/subtasks/{id}` | 更新子任务 | 请求体：`{value, completed, priority}` |
| PUT | `/subtasks/{id}/priority` | 更新子任务优先级 | 请求体：`{priority}` |
| POST | `/subtasks/{id}/toggle` | 切换子任务完成状态 | - |
| DELETE | `/subtasks/{id}` | 删除子任务 | - |
| GET | `/tasks/{id}/subtasks/stats` | 获取子任务统计信息 | - |
| GET | `/tasks/{id}/subtasks/status` | 按完成状态筛选 | `completed=true/false` |
| GET | `/tasks/{id}/subtasks/priority` | 按优先级筛选 | `priority=LOW/MEDIUM/HIGH/URGENT` |
| DELETE | `/tasks/{id}/subtasks` | 删除所有子任务 | - |

### 其他端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/priorities` | 获取所有优先级枚举值 |

### 响应格式

**成功响应：**
```json
{
  "id": 1,
  "value": "完成项目文档",
  "completed": false
}
```

**错误响应：**
```json
{
  "message": "任务未找到",
  "timestamp": "2024-01-01T12:00:00",
  "status": 404
}
```

---

## 🚀 快速开始

### 前置要求

- **Java 11+**（用于后端）
- **Node.js 14+** 和 npm（用于前端）
- **MySQL 8.0+**
- **Maven 3.6+**
- **Docker & Docker Compose**（可选，用于容器化部署）

### 本地运行

#### 1. 克隆仓库

```bash
git clone https://github.com/WuTao1103/TodoList.git
cd TodoList
```

#### 2. 设置数据库

```sql
CREATE DATABASE todo_db;
```

在 `TodoListBacken/src/main/resources/application.yml` 中更新数据库凭据：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/todo_db?useSSL=false&serverTimezone=UTC
    username: your_username
    password: your_password
```

#### 3. 运行后端

```bash
cd TodoListBacken

# 安装依赖并运行
mvn clean install
mvn spring-boot:run

# 后端将在 http://localhost:8080 启动
```

#### 4. 运行前端

```bash
cd TodoListFront

# 安装依赖
npm install

# 启动开发服务器
npm start

# 前端将在 http://localhost:3000 启动
```

#### 5. 访问应用

在浏览器中打开 `http://localhost:3000`

### 使用 Docker 运行

```bash
# 构建并运行后端
cd TodoListBacken
docker-compose up -d

# 构建并运行前端
cd TodoListFront
docker-compose up -d
```

---

## 🔐 环境变量

### 前端 (.env)

在 `TodoListFront/` 目录下创建 `.env` 文件：

```env
# API 配置
REACT_APP_API_URL=/api

# OpenAI 配置（用于 AI 任务提取）
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-3.5-turbo
REACT_APP_OPENAI_TEMPERATURE=0.7
REACT_APP_OPENAI_MAX_TOKENS=150
```

### 后端 (application.yml)

位于 `TodoListBacken/src/main/resources/application.yml`：

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/todo_db?useSSL=false&serverTimezone=UTC
    username: root
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

logging:
  level:
    root: INFO
    com.example.todolist: DEBUG
```

**重要提示：**
- 永远不要提交 `.env` 文件或在版本控制中暴露 API 密钥
- 为生产部署使用特定环境的配置
- 更新数据库 URL 以匹配你的 MySQL 服务器位置

---

## 📁 项目结构

```
TodoList/
├── TodoListBacken/                 # Spring Boot 后端
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/todolist/
│   │   │   │   ├── controller/    # REST 控制器
│   │   │   │   │   └── TodoController.java
│   │   │   │   ├── service/       # 业务逻辑
│   │   │   │   │   ├── TodoService.java
│   │   │   │   │   └── SubtaskService.java
│   │   │   │   ├── repository/    # 数据访问层
│   │   │   │   │   ├── TodoRepository.java
│   │   │   │   │   └── SubtaskRepository.java
│   │   │   │   ├── entity/        # JPA 实体
│   │   │   │   │   ├── Todo.java
│   │   │   │   │   └── Subtask.java
│   │   │   │   ├── enums/         # 枚举
│   │   │   │   │   └── Priority.java
│   │   │   │   ├── config/        # 配置
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── exception/     # 异常处理
│   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   └── TodoListApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   ├── pom.xml                    # Maven 配置
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── TodoListFront/                 # React 前端
│   ├── public/
│   ├── src/
│   │   ├── components/           # React 组件
│   │   │   ├── TodoList.jsx     # 主待办事项列表组件
│   │   │   ├── TodoItem.jsx     # 单个待办事项组件
│   │   │   ├── TodoInput.jsx    # 新待办事项输入框
│   │   │   ├── TodoFilter.jsx   # 筛选控件
│   │   │   ├── TodoStats.jsx    # 统计显示
│   │   │   ├── SubtaskPage.jsx  # 子任务管理页面
│   │   │   ├── TodoExtractor.jsx # AI 任务提取
│   │   │   ├── ThemeToggle.jsx  # 主题切换器
│   │   │   └── LanguageToggle.jsx # 语言切换器
│   │   ├── context/              # React Context
│   │   │   ├── TodoContext.js   # 待办事项状态管理
│   │   │   ├── ThemeContext.js  # 主题状态
│   │   │   └── LanguageContext.js # 语言状态
│   │   ├── pages/                # 页面组件
│   │   │   └── MainPage.jsx     # 主应用页面
│   │   ├── locales/              # 国际化翻译
│   │   │   └── index.js
│   │   ├── theme/                # MUI 主题配置
│   │   │   └── index.js
│   │   ├── App.js                # 根组件
│   │   └── index.js              # 入口点
│   ├── package.json
│   ├── .env                       # 环境变量
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── CLAUDE.md                      # AI 助手指南
└── README.md                      # 本文件
```

---

## 🔄 CI/CD 与部署

### 当前部署

应用目前部署于：**https://todo.taowu.me**

### Docker 部署

前端和后端都已使用 Docker 容器化：

**后端：**
```bash
cd TodoListBacken
docker build -t todolist-backend .
docker run -p 8080:8080 --env-file .env todolist-backend
```

**前端：**
```bash
cd TodoListFront
docker build -t todolist-frontend .
docker run -p 3000:3000 todolist-frontend
```

**使用 Docker Compose：**
```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看日志
docker-compose logs -f
```

### 生产环境考虑事项

1. **数据库**：使用托管的 MySQL 服务（AWS RDS、Azure Database 等）
2. **环境变量**：使用密钥管理（AWS Secrets Manager、HashiCorp Vault）
3. **反向代理**：配置 nginx 进行路由和 SSL 终止
4. **监控**：实现应用监控（Prometheus、Grafana）
5. **日志**：集中化日志（ELK 栈、CloudWatch）
6. **扩展**：使用 Kubernetes 进行容器编排

### 推荐的 CI/CD 流水线

```yaml
# GitHub Actions 工作流示例
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  backend-build:
    - 检出代码
    - 设置 Java 11
    - 运行测试：mvn test
    - 构建 JAR：mvn package
    - 构建 Docker 镜像
    - 推送到镜像仓库

  frontend-build:
    - 检出代码
    - 设置 Node.js
    - 运行测试：npm test
    - 构建：npm run build
    - 构建 Docker 镜像
    - 推送到镜像仓库

  deploy:
    - 拉取镜像
    - 部署到服务器
    - 健康检查
```

---

## 🚧 未来改进

### 高优先级
- [ ] **用户认证** - 添加使用 JWT 令牌的登录/注册功能
- [ ] **用户账户** - 支持多用户，每个用户有独立的待办事项列表
- [ ] **任务分享** - 与其他用户分享待办事项并协作
- [ ] **截止日期** - 添加截止日期支持和提醒功能
- [ ] **标签/分类** - 使用自定义标签组织待办事项
- [ ] **搜索** - 跨待办事项和子任务的全文搜索

### 中优先级
- [ ] **拖放** - 通过拖放重新排序待办事项和子任务
- [ ] **循环任务** - 支持重复性待办事项
- [ ] **文件附件** - 为待办事项附加文件/图片
- [ ] **富文本编辑器** - 增强描述的文本格式化功能
- [ ] **移动应用** - 使用 React Native 开发原生 iOS/Android 应用
- [ ] **PWA** - 渐进式 Web 应用支持离线功能

### 技术改进
- [ ] **单元测试** - 提高测试覆盖率（目标：80%+）
- [ ] **集成测试** - 使用 Cypress 进行端到端测试
- [ ] **性能** - 使用 Redis 实现缓存
- [ ] **API 版本控制** - 为 API 添加版本以保证向后兼容
- [ ] **GraphQL** - 在 REST 之外提供 GraphQL API
- [ ] **微服务** - 拆分为独立服务（认证、任务、通知）
- [ ] **WebSocket** - 使用 WebSocket 连接实现实时更新
- [ ] **速率限制** - API 速率限制以防止滥用

### AI 增强
- [ ] **智能建议** - 基于历史记录的 AI 驱动任务建议
- [ ] **优先级预测** - 使用机器学习自动建议优先级
- [ ] **自然语言** - 通过语音命令创建待办事项
- [ ] **智能调度** - AI 辅助的任务调度和时间估算

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 项目
2. 创建功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

---

## 📞 联系方式

项目链接：[https://github.com/WuTao1103/TodoList](https://github.com/WuTao1103/TodoList)

---
