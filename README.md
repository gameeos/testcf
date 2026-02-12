# Orbit Arbitration UI

仲裁系统 - 基于 Optimistic Oracle 的去中心化争议解决平台

## 📖 项目简介

本项目是平台的仲裁子系统，实现争议解决流程。用户可以在主站每个 event 下点击「发起仲裁」跳转到本系统（主站的二级域名），完成仲裁相关操作。

### 核心功能

- ✅ **结果提案管理** - 查看和管理市场结算提案
- ⚖️ **争议仲裁** - 在挑战窗口期内发起争议并质押押金
- 🗳️ **委员投票** - 仲裁委员会对争议进行投票裁决
- 📊 **实时进度** - 时间线与投票进度展示
- 🌍 **国际化支持** - 支持英文和繁体中文

### 业务流程

```
市场结束 → 提交初始结果 → 挑战期 → 争议/仲裁 → 最终结果
                              ↓
                          无挑战自动确认
                              ↓
                          有争议进入仲裁投票
                              ↓
                          委员会裁决(24-72小时)
```

### 关键参数（动态读取）

说明：前端展示的参数来自链上合约与服务端/RPC 数据（例如 `disputeWindowTime`、bond/token 等），不是写死常量。

- **争议押金（Bond）**：从合约读取（例如 `challengeBond`）
- **挑战窗口**：由 `proposeTime + disputeWindowTime` 计算
- **投票规则**:
  - 委员 < 3 人：需 **全票通过**
  - 委员 ≥ 3 人：需 **2/3 赞成票**通过

### Bond 激励模型

| 情况 | Bond 归属 |
|------|-----------|
| 无挑战 | 返还给提案人 (proposer) |
| 挑战成功 | 奖励给争议方 (challenger) |
| 挑战失败 | 奖励给提案人 (proposer) |
| 市场作废 | 依据合约逻辑处理（可能返还/扣除） |

## 🗺️ 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | - | 重定向到 `/resolutions` |
| `/resolutions` | 决议列表 | 展示所有市场决议，支持状态筛选与搜索（`?search=...`） |
| `/resolution/:hashId` | 决议详情 | 查看详情、时间线，发起争议入口 |
| `/challenge/new?resolutionId=:hashId` | 发起争议 | 创建争议并提交到链上（`resolutionId` 传的是 hashId） |
| `/arbitration` | 仲裁管理面板 | 仲裁委员专用，查看待处理/已完成案件 |
| `/arbitration/:hashId` | 仲裁投票详情 | 查看案件详情并投票 |

## 🎉 Features

- **React** - A JavaScript library for building user interfaces.
- **Vite** - A fast, opinionated frontend build tool.
- **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** - A utility-first CSS framework (`v4`).
- **ESLint** - A pluggable linting utility for JavaScript and TypeScript.
- **shadcn/ui** - Beautifully designed components that you can copy and paste into your apps.
- **react-i18next** - Internationalization framework for React.
- **TanStack Query** - Server state fetching/caching (`@tanstack/react-query`).
- **wagmi + viem** - Web3 wallet/contract interactions.
- **Web3Modal** - Wallet connection UI (`@web3modal/wagmi`).
- **JSON-RPC** - RPC client based on `jayson`.

## 🌍 国际化支持

本项目支持多语言国际化：

- **默认语言**: English (en)
- **支持语言**:
  - English (en)
  - 繁體中文 (zh-TW)

语言选择器位于 Header 右上角，用户选择的语言偏好会自动保存到浏览器 localStorage。

### i18n 配置文件

- `src/i18n/index.ts` - i18n 初始化配置
- `src/i18n/locales/en.json` - 英文翻译
- `src/i18n/locales/zh-TW.json` - 繁体中文翻译

### 添加新的翻译

1. 在 `src/i18n/locales/en.json` 和 `src/i18n/locales/zh-TW.json` 中添加对应的翻译键值对
2. 在组件中使用 `useTranslation` hook：

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return <div>{t('myKey')}</div>;
}
```

## ⚙️ Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (version 22 or above)
- pnpm (package manager)

## 🚀 Getting Started

1. Navigate to the project directory:

   ```bash
   cd ooa-ui
   ```

2. Install the dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

## 📜 Available Scripts

- `pnpm dev` - Starts the development server.
- `pnpm build` - Builds the production-ready code.
- `pnpm lint` - Runs ESLint to analyze and lint the code.
- `pnpm preview` - Starts the Vite development server in preview mode.

## 📂 Project Structure

```
ooa-ui/
  ├── public/                # Public assets
  ├── src/
  │   ├── components/        # React components
  │   │   ├── ui/            # shadcn/ui components
  │   │   ├── arbitration/   # Arbitration related components
  │   │   ├── challenge/     # Challenge related components
  │   │   ├── resolution/    # Resolution related components
  │   │   ├── shared/        # Shared components
  │   │   └── layout/        # Layout components
  │   ├── pages/             # Page components
  │   ├── router/            # React Router configuration (`index.tsx`)
  │   ├── i18n/              # Internationalization
  │   ├── lib/               # Web3/RPC & utilities
  │   ├── data/              # Data hooks (React Query) & helpers
  │   ├── types/             # TypeScript type definitions
  │   └── main.tsx           # Application entry point
  ├── eslint.config.js
  ├── index.html
  ├── tsconfig.json
  └── vite.config.ts
```

## 🎨 主要功能模块

### 1. Resolutions (决议列表) `/resolutions`

- 查看所有市场结算提案
- 支持按状态筛选与关键字搜索
- 展示提案详情和挑战倒计时

### 2. Resolution Detail (决议详情) `/resolution/:hashId`

- 查看市场信息和结算规则
- 查看提案状态和完整时间线
- 在挑战期内发起争议（Bond/窗口均为动态读取与计算）

### 3. Challenge (发起争议) `/challenge/new`

说明：当前实现以链上交互为主，部分表单能力为预留/未开放。

- Dispute ID 由 RPC 生成并展示（非手动输入）
- 提交争议到链上（Outcome/Rule 等扩展字段当前未完全开放）

### 4. Arbitration Dashboard (仲裁管理面板) `/arbitration`

- 查看待仲裁案件列表（Pending）与已完成案件（Resolved）
- 统计卡片（待处理/已完成/我的投票）

### 5. Arbitration Detail (仲裁投票详情) `/arbitration/:hashId`

- 查看案件详情与双方信息
- 动态展示投票规则（< 3 全票通过，≥ 3 需 2/3）
- 投票面板（支持/反对，不可撤销）

## 🗃️ 数据结构（以代码为准）

类型定义集中在：`src/types/index.ts`。

### Resolution (决议)

```ts
interface Resolution {
  id: string;
  hashId: string;

  marketId: string;
  marketHashId: string;

  resolutionId: string;
  proposedOutcome: string;

  proposer: string;
  proposeTime: number;
  endTime: number;
  disputeWindowTime: number;
  status: ResolutionStatus;

  bondAmount: number;
  dispute: Dispute | null;
}
```

## 🔗 链上/服务端交互（当前实现）

- **RPC**：用于拉取列表/详情与创建 disputeId 等（见 `src/lib/rpc-client.tsx`、`src/data/*`）
- **合约写操作**：通过 `wagmi/viem` 调用（见 `src/lib/use-ooa.ts`）

常用写操作（示意）：

```ts
// 提交争议 (Challenge 页面)
challenge(disputeId: bigint, resolutionId: bigint, marketId: bigint, disputeType: 0 | 1, challengedOutcome: `0x${string}`,reason: string) => Promise<`0x${string}`>

// 仲裁投票 (Arbitration Detail 页面)
vote(disputeId: string, support: boolean): Promise<unknown>
```

## 📝 License

This project is licensed under the MIT License.
