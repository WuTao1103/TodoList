# Full-Stack Todo List Application

<div align="center">

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7.0-green?logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

A modern, feature-rich todo list application built with React and Spring Boot, featuring AI-powered task extraction, subtask management, and multi-language support.

[Demo](https://todo.taowu.me) · [Report Bug](https://github.com/WuTao1103/TodoList/issues) · [Request Feature](https://github.com/WuTao1103/TodoList/issues)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [API Design](#-api-design)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Folder Structure](#-folder-structure)
- [CI/CD & Deployment](#-cicd--deployment)
- [Future Improvements](#-future-improvements)

---

## 🎯 Project Overview

This is a full-stack todo list application that goes beyond basic task management. It provides a modern user experience with features like hierarchical task organization (todos with subtasks), AI-powered task extraction from natural text, priority management, and internationalization support for both Chinese and English users.

The application follows a clean architecture pattern with a React-based frontend communicating with a RESTful Spring Boot backend, backed by a MySQL database.

**Live Demo:** http://todo.taowu.me

---

## ✨ Features

### Core Features
- ✅ **CRUD Operations** - Create, read, update, and delete todos
- 🎯 **Task Completion** - Toggle task completion status with visual feedback
- 📊 **Subtask Management** - Break down complex tasks into manageable subtasks
- 🔢 **Priority Levels** - Four priority levels (Low, Medium, High, Urgent) with color coding

### Advanced Features
- 🤖 **AI Task Extraction** - Automatically extract todo items from natural language text using OpenAI
- 🌐 **Internationalization** - Full support for English and Chinese (中文/English)
- 🌓 **Theme Support** - Dark mode and light mode with smooth transitions
- 📈 **Statistics** - Real-time progress tracking and completion statistics
- 🎨 **Beautiful UI** - Material-UI components with custom styling and Framer Motion animations
- 🔍 **Task Filtering** - Filter by completion status (All, Active, Completed)
- ⚡ **Real-time Updates** - Instant UI updates with optimistic rendering

### Technical Features
- 🐳 **Dockerized** - Complete Docker setup for both frontend and backend
- 🔒 **Error Handling** - Comprehensive error handling with user-friendly messages
- 📝 **Logging** - Detailed logging for debugging and monitoring
- 🌍 **CORS Support** - Configured for cross-origin requests

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| Material-UI | 5.13.0 | Component library |
| Tailwind CSS | 3.3.2 | Utility-first CSS |
| Framer Motion | 10.12.8 | Animation library |
| React Router | 7.8.0 | Client-side routing |
| React Context API | - | State management |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 2.7.0 | Application framework |
| Spring Data JPA | - | Data persistence |
| MySQL | 8.0 | Database |
| Lombok | - | Boilerplate reduction |
| Maven | 3.9+ | Build tool |
| Java | 11+ | Programming language |

### DevOps
- Docker & Docker Compose
- Maven for Java builds
- npm for frontend builds

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │  TodoList  │  │ SubtaskPage  │  │ TodoExtractor │       │
│  └────────────┘  └──────────────┘  └───────────────┘       │
│         │                │                   │               │
│  ┌──────▼────────────────▼───────────────────▼──────┐       │
│  │           Context API (State Management)          │       │
│  │  • TodoContext   • ThemeContext   • LanguageCtx   │       │
│  └───────────────────────────┬───────────────────────┘       │
└────────────────────────────────┼─────────────────────────────┘
                                 │ HTTP/REST
                                 │
┌────────────────────────────────▼─────────────────────────────┐
│                    Backend (Spring Boot)                      │
│  ┌───────────────────────────────────────────────────┐       │
│  │              TodoController (@RestController)      │       │
│  │  • Todo CRUD APIs     • Subtask Management APIs    │       │
│  └─────────────────────┬─────────────────────────────┘       │
│                        │                                      │
│  ┌─────────────────────▼─────────────────────────────┐       │
│  │           Service Layer (Business Logic)           │       │
│  │  • TodoService        • SubtaskService             │       │
│  └─────────────────────┬─────────────────────────────┘       │
│                        │                                      │
│  ┌─────────────────────▼─────────────────────────────┐       │
│  │       Repository Layer (Spring Data JPA)           │       │
│  │  • TodoRepository     • SubtaskRepository          │       │
│  └─────────────────────┬─────────────────────────────┘       │
└────────────────────────┼─────────────────────────────────────┘
                         │ JDBC
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                        MySQL Database                         │
│  ┌──────────────┐              ┌─────────────┐              │
│  │  todo_list   │──────────────│   subtask   │              │
│  │  • id (PK)   │         1:N  │ • id (PK)   │              │
│  │  • value     │              │ • value     │              │
│  │  • completed │              │ • completed │              │
│  └──────────────┘              │ • parent_id │              │
│                                │ • priority  │              │
│                                │ • timestamps│              │
│                                └─────────────┘              │
└──────────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Layered Architecture**: Backend follows a clean 3-layer architecture (Controller → Service → Repository)
2. **Context-Based State**: Frontend uses React Context API for global state instead of Redux for simplicity
3. **RESTful API**: Standard REST endpoints with proper HTTP methods (except legacy POST for delete/update on todos)
4. **Entity Relationships**: Subtasks are linked to parent todos via foreign key, supporting 1:N relationship
5. **Internationalization**: Dual language support built into Priority enum and UI components

---

## 📡 API Design

Base URL: `http://localhost:8080/api`

### Todo Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/get-todo` | Get all todos | - |
| POST | `/add-todo` | Create a new todo | `{value: string, completed: boolean}` |
| POST | `/update-todo/{id}` | Update todo (toggle completion) | `{value: string, completed: boolean}` |
| POST | `/del-todo/{id}` | Delete a todo | - |

### Subtask Endpoints

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/tasks/{id}/subtasks` | Get subtasks for a todo | `sortByPriority=true` |
| POST | `/tasks/{id}/subtasks` | Add subtask to todo | Body: `{value, completed, priority}` |
| PUT | `/subtasks/{id}` | Update subtask | Body: `{value, completed, priority}` |
| PUT | `/subtasks/{id}/priority` | Update subtask priority | Body: `{priority}` |
| POST | `/subtasks/{id}/toggle` | Toggle subtask completion | - |
| DELETE | `/subtasks/{id}` | Delete subtask | - |
| GET | `/tasks/{id}/subtasks/stats` | Get subtask statistics | - |
| GET | `/tasks/{id}/subtasks/status` | Filter by completion status | `completed=true/false` |
| GET | `/tasks/{id}/subtasks/priority` | Filter by priority | `priority=LOW/MEDIUM/HIGH/URGENT` |
| DELETE | `/tasks/{id}/subtasks` | Delete all subtasks | - |

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/priorities` | Get all priority enum values |

### Response Format

**Success Response:**
```json
{
  "id": 1,
  "value": "Complete project documentation",
  "completed": false
}
```

**Error Response:**
```json
{
  "message": "Task not found",
  "timestamp": "2024-01-01T12:00:00",
  "status": 404
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Java 11+** (for backend)
- **Node.js 14+** and npm (for frontend)
- **MySQL 8.0+**
- **Maven 3.6+**
- **Docker & Docker Compose** (optional, for containerized deployment)

### Run Locally

#### 1. Clone the Repository

```bash
git clone https://github.com/WuTao1103/TodoList.git
cd TodoList
```

#### 2. Setup Database

```sql
CREATE DATABASE todo_db;
```

Update database credentials in `TodoListBacken/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/todo_db?useSSL=false&serverTimezone=UTC
    username: your_username
    password: your_password
```

#### 3. Run Backend

```bash
cd TodoListBacken

# Install dependencies and run
mvn clean install
mvn spring-boot:run

# Backend will start at http://localhost:8080
```

#### 4. Run Frontend

```bash
cd TodoListFront

# Install dependencies
npm install

# Start development server
npm start

# Frontend will start at http://localhost:3000
```

#### 5. Access the Application

Open your browser and navigate to `http://localhost:3000`

### Run with Docker

```bash
# Build and run backend
cd TodoListBacken
docker-compose up -d

# Build and run frontend
cd TodoListFront
docker-compose up -d
```

---

## 🔐 Environment Variables

### Frontend (.env)

Create a `.env` file in `TodoListFront/` directory:

```env
# API Configuration
REACT_APP_API_URL=/api

# OpenAI Configuration (for AI task extraction)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-3.5-turbo
REACT_APP_OPENAI_TEMPERATURE=0.7
REACT_APP_OPENAI_MAX_TOKENS=150
```

### Backend (application.yml)

Located at `TodoListBacken/src/main/resources/application.yml`:

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

**Important Notes:**
- Never commit `.env` files or expose API keys in version control
- Use environment-specific configurations for production deployments
- Update database URLs to match your MySQL server location

---

## 📁 Folder Structure

```
TodoList/
├── TodoListBacken/                 # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/todolist/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   │   └── TodoController.java
│   │   │   │   ├── service/       # Business Logic
│   │   │   │   │   ├── TodoService.java
│   │   │   │   │   └── SubtaskService.java
│   │   │   │   ├── repository/    # Data Access Layer
│   │   │   │   │   ├── TodoRepository.java
│   │   │   │   │   └── SubtaskRepository.java
│   │   │   │   ├── entity/        # JPA Entities
│   │   │   │   │   ├── Todo.java
│   │   │   │   │   └── Subtask.java
│   │   │   │   ├── enums/         # Enumerations
│   │   │   │   │   └── Priority.java
│   │   │   │   ├── config/        # Configuration
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   ├── exception/     # Exception Handling
│   │   │   │   │   └── GlobalExceptionHandler.java
│   │   │   │   └── TodoListApplication.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   ├── pom.xml                    # Maven Configuration
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── TodoListFront/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/           # React Components
│   │   │   ├── TodoList.jsx     # Main todo list component
│   │   │   ├── TodoItem.jsx     # Individual todo item
│   │   │   ├── TodoInput.jsx    # Input for new todos
│   │   │   ├── TodoFilter.jsx   # Filter controls
│   │   │   ├── TodoStats.jsx    # Statistics display
│   │   │   ├── SubtaskPage.jsx  # Subtask management page
│   │   │   ├── TodoExtractor.jsx # AI task extraction
│   │   │   ├── ThemeToggle.jsx  # Theme switcher
│   │   │   └── LanguageToggle.jsx # Language switcher
│   │   ├── context/              # React Context
│   │   │   ├── TodoContext.js   # Todo state management
│   │   │   ├── ThemeContext.js  # Theme state
│   │   │   └── LanguageContext.js # Language state
│   │   ├── pages/                # Page components
│   │   │   └── MainPage.jsx     # Main application page
│   │   ├── locales/              # i18n translations
│   │   │   └── index.js
│   │   ├── theme/                # MUI theme config
│   │   │   └── index.js
│   │   ├── App.js                # Root component
│   │   └── index.js              # Entry point
│   ├── package.json
│   ├── .env                       # Environment variables
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── README.md                      # This file
```

---

## 🔄 CI/CD & Deployment

### Current Deployment

The application is currently deployed at: **https://todo.taowu.me**

### Docker Deployment

Both frontend and backend are containerized with Docker:

**Backend:**
```bash
cd TodoListBacken
docker build -t todolist-backend .
docker run -p 8080:8080 --env-file .env todolist-backend
```

**Frontend:**
```bash
cd TodoListFront
docker build -t todolist-frontend .
docker run -p 3000:3000 todolist-frontend
```

**Using Docker Compose:**
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

### Production Considerations

1. **Database**: Use managed MySQL service (AWS RDS, Azure Database, etc.)
2. **Environment Variables**: Use secrets management (AWS Secrets Manager, HashiCorp Vault)
3. **Reverse Proxy**: Configure nginx for routing and SSL termination
4. **Monitoring**: Implement application monitoring (Prometheus, Grafana)
5. **Logging**: Centralize logs (ELK stack, CloudWatch)
6. **Scaling**: Use Kubernetes for container orchestration

### Recommended CI/CD Pipeline

```yaml
# Example GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  backend-build:
    - Checkout code
    - Setup Java 11
    - Run tests: mvn test
    - Build JAR: mvn package
    - Build Docker image
    - Push to registry

  frontend-build:
    - Checkout code
    - Setup Node.js
    - Run tests: npm test
    - Build: npm run build
    - Build Docker image
    - Push to registry

  deploy:
    - Pull images
    - Deploy to server
    - Health check
```

---

## 🚧 Future Improvements

### High Priority
- [ ] **User Authentication** - Add login/registration with JWT tokens
- [ ] **User Accounts** - Support multiple users with separate todo lists
- [ ] **Task Sharing** - Share todos and collaborate with other users
- [ ] **Due Dates** - Add deadline support with reminders
- [ ] **Tags/Categories** - Organize todos with custom tags
- [ ] **Search** - Full-text search across todos and subtasks

### Medium Priority
- [ ] **Drag & Drop** - Reorder todos and subtasks with drag-and-drop
- [ ] **Recurring Tasks** - Support for recurring todo items
- [ ] **File Attachments** - Attach files/images to todos
- [ ] **Rich Text Editor** - Enhanced text formatting for descriptions
- [ ] **Mobile App** - Native iOS/Android apps with React Native
- [ ] **PWA** - Progressive Web App support for offline functionality

### Technical Improvements
- [ ] **Unit Tests** - Increase test coverage (target: 80%+)
- [ ] **Integration Tests** - End-to-end testing with Cypress
- [ ] **Performance** - Implement caching with Redis
- [ ] **API Versioning** - Version the API for backward compatibility
- [ ] **GraphQL** - Alternative GraphQL API alongside REST
- [ ] **Microservices** - Split into separate services (auth, tasks, notifications)
- [ ] **WebSocket** - Real-time updates with WebSocket connections
- [ ] **Rate Limiting** - API rate limiting to prevent abuse

### AI Enhancements
- [ ] **Smart Suggestions** - AI-powered task suggestions based on history
- [ ] **Priority Prediction** - Auto-suggest priority levels using ML
- [ ] **Natural Language** - Create todos via voice commands
- [ ] **Smart Scheduling** - AI-assisted task scheduling and time estimation

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

Project Link: [https://taowu.me](https://taowu.me)

---
