# Personal KB

个人知识库。前端通过 Vite 代理请求后端 `/api`。

## 技术栈

### 前端

| 用途 | 技术 |
| --- | --- |
| 框架 | React 19 |
| 语言 | TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 |
| 类名 | clsx、tailwind-merge |
| 检查 | Oxlint |

### 后端

| 用途 | 技术 |
| --- | --- |
| 框架 | FastAPI |
| 运行 | Uvicorn |
| 配置 | Pydantic Settings |
| 数据库 ORM | SQLAlchemy 2（async）+ asyncpg |
| 迁移 | Alembic |
| 缓存 | Redis |
| RAG | LangChain、LangChain OpenAI、Chroma |
| 上传 | python-multipart |

### 基础设施

| 用途 | 技术 |
| --- | --- |
| 关系数据库 | PostgreSQL 16 |
| 缓存 | Redis 7 |
| 编排 | Docker Compose |

## 环境

- Python 3.11+
- Node.js 22（或 20.19+）与 npm
- Docker，用于启动 PostgreSQL 和 Redis

后端环境变量见 `backend/.env.example`，前端见 `frontend/.env.example`。

| 变量 | 说明 | 默认 |
| --- | --- | --- |
| `DATABASE_URL` | PostgreSQL 异步连接串 | `postgresql+asyncpg://postgres:postgres@localhost:5432/personal_kb` |
| `REDIS_URL` | Redis 地址 | `redis://localhost:6379/0` |
| `CORS_ORIGINS` | 允许的前端来源 | `["http://localhost:5173"]` |
| `UPLOAD_DIR` | 上传目录 | `uploads` |
| `VITE_API_BASE_URL` | 前端请求前缀 | `/api` |

前端开发服务器把 `/api` 代理到 `http://localhost:8000`。

## 启动

需要两个终端，分别跑后端和前端。先把数据库和缓存拉起来。

### 1. PostgreSQL 与 Redis

在仓库根目录：

```powershell
docker compose up -d
```

### 2. 后端

```powershell
cd backend
copy .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- 接口文档：http://localhost:8000/docs
- 健康检查：http://localhost:8000/api/health

### 3. 前端

另开一个终端：

```powershell
cd frontend
copy .env.example .env
npm install
npm run dev
```

页面：http://localhost:5173

生产构建：

```powershell
npm run build
npm run preview
```
