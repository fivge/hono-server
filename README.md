
# Mock Server

基于 Hono 和 Bun 的 Mock Server 项目。

## 📚 文档

- [架构文档](./ARCHITECTURE.md) - 项目架构、代码组织、开发指南

## init

> hono

```bash
bun create hono@latest
```

> biome

> mongoose

TODO

`@nestjs/mongoose`

```ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  nick_name: string;

  @Prop()
  head_img: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

> env

https://bun.com/docs/runtime/environment-variables

```
bun --print process.env
```

## Arch

### id

> a

```ts
import { randomUUIDv7 } from "bun";

const uid = randomUUIDv7();
```

> b

```ts
const uid = new mongoose.Types.ObjectId();
```

> c

```ts
	// const id = hashids.encode(uid);
		const id = hashids.encodeHex(uid.toString());
```

### hash



## TODO

> userid

https://github.com/niieani/hashids.js

> password

https://bun.com/docs/guides/util/hash-a-password

> validation 

zod

> DI?

awilix

> auth

- ? check password
- JWT generate token

https://hono.dev/docs/helpers/jwt

> ADR

Architecture Decision Record（架构决策记录）

```markdown
# ADR 001: 使用 PostgreSQL 作为主数据库

**状态**：Accepted  
**日期**：2025-11-14  
**作者**：xxx

## 背景
项目需要一个可靠的关系型数据库，支持复杂查询和事务一致性。

## 决策
选择 PostgreSQL 作为主数据库。

## 备选方案
- MySQL：社区成熟，但功能较少（例如 JSONB 支持不如 PostgreSQL）。
- MongoDB：更适合文档型数据，不符合当前数据结构需求。

## 理由
- ACID 支持完善；
- 丰富的数据类型；
- 对 JSON 支持好；
- 生态完善。

## 影响
- 需要在 CI/CD 流水线中配置 PostgreSQL；
- 新团队成员需熟悉 PostgreSQL 的管理与优化；
- ORM 使用 Prisma。

## 状态变更
如未来改用分布式数据库（例如 CockroachDB），此 ADR 将被新的决策记录替代。
```
