


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
