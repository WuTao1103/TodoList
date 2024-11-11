# 使用 Node.js 官方镜像作为基础镜像
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --legacy-peer-deps

# 复制所有源代码
COPY . .

# 设置环境变量
ARG REACT_APP_API_URL
ARG REACT_APP_OPENAI_API_KEY
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_OPENAI_API_KEY=$REACT_APP_OPENAI_API_KEY
ENV CI=false
ENV NODE_OPTIONS="--max_old_space_size=4096"

# 直接使用 node_modules 中的 react-scripts
RUN node node_modules/react-scripts/scripts/build.js

# 使用 nginx 作为生产环境服务器
FROM nginx:alpine

# 复制构建产物到 nginx 目录
COPY --from=builder /app/build /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 3000 端口
EXPOSE 3000

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 