# 项目架构文档

## 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [代码组织模式](#代码组织模式)
- [代码风格规范](#代码风格规范)
- [命名约定](#命名约定)
- [开发指南](#开发指南)
- [最佳实践](#最佳实践)

## 项目概述

本项目是一个基于 Hono 框架的 Mock Server，使用 Bun 运行时，采用 MongoDB 作为数据存储，提供 RESTful API 服务。

### 核心特性

- **运行时**: Bun
- **Web 框架**: Hono
- **数据库**: MongoDB (Mongoose)
- **验证**: Zod
- **代码格式化**: Biome
- **认证**: JWT
- **密码加密**: Bun 内置加密

## 技术栈

### 核心依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `hono` | ^4.10.4 | Web 框架 |
| `mongoose` | ^8.19.3 | MongoDB ODM |
| `zod` | ^4.1.12 | 数据验证和类型推断 |
| `@hono/zod-validator` | ^0.7.4 | Hono Zod 验证中间件 |
| `hashids` | ^2.3.0 | ID 编码/解码 |

### 开发依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `@biomejs/biome` | 2.3.4 | 代码格式化和 lint |
| `@types/bun` | latest | Bun 类型定义 |

## 项目结构

```
mock-server/
├── src/
│   ├── main.ts              # 应用入口点
│   ├── app.ts               # Hono 应用配置和错误处理
│   ├── types.d.ts           # 全局类型声明
│   ├── routes/              # 路由定义
│   │   ├── index.ts         # 路由聚合
│   │   └── user/            # 用户相关路由
│   │       ├── index.ts     # 路由处理器
│   │       ├── user.dto.ts  # 数据传输对象（Zod Schema）
│   │       ├── user.service.ts  # 业务逻辑
│   │       ├── user.mapper.ts   # 数据访问层
│   │       └── shared/      # 共享工具（transformer 等）
│   ├── schemas/             # Mongoose Schema 定义
│   │   └── user.ts
│   ├── core/                # 核心功能模块
│   │   ├── auth/            # 认证相关
│   │   │   ├── hash.ts      # HashID 工具
│   │   │   ├── jwt.ts       # JWT 服务
│   │   │   └── password.ts  # 密码加密/验证
│   │   ├── db/              # 数据库连接
│   │   │   └── mongo.ts
│   │   └── middleware/      # 中间件
│   │       ├── jwt.ts       # JWT 验证中间件
│   │       └── validator.ts # 请求验证中间件
│   └── common/              # 通用工具和常量
│       ├── api/             # API 响应工具
│       │   ├── http.ts      # HTTP 响应格式化
│       │   └── index.ts
│       └── consts/          # 常量定义
│           └── index.ts
├── _test/                   # 测试文件
├── biome.json               # Biome 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 项目依赖
└── README.md                # 项目说明
```

## 代码组织模式

### 分层架构

项目采用清晰的分层架构，遵循关注点分离原则：

```
┌─────────────────────────────────────┐
│         Routes (路由层)              │
│   - 处理 HTTP 请求/响应              │
│   - 调用 Service 层                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service (业务逻辑层)         │
│   - 业务逻辑处理                      │
│   - 调用 Mapper 层                    │
│   - 使用 Core 模块                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Mapper (数据访问层)          │
│   - 数据库操作                        │
│   - 使用 Schema 模型                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Schema (数据模型层)          │
│   - Mongoose Schema 定义             │
└─────────────────────────────────────┘
```

### 模块职责

#### 1. Routes 层 (`src/routes/`)

**职责**:
- 定义 HTTP 路由
- 处理请求参数验证
- 调用 Service 层
- 格式化响应

**文件命名**:
- `{module}/index.ts` - 路由定义
- `{module}/{module}.dto.ts` - 请求/响应 DTO（Zod Schema）
- `{module}/{module}.service.ts` - 业务逻辑
- `{module}/{module}.mapper.ts` - 数据访问

**示例结构**:
```typescript
// routes/user/index.ts
import { Hono } from "hono";
import { validator } from "@core/middleware/validator";
import { RegisterRequestDto } from "./user.dto";
import userService from "./user.service";

const user = new Hono();

user.post("/register", validator("json", RegisterRequestDto), async (c) => {
  const params = c.req.valid("json");
  const user = await userService.register(params);
  return c.json(HttpResponse({ message: "user create success", data: user }));
});

export { user };
```

#### 2. Service 层 (`src/routes/{module}/{module}.service.ts`)

**职责**:
- 实现业务逻辑
- 调用 Mapper 层进行数据操作
- 使用 Core 模块（auth、hash 等）
- 数据转换和验证

**命名约定**:
- 私有方法使用 `_` 前缀（如 `_create`）
- 公共方法使用驼峰命名

**示例**:
```typescript
const userService = {
  _create: async (params: RegisterRequestDto) => {
    // 私有方法：创建用户内部逻辑
  },
  register: async (params: RegisterRequestDto) => {
    // 公共方法：注册用户
  },
  login: async (params: LoginRequestDto) => {
    // 公共方法：用户登录
  },
};

export default userService;
```

#### 3. Mapper 层 (`src/routes/{module}/{module}.mapper.ts`)

**职责**:
- 封装数据库操作
- 提供数据访问接口
- 使用 Mongoose 模型

**示例**:
```typescript
import { UserModel } from "@schemas/user";

const userMapper = {
  find: async (query: any, opt: any) => {
    return await UserModel.find(query, {}, opt);
  },
  getById: async (id: string) => {
    return await UserModel.findOne({ id });
  },
  create: async (user: UserModel) => {
    return await UserModel.create(user);
  },
};

export default userMapper;
```

#### 4. Schema 层 (`src/schemas/`)

**职责**:
- 定义 Mongoose Schema
- 导出类型定义
- 导出模型实例

**示例**:
```typescript
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
});

export type UserModel = mongoose.InferSchemaType<typeof schema>;
export const UserModel = mongoose.model("User", schema);
```

#### 5. Core 模块 (`src/core/`)

**职责**:
- 提供核心功能（认证、数据库、中间件）
- 可复用的工具函数
- 系统级配置

**子模块**:
- `auth/` - 认证相关（JWT、密码、HashID）
- `db/` - 数据库连接管理
- `middleware/` - 中间件（JWT 验证、请求验证）

#### 6. Common 模块 (`src/common/`)

**职责**:
- 通用工具函数
- API 响应格式化
- 常量定义

## 代码风格规范

### TypeScript 配置

- **严格模式**: 启用 `strict: true`
- **路径别名**: 使用 `@common/*`, `@core/*`, `@schemas/*`
- **模块系统**: ES Modules

### Biome 配置

项目使用 Biome 进行代码格式化和 lint：

- **缩进**: Tab
- **引号**: 双引号
- **自动导入排序**: 启用

### 代码风格要求

1. **导入顺序**:
   ```typescript
   // 1. 外部库
   import { Hono } from "hono";
   import mongoose from "mongoose";
   
   // 2. 路径别名导入
   import { HttpResponse } from "@common/api";
   import { jwtMiddleware } from "@core/middleware/jwt";
   
   // 3. 相对路径导入
   import { RegisterRequestDto } from "./user.dto";
   import userService from "./user.service";
   ```

2. **导出方式**:
   - 默认导出用于服务、映射器等单例对象
   - 命名导出用于类型、常量、工具函数

3. **函数定义**:
   - 使用箭头函数或函数表达式
   - 异步函数使用 `async/await`

4. **错误处理**:
   - 使用 `HttpError` 工具函数抛出 HTTP 异常
   - 在 `app.ts` 中统一处理错误

5. **响应格式**:
   - 成功响应使用 `HttpResponse` 工具函数
   - 统一格式: `{ success: true, data: T, message?: string }`

## 命名约定

### 文件命名

- **路由文件**: `{module}/index.ts`
- **DTO 文件**: `{module}.dto.ts`
- **Service 文件**: `{module}.service.ts`
- **Mapper 文件**: `{module}.mapper.ts`
- **Schema 文件**: `{module}.ts` (在 `schemas/` 目录下)
- **工具文件**: `{name}.ts`

### 变量命名

- **常量**: 全大写下划线分隔 (`MONGO_DB_URL`)
- **变量/函数**: 驼峰命名 (`userService`, `getById`)
- **私有方法**: 下划线前缀 (`_create`)
- **类型/接口**: 驼峰命名，首字母大写 (`UserModel`, `IJwtPayload`)

### 目录命名

- **小写**: 所有目录使用小写字母
- **单数形式**: 模块目录使用单数（`user/` 而非 `users/`）

## 开发指南

### 添加新功能模块

1. **创建 Schema** (`src/schemas/{module}.ts`):
   ```typescript
   import mongoose from "mongoose";
   
   const schema = new mongoose.Schema({
     // 字段定义
   });
   
   export type {Module}Model = mongoose.InferSchemaType<typeof schema>;
   export const {Module}Model = mongoose.model("{Module}", schema);
   ```

2. **创建 Mapper** (`src/routes/{module}/{module}.mapper.ts`):
   ```typescript
   import { {Module}Model } from "@schemas/{module}";
   
   const {module}Mapper = {
     getById: async (id: string) => {
       // 实现
     },
     create: async (data: {Module}Model) => {
       // 实现
     },
   };
   
   export default {module}Mapper;
   ```

3. **创建 DTO** (`src/routes/{module}/{module}.dto.ts`):
   ```typescript
   import * as z from "zod";
   
   export const Create{Module}Dto = z.object({
     // 字段定义
   });
   
   export type Create{Module}Dto = z.infer<typeof Create{Module}Dto>;
   ```

4. **创建 Service** (`src/routes/{module}/{module}.service.ts`):
   ```typescript
   import { HttpError } from "@common/api";
   import {module}Mapper from "./{module}.mapper";
   import type { Create{Module}Dto } from "./{module}.dto";
   
   const {module}Service = {
     create: async (params: Create{Module}Dto) => {
       // 业务逻辑
     },
   };
   
   export default {module}Service;
   ```

5. **创建路由** (`src/routes/{module}/index.ts`):
   ```typescript
   import { HttpResponse } from "@common/api";
   import { validator } from "@core/middleware/validator";
   import { Hono } from "hono";
   import { Create{Module}Dto } from "./{module}.dto";
   import {module}Service from "./{module}.service";
   
   const {module} = new Hono();
   
   {module}.post("/", validator("json", Create{Module}Dto), async (c) => {
     const params = c.req.valid("json");
     const data = await {module}Service.create(params);
     return c.json(HttpResponse({ message: "create success", data }));
   });
   
   export { {module} };
   ```

6. **注册路由** (`src/routes/index.ts`):
   ```typescript
   import { {module} } from "./{module}";
   
   routes.route("/{module}", {module});
   ```

### 环境变量

在 `src/types.d.ts` 中声明环境变量类型：

```typescript
declare module "bun" {
  interface Env {
    MONGO_DB_URL: string;
    JWT_SECRET: string;
    // 添加新的环境变量
  }
}
```

### 中间件使用

1. **请求验证**:
   ```typescript
   import { validator } from "@core/middleware/validator";
   import { CreateDto } from "./module.dto";
   
   route.post("/", validator("json", CreateDto), async (c) => {
     const params = c.req.valid("json");
     // 使用验证后的参数
   });
   ```

2. **JWT 认证**:
   ```typescript
   import { jwtMiddleware } from "@core/middleware/jwt";
   
   route.get("/me", jwtMiddleware, async (c) => {
     const payload = c.get("jwtPayload");
     // 使用 JWT payload
   });
   ```

## 最佳实践

### 1. 错误处理

- 使用 `HttpError` 抛出业务异常
- 在 Service 层进行业务验证
- 在 `app.ts` 中统一处理未捕获的异常

```typescript
// Service 层
if (!user) {
  throw HttpError({ code: 400, message: "user not found" });
}

// app.ts 统一处理
app.onError((error) => {
  if (error instanceof HTTPException) {
    return error.getResponse();
  }
  return new Response(JSON.stringify({
    success: false,
    message: error.message || "Internal Server Error",
  }), { status: 500 });
});
```

### 2. 数据转换

- 使用 Transformer 函数转换敏感数据
- 在 Service 层返回前进行数据转换

```typescript
// shared/user.transformer.ts
export const userTransformer = (user: UserModel) => {
  const { password, ...publicUser } = user.toObject();
  return publicUser;
};
```

### 3. ID 生成

- 使用 `mongoose.Types.ObjectId()` 生成 MongoDB ObjectId
- 使用 HashID 编码为短 ID 对外暴露

```typescript
const uid = new mongoose.Types.ObjectId();
const id = hashids.encodeHex(uid.toString());
```

### 4. 密码处理

- 使用 Bun 内置的密码加密功能
- 永远不要在响应中返回密码

```typescript
import { encodePassword, verifyPassword } from "@core/auth/password";

const passwordHash = await encodePassword(password);
const isMatch = await verifyPassword(password, user.password);
```

### 5. 类型安全

- 使用 Zod 进行运行时验证和类型推断
- 导出类型供其他模块使用

```typescript
export const CreateDto = z.object({
  name: z.string().min(3).max(20),
});

export type CreateDto = z.infer<typeof CreateDto>;
```

### 6. 代码组织

- 保持函数单一职责
- 私有方法使用 `_` 前缀
- 使用默认导出导出单例对象
- 使用命名导出导出类型和常量

### 7. 数据库操作

- 在 Mapper 层封装所有数据库操作
- 使用 Mongoose 的类型推断
- 避免在 Service 层直接使用 Mongoose 模型

### 8. 响应格式

- 统一使用 `HttpResponse` 格式化成功响应
- 统一错误响应格式: `{ success: false, data: null, message, errors }`

## 路径别名配置

在 `tsconfig.json` 中配置的路径别名：

- `@common/*` → `./src/common/*`
- `@core/*` → `./src/core/*`
- `@schemas/*` → `./src/schemas/*`

使用示例：
```typescript
import { HttpResponse } from "@common/api";
import { jwtMiddleware } from "@core/middleware/jwt";
import { UserModel } from "@schemas/user";
```

## 开发工作流

1. **启动开发服务器**:
   ```bash
   bun run dev
   ```

2. **代码格式化**:
   ```bash
   bunx @biomejs/biome format --write .
   ```

3. **代码检查**:
   ```bash
   bunx @biomejs/biome lint .
   ```

## 注意事项

1. **环境变量**: 确保在 `.env` 文件中配置所有必需的环境变量
2. **数据库连接**: 应用启动时自动连接 MongoDB，关闭时自动断开
3. **类型安全**: 充分利用 TypeScript 和 Zod 的类型推断
4. **错误处理**: 始终在 Service 层进行业务验证，使用统一的错误格式
5. **代码风格**: 遵循 Biome 配置的代码风格，保持一致性
