# express-fm

Express 5 视频平台后端，支持用户认证、视频管理、评论、点赞、收藏、关注及热门排行。

## 技术栈

- **运行时**: Node.js ≥ 21.2
- **框架**: Express 5.2
- **数据库**: MongoDB (Mongoose 9.x)
- **缓存**: Redis (ioredis 6.x) — 热门视频排行
- **认证**: JWT (jsonwebtoken + bcryptjs)
- **视频上传**: 阿里云视频点播 VOD
- **文件上传**: Multer 2.x（头像本地存储）
- **校验**: express-validator 7.x
- **包管理**: pnpm

## 快速开始

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际配置

# 确保 MongoDB 和 Redis 已启动

# 开发模式（热重载）
pnpm dev

# 生产模式
pnpm prod
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NODE_ENV` | 运行环境 | `development` |
| `PORT` | 服务端口 | `3000` |
| `DB_URL` | MongoDB 连接地址 | `mongodb://localhost:27017/express-video` |
| `JWT_SECRET` | JWT 签名密钥 | — |
| `JWT_EXPIRES_IN` | Token 过期时间 | `7d` |
| `VOD_ACCESS_KEY_ID` | 阿里云 VOD AccessKey | — |
| `VOD_ACCESS_KEY_SECRET` | 阿里云 VOD Secret | — |

## 项目结构

```
├── app.js                  # 入口：中间件注册、MongoDB 连接、服务启动
├── controllers/
│   ├── userController.js   # 用户：注册、登录、更新、关注、上传头像
│   ├── videoController.js  # 视频：创建、列表、详情、评论、点赞、收藏
│   └── vodControll.js      # 阿里云 VOD 上传凭证
├── middleware/
│   └── validator/
│       ├── errorBack.js    # express-validator 错误格式化
│       ├── userValidator.js# 用户参数校验规则
│       └── videoValidator.js
├── model/
│   ├── index.js            # Mongoose Model 统一导出
│   ├── userModel.js        # 用户 Schema（密码加密、软删除）
│   ├── videoModel.js       # 视频 Schema
│   ├── videoCommentModel.js
│   ├── videoLikeModel.js
│   ├── subscribeModel.js   # 关注
│   ├── collectModel.js     # 收藏
│   └── redis/
│       ├── index.js        # Redis 连接
│       └── redishotsnc.js  # 热度递增 & 热门排行
├── router/
│   ├── index.js            # 路由汇总 /api/v1
│   ├── user.js             # /api/v1/user/*
│   └── video.js            # /api/v1/video/*
├── utils/
│   ├── index.js            # 常量（PICK_FIELD、HOT_NUM、USER_UPDATE_FIELDS）
│   ├── jwt.js              # Token 生成 & requireAuth 中间件
│   ├── request.js          # res.success/fail、全局错误处理、404
│   └── vod.js              # 阿里云 VOD 客户端
├── public/                 # 前端静态文件
└── uploads/                # 本地文件存储（头像、视频）
```

## API 文档

所有接口前缀：`/api/v1`

### 用户模块 `/user`

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/register` | 否 | 注册 |
| POST | `/login` | 否 | 登录，返回 token |
| PUT | `/update` | 是 | 更新个人信息 |
| PUT | `/changePassword` | 是 | 修改密码 |
| GET | `/list` | 是 | 用户列表 |
| POST | `/upload` | 是 | 上传头像（multipart: avatar） |
| POST | `/subscribe` | 是 | 关注用户 |
| POST | `/unsubscribe` | 是 | 取消关注 |
| GET | `/getUser?userId=` | 可选 | 查看用户信息 |
| GET | `/getSubscribe?userId=` | 否 | 某人的关注列表 |
| GET | `/getChannel` | 是 | 我的粉丝列表 |

### 视频模块 `/video`

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/getvod` | 是 | 获取阿里云 VOD 上传凭证 |
| POST | `/createVideo` | 是 | 创建视频记录 |
| GET | `/videoList?pageNum=&pageSize=` | 可选 | 视频列表（分页） |
| GET | `/videoDetail?videoId=` | 可选 | 视频详情 |
| POST | `/comment` | 是 | 提交评论 |
| GET | `/commentList?videoId=&pageNum=&pageSize=` | 是 | 评论列表 |
| POST | `/delComment` | 是 | 删除评论 |
| POST | `/like` | 是 | 点赞/取消点赞 |
| GET | `/likeVideoList` | 是 | 我的点赞列表 |
| POST | `/collect` | 是 | 收藏视频 |
| GET | `/getHots?hotNum=` | 否 | 热门视频排行 |

## 认证说明

- `requireAuth()` — 必须登录，否则返回 401
- `requireAuth(false)` — 可选登录：带有效 token 时注入 `req.user`，否则匿名访问
- 请求头：`Authorization: Bearer <token>`

## 热度机制

视频通过 Redis Sorted Set (`videohots`) 维护热度排名：

| 行为 | 热度值 |
|------|--------|
| 观看 | +1 |
| 点赞 | +2 |
| 评论 | +2 |
| 收藏 | +3 |

取消点赞会递减对应热度值。热门排行通过 `GET /api/v1/video/getHots?hotNum=10` 获取。

## 数据模型

- **User** — 用户名、邮箱、密码（bcrypt 加密）、手机号、头像、订阅数、软删除
- **Video** — 标题、描述、VOD 视频 ID、封面、评论数、点赞/踩数
- **VideoComment** — 内容、关联视频、关联用户
- **VideoLike** — 关联用户+视频，like: 1（赞）/ -1（踩），联合唯一索引
- **Subscribe** — 关注者+被关注者，联合唯一索引
- **Collect** — 用户+视频，联合唯一索引

## 全局错误处理

已统一处理的错误类型（`utils/request.js`）：

- Multer 文件大小超限 → 413
- Multer 文件类型错误 → 400
- MongoDB 唯一索引冲突 (11000) → 409
- Mongoose 校验错误 (ValidationError) → 400
- 无效 ID 格式 (CastError) → 400
- 生产环境兜底不泄露 `err.message`

## License

ISC
