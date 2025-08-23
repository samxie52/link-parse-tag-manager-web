# 微信链接内容管理器 - React Web 端

基于 React 18 + TypeScript + Vite 的现代化 Web 应用，提供桌面端和移动端的智能链接内容管理体验。

## 🚀 项目概述

### 核心特性
- **响应式设计**: 支持桌面端和移动端，自适应布局
- **智能链接解析**: 支持小红书、高德地图、美团、微信公众号、抖音等平台
- **AI增强分析**: 基础解析vs AI解析的差异化展示策略
- **实时协作**: WebSocket实时同步，多用户协作
- **商业化订阅**: 免费版/基础版(¥19/月)/高级版(¥39/月)三层计费
- **多端统一**: 与微信小程序共享后端API，数据同步
- **现代化UI**: Ant Design + Tailwind CSS，美观易用

### 技术栈
- **框架**: React 18 + TypeScript 5+
- **构建工具**: Vite 4+ (快速构建、热更新)
- **路由**: React Router v6+ (声明式路由)
- **状态管理**: Zustand v4+ (轻量级状态管理)
- **UI组件**: Ant Design v5+ (企业级组件库)
- **样式**: Tailwind CSS + CSS Variables
- **HTTP客户端**: Axios + React Query (数据获取、缓存优化)
- **实时通信**: WebSocket + Socket.io
- **构建优化**: Tree shaking、代码分割、懒加载

## 📁 项目结构

```
froentend/web/
├── app/                         # Next.js App Router
│   ├── globals.css              # 全局样式
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
├── components/                  # 组件库
│   ├── ui/                      # 基础UI组件
│   ├── dashboard/               # 仪表板组件
│   ├── content/                 # 内容相关组件
│   ├── share/                   # 分享相关组件
│   ├── groups/                  # 组管理组件
│   ├── subscription/            # 订阅相关组件
│   └── layout/                  # 布局组件
├── hooks/                       # 自定义Hooks
│   ├── useAuth.ts               # 认证Hook
│   ├── useGroups.ts             # 组管理Hook
│   ├── useContents.ts           # 内容管理Hook
│   └── useWebSocket.ts          # WebSocket Hook
├── lib/                         # 工具库
│   ├── api.ts                   # API客户端
│   ├── auth.ts                  # 认证工具
│   ├── utils.ts                 # 通用工具
│   └── constants.ts             # 常量定义
├── stores/                      # Zustand状态管理
│   ├── authStore.ts             # 认证状态
│   ├── groupStore.ts            # 组状态
│   └── contentStore.ts          # 内容状态
├── types/                       # TypeScript类型定义
├── styles/                      # 样式文件
├── public/                      # 静态资源
├── .env.example                 # 环境变量模板
├── package.json                 # 项目依赖
├── tailwind.config.ts           # Tailwind配置
├── tsconfig.json                # TypeScript配置
└── README.md
```

## 🛠️ 快速开始

### 环境要求
- Node.js 18+
- npm/yarn/pnpm
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd froentend/web

# 安装依赖 (推荐使用pnpm)
pnpm install
```

### 环境配置

复制并编辑环境变量文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
# API配置
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_WS_URL=wss://your-api-domain.com/ws

# 认证配置
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret

# 微信配置 (Web端扫码登录)
NEXT_PUBLIC_WECHAT_APP_ID=your-wechat-web-app-id

# 分析配置
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 启动开发服务器

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

访问 `http://localhost:3000` 查看应用。

## 🌐 核心页面功能

### 🏠 仪表板页面（Dashboard）

**路由**: `/dashboard`

#### 📋 核心功能
- **响应式内容时间线**: 瀑布流布局，支持桌面端多列显示
- **实时内容更新**: WebSocket实时同步新内容
- **高级筛选**: 按平台、解析类型、时间范围、关键词筛选
- **虚拟滚动**: 大列表性能优化，支持数万条内容流畅滚动
- **批量操作**: 多选内容进行批量编辑、删除、导出
- **统计概览**: 内容数量、AI使用量、组活跃度统计

#### 🎨 差异化展示策略

**基础解析内容卡片**:
```css
.basic-content-card {
  background: #FAFAFA;
  border: 1px solid #E8E8E8;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.basic-content-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**AI增强内容卡片**:
```css
.ai-enhanced-card {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.ai-badge {
  background: rgba(255, 255, 255, 0.2);
  animation: pulse 2s infinite;
}
```

### 🔗 分享页面（Share）

**路由**: `/share`

#### 📋 核心功能
- **智能链接检测**: 自动识别剪贴板链接，支持拖拽上传
- **平台图标显示**: 根据链接自动显示对应平台图标
- **解析进度显示**: 实时显示解析进度和预计时间
- **结果实时预览**: 解析过程中实时更新预览内容
- **批量链接处理**: 支持同时解析多个链接
- **AI配额管理**: 实时显示剩余配额，智能推荐解析类型

### 👥 组管理页面（Groups）

**路由**: `/groups`

#### 📋 核心功能
- **组织架构视图**: 树形结构展示组织关系
- **高级成员管理**: 批量邀请、角色分配、权限控制
- **组分析仪表板**: 成员活跃度、内容贡献度、使用量统计
- **邀请链接管理**: 批量生成、有效期设置、使用统计
- **组设置中心**: 权限配置、通知设置、数据导出

### 👤 个人中心页面（Profile）

**路由**: `/profile`

#### 📋 核心功能
- **用户资料管理**: 头像上传、个人信息编辑、偏好设置
- **订阅管理中心**: 当前计划、使用量分析、账单历史
- **数据分析仪表板**: 个人贡献统计、使用趋势分析
- **通知中心**: 系统通知、组消息、订阅提醒
- **安全设置**: 密码修改、登录设备管理、隐私设置

### 🔐 登录页面（Login）

**路由**: `/login`

#### 📋 核心功能
- **多种登录方式**: 手机号+验证码登录、微信扫码登录、邮箱+密码登录
- **注册流程**: 手机号+验证码注册、邮箱+密码验证、微信扫码授权、用户协议
- **密码重置**: 忘记密码、邮箱重置、安全验证

### 💳 订阅页面（Subscription）

**路由**: `/subscription`

#### 📋 核心功能
- **计划对比表**: 功能对比、价格展示、推荐标识
- **使用量分析**: 当前使用情况、历史趋势、预测分析
- **支付管理**: 支付方式、账单历史、发票下载
- **升级流程**: 计划选择、支付确认、激活成功

## 🧩 核心组件库

### 内容卡片组件

```typescript
// components/content/content-card.tsx
interface ContentCardProps {
  content: Content
  type: 'basic' | 'ai-enhanced'
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function ContentCard({ content, type, ...handlers }: ContentCardProps) {
  const cardClass = type === 'basic' 
    ? 'basic-content-card' 
    : 'ai-enhanced-card'

  return (
    <div className={`content-card ${cardClass}`} onClick={handlers.onClick}>
      <div className="card-header">
        <Badge type={type} />
        <div className="card-actions">
          <Button icon={<EditIcon />} onClick={handlers.onEdit} />
          <Button icon={<DeleteIcon />} onClick={handlers.onDelete} />
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{content.title}</h3>
        <p className="card-description">{content.description}</p>
        
        {type === 'ai-enhanced' && content.ai_enhanced && (
          <div className="ai-insights">
            <div className="tags">
              {content.ai_enhanced.tags.map(tag => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
            </div>
            <div className="confidence-score">
              AI置信度: {content.ai_enhanced.confidence}%
            </div>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="metadata">
          <span>{content.platform}</span>
          <span>{content.created_at}</span>
        </div>
        
        {type === 'basic' && (
          <Button type="primary" onClick={showUpgradeModal}>
            🤖 升级AI解析
          </Button>
        )}
      </div>
    </div>
  )
}
```

### 升级提示组件

```typescript
// components/subscription/upgrade-prompt.tsx
interface UpgradePromptProps {
  visible: boolean
  onClose: () => void
  basicContent?: Content
  aiPreview?: Content
}

export function UpgradePrompt({ visible, onClose, basicContent, aiPreview }: UpgradePromptProps) {
  return (
    <Modal open={visible} onCancel={onClose} title="升级到AI增强解析" width={800}>
      <div className="upgrade-prompt">
        <div className="comparison-section">
          <div className="basic-preview">
            <h4>基础解析</h4>
            {basicContent && <ContentCard content={basicContent} type="basic" />}
          </div>
          
          <div className="vs-divider">VS</div>
          
          <div className="ai-preview">
            <h4>AI增强解析</h4>
            {aiPreview && <ContentCard content={aiPreview} type="ai-enhanced" />}
          </div>
        </div>
        
        <div className="benefits-section">
          <h4>升级后您将获得：</h4>
          <ul>
            <li>✨ AI智能标签提取</li>
            <li>🎯 内容情感分析</li>
            <li>📊 数据洞察报告</li>
            <li>🚀 更多平台支持</li>
          </ul>
        </div>
        
        <div className="action-section">
          <Button type="primary" size="large" onClick={handleUpgrade}>
            立即升级 - ¥19/月
          </Button>
          <Button onClick={onClose}>稍后提醒</Button>
        </div>
      </div>
    </Modal>
  )
}
```

## 🔧 状态管理

### Zustand Store 设计

```typescript
// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (credentials) => {
        const response = await api.login(credentials)
        set({
          user: response.user,
          token: response.token,
          isAuthenticated: true
        })
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },
      
      refreshToken: async () => {
        const token = get().token
        if (!token) return
        
        const response = await api.refreshToken(token)
        set({ token: response.token })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      })
    }
  )
)
```

## 🎨 样式系统

### Tailwind + CSS Variables

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* 主题色彩 */
  --primary: 220 100% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 220 14% 23%;
  
  /* AI增强样式 */
  --ai-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  --ai-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  /* 内容卡片 */
  --card-basic-bg: #fafafa;
  --card-basic-border: #e8e8e8;
  --card-ai-bg: var(--ai-gradient);
}

@layer components {
  .content-card {
    @apply rounded-lg p-4 transition-all duration-300 hover:shadow-lg;
  }
  
  .basic-content-card {
    background: var(--card-basic-bg);
    border: 1px solid var(--card-basic-border);
  }
  
  .ai-enhanced-card {
    background: var(--card-ai-bg);
    color: white;
    box-shadow: var(--ai-shadow);
  }
}
```

## 🚀 性能优化

### 代码分割与懒加载

```typescript
// 路由级别的代码分割
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('@/pages/dashboard'))
const Share = lazy(() => import('@/pages/share'))
const Groups = lazy(() => import('@/pages/groups'))

export function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        } />
      </Routes>
    </Router>
  )
}
```

### 虚拟滚动优化

```typescript
// hooks/useVirtualList.ts
import { useVirtualizer } from '@tanstack/react-virtual'

export function useVirtualList<T>(
  items: T[],
  estimateSize: number = 200,
  overscan: number = 5
) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  return {
    parentRef,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  }
}
```

## 🧪 测试策略

### 单元测试

```bash
# 运行测试
pnpm test

# 测试覆盖率
pnpm test:coverage

# 监听模式
pnpm test:watch
```

### E2E测试

```bash
# Playwright E2E测试
pnpm test:e2e

# 可视化测试
pnpm test:e2e:ui
```

## 📦 构建部署

### 生产构建

```bash
# 构建生产版本
pnpm build

# 分析构建包大小
pnpm analyze

# 预览生产版本
pnpm preview
```

### Docker部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 环境配置

```bash
# 开发环境
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1

# 生产环境
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1
```

## 📚 相关文档

- [系统架构设计](../../docs/architecture.md)
- [API 参考文档](../../docs/api-reference.md)
- [Web前端页面设计](../../docs/web-pages.md)
- [后端服务文档](../../backend/README.md)
- [微信小程序文档](../wechat/README.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交变更: `git commit -m 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../../LICENSE) 文件了解详情。

## 📞 支持

- **技术支持**: tech-support@example.com
- **问题反馈**: [GitHub Issues](https://github.com/your-org/link-manager/issues)

---

**微信链接内容管理器 Web 端** - 现代化的内容管理体验 🌐
