# Orbit Arbitration UI

仲裁系统 - 基于 Optimistic Oracle 的去中心化争议解决平台

## 📖 项目简介

本项目是平台的仲裁子系统，实现了完整的争议解决流程。用户可以在主站每个 event 下点击"发起仲裁"按钮跳转到本系统（主站的二级域名），完成结果仲裁的全流程操作。

### 核心功能

- ✅ **结果提案管理** - 查看和管理市场结算提案
- ⚖️ **争议仲裁** - 在挑战窗口期内发起争议并质押押金
- 🗳️ **委员投票** - 仲裁委员会对争议进行投票裁决
- 📊 **实时进度** - 完整的时间线和投票进度展示
- 🌍 **国际化支持** - 支持英文和繁体中文

### 业务流程

```
市场结束 → 提交初始结果 → 挑战期(3小时) → 争议/仲裁 → 最终结果
                              ↓
                          无挑战自动确认
                              ↓
                          有争议进入仲裁投票
                              ↓
                          委员会裁决(24-72小时)
```

### 关键参数

- **争议押金**: 500 USDT
- **挑战窗口**: 3 小时（可配置 `disputeWindowTime`）
- **仲裁时效**: 24小时内裁决（复杂案件最长72小时）
- **投票规则**:
  - 委员 < 3 人：需**全票通过**
  - 委员 ≥ 3 人：需 **2/3 赞成票**通过

### Bond 激励模型

| 情况 | Bond 归属 |
|------|-----------|
| 无挑战 | 返还给提案人 (proposer) |
| 挑战成功 | 奖励给争议方 (challenger) |
| 挑战失败 | 奖励给提案人 (proposer) |
| 市场作废 | 双方返还或扣除 |

## 🗺️ 页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | - | 重定向到 `/resolutions` |
| `/resolutions` | 决议列表 | 展示所有市场决议，支持状态筛选 |
| `/resolution/:id` | 决议详情 | 查看详情、时间线，发起争议入口 |
| `/challenge/new?resolutionId=xxx` | 发起争议 | 填写争议表单（含 disputeId），提交证据 |
| `/arbitration` | 仲裁管理面板 | 仲裁委员专用，查看待处理案件 |
| `/arbitration/:disputeId` | 仲裁投票详情 | 查看案件详情，进行投票 |

## 🎉 Features

- **React** - A JavaScript library for building user interfaces.
- **Vite** - A fast, opinionated frontend build tool.
- **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript.
- **Tailwind CSS** - A utility-first CSS framework (`v4`).
- **Tailwind Prettier Plugin** - A Prettier plugin for formatting Tailwind CSS classes.
- **ESLint** - A pluggable linting utility for JavaScript and TypeScript.
- **shadcn/ui** - Beautifully designed components that you can copy and paste into your apps.
- **react-i18next** - Internationalization framework for React (支持英文和繁体中文).

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
   cd orbit-arbitration-ui
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

The project structure follows a standard React application layout:

```
orbit-arbitration-ui/
  ├── node_modules/      # Project dependencies
  ├── public/            # Public assets
  ├── src/               # Application source code
  │   ├── components/    # React components
  │   │   ├── ui/        # shadcn/ui components
  │   │   ├── arbitration/    # Arbitration related components
  │   │   ├── challenge/      # Challenge related components
  │   │   ├── resolution/     # Resolution related components
  │   │   ├── shared/         # Shared components
  │   │   └── layout/         # Layout components
  │   ├── pages/         # Page components
  │   ├── i18n/          # Internationalization
  │   │   ├── index.ts        # i18n configuration
  │   │   └── locales/        # Translation files
  │   │       ├── en.json     # English translations
  │   │       └── zh-TW.json  # Traditional Chinese translations
  │   ├── styles/        # CSS stylesheets
  │   ├── lib/           # Utility functions
  │   ├── data/          # Mock data
  │   ├── types/         # TypeScript type definitions
  │   ├── router.tsx     # React Router configuration
  │   └── main.tsx       # Application entry point
  ├── eslint.config.js   # ESLint configuration
  ├── index.html         # HTML entry point
  ├── tsconfig.json      # TypeScript configuration
  └── vite.config.ts     # Vite configuration
```

## 🎨 主要功能模块

### 1. Resolutions (决议列表) `/resolutions`
- 查看所有市场结算提案
- 支持按状态筛选（待挑战、仲裁中、已决议、已作废）
- 显示提案详情和挑战倒计时
- 响应式卡片网格布局

### 2. Resolution Detail (决议详情) `/resolution/:id`
- 查看市场信息和结算规则
- 查看提案状态和完整时间线
- 在挑战期内发起争议（质押 500 USDT）
- 查看争议信息和仲裁投票进度

### 3. Challenge (发起争议) `/challenge/new`
- 输入唯一的 Dispute ID（合约调用必需）
- 选择争议类型（结果仲裁/规则仲裁）
- 填写争议理由和主张结果
- 提交证据材料（链接、文件、Tx Hash）
- 押金说明（含全部 4 种归属场景）和确认弹窗

### 4. Arbitration Dashboard (仲裁管理面板) `/arbitration`
- 仲裁委员身份标识
- 查看待仲裁案件列表（含提案人和争议方信息）
- 查看已完成案件
- 查看个人投票记录
- 统计卡片（待处理/已完成/我的投票）

### 5. Arbitration Detail (仲裁投票详情) `/arbitration/:disputeId`
- 原始提案 vs 争议方主张对比
- 查看争议理由和证据材料
- **投票规则说明**（根据委员数量动态显示：< 3 人全票通过，≥ 3 人 2/3 多数）
- 投票进度条和委员投票状态
- 投票面板（支持/反对，不可撤销）

## 🔧 技术栈

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (OKLCH 色彩系统)
- **UI Components**: shadcn/ui (45+ 组件)
- **Routing**: React Router v7
- **Internationalization**: react-i18next + i18next
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier

## 📦 组件结构

```
src/components/
├── ui/                    # shadcn/ui 基础组件
├── layout/
│   └── page-layout.tsx    # 页面通用布局
├── resolution/
│   ├── resolution-card.tsx     # 决议卡片
│   ├── resolution-status.tsx   # 状态徽章
│   ├── resolution-timeline.tsx # 流程时间线
│   └── countdown-timer.tsx     # 倒计时组件
├── arbitration/
│   ├── dispute-card.tsx        # 争议案件卡片
│   ├── vote-progress.tsx       # 投票进度条
│   ├── vote-panel.tsx          # 投票操作面板
│   └── arbitrator-list.tsx     # 委员投票状态列表
├── challenge/
│   └── bond-warning.tsx        # 押金警告组件
└── shared/
    ├── address-display.tsx     # 地址显示（缩略）
    ├── confirm-dialog.tsx      # 确认弹窗
    └── empty-state.tsx         # 空状态占位
```

## 🗃️ 数据结构

### Resolution (决议)

```typescript
interface Resolution {
  id: string;              // 内部 ID
  resolutionId: string;    // 链上决议 ID
  marketId: string;        // 市场 ID
  market: Market;          // 市场信息
  proposedOutcome: 'YES' | 'NO';
  proposer: string;        // 提案人地址
  proposeTime: number;     // 提案时间戳
  endTime: number;         // 决议结束时间
  disputeWindowTime: number; // 挑战窗口时长
  challengeDeadline: number; // 挑战截止时间戳
  status: ResolutionStatus;
  bondAmount: number;
  dispute?: Dispute;
  arbitration?: Arbitration;
}
```

### 模拟数据

项目包含 6 条模拟决议数据，覆盖所有状态场景：

| ID | Resolution ID | 状态 | 场景说明 |
|----|---------------|------|----------|
| res-001 | 1001 | Proposed | 待挑战，还有 2.5 小时 |
| res-002 | 1002 | Proposed | 待挑战，即将到期（30分钟内） |
| res-003 | 1003 | Challenged | 仲裁进行中，1支持/1反对/1待投 |
| res-004 | 1004 | Resolved | 无争议自动确认 |
| res-005 | 1005 | Resolved | 争议后全票改判 |
| res-006 | 1006 | Invalid | 市场作废 |

修改 `src/data/mock-data.ts` 可自定义测试数据。

## 🔗 合约接口

前端页面对应的合约调用接口：

```typescript
// 提交争议 (Challenge 页面)
challenge(
  disputeId: string,      // 用户输入的唯一 ID
  resolutionId: string,   // 从 Resolution 获取
  marketId: string,       // 从 Resolution 获取
  disputeType: number,    // 0: Outcome, 1: Rule
  challengedOutcome: string,
  reason: string          // 争议描述 URL
): Promise<TransactionResponse>

// 仲裁投票 (Arbitration Detail 页面)
vote(disputeId: string, support: boolean): Promise<TransactionResponse>

// 查询最终结果
getFinalOutcome(marketId: string): Promise<{
  outcome: string,
  resolved: boolean,
  invalid: boolean
}>
```

## 🔮 后续开发

本项目为纯静态页面，业务逻辑由后续开发者实现，主要包括：

1. **钱包集成** - 连接 Web3 钱包，获取用户地址
2. **合约交互** - 调用仲裁合约的读写方法
3. **状态管理** - 实现全局状态（用户、交易等）
4. **真实数据** - 替换模拟数据为链上数据查询
5. **交易签名** - 押金质押、投票等交易操作

## 📝 License

This project is licensed under the MIT License.
