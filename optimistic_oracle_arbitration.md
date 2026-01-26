# 去中心化预测市场 —— 乐观预言机决议 / 仲裁系统设计（简化 UMA 模型）

本文档描述预测市场中「决议 / 仲裁系统」的完整设计方案。
系统参考 Optimistic Oracle 思想，
但在工程与治理上进行了简化与裁剪，适用于自有预测市场协议。

---

## 1. 设计目标与原则

### 1.1 设计目标
- 默认无需仲裁（Optimistic）
- 只有出现争议才引入人工裁决成本
- 通过经济质押（Bond）约束恶意行为
- 仲裁结果可被交易系统无条件信任
- 仲裁过程可解释、可索引、可审计

### 1.2 核心原则（继承 UMA）
- 乐观假设：结果提交默认正确
- 挑战驱动：任何人可通过质押发起争议
- 经济惩罚：错误方承担成本
- 最终确定性：一旦决议不可回滚

---

## 2. 仲裁类型定义

### 2.1 结果仲裁（Outcome Dispute）
- 对象：市场最终结果（YES / NO / Option）
- 时间：市场到期后
- 是否影响结算：是
- 是否需要质押：500 U

### 2.2 规则仲裁（Rule Dispute）
- 对象：市场规则是否合理 / 可判定
- 时间：结果发生前
- 是否影响结算：不直接影响
- 可能结果：市场作废 / 强制关闭
- 是否需要质押：500 U

---

## 3. 仲裁流程（Optimistic Resolution）

### 3.1 流程

市场到期  
→ 提交初始结果  
→ 挑战期（默认 3 小时）  
→ 无挑战：自动确认结果  
→ 有挑战：进入仲裁委员会投票  
→ 最终结果确认  
→ 交易系统结算

---

## 4. 参数定义

| 参数 | 默认值 | 说明 |
|----|----|----|
| 结果提交 Bond | 500 U | 提交初始结果 |
| 争议 Bond | 500 U | 提交争议 |
| 挑战窗口 | 3 小时 | 管理员可调 |
| 仲裁委员阈值 | 3 | 决定投票规则 |

- MVP版本时提交结果由平台完成，不需要Bond，争议成功决议时资金由平台提供；如果开放给用户提交，则需要Bond。
- MVP版本时决议与争议的具体描述由中心化存储，由disputeId与resolutionId关联到合约；后期可扩展到由IPFS存储。

---

## 5. 仲裁委员会与投票规则

### 5.1 委员会管理
- 仲裁委员由合约管理员设置
- 仅仲裁委员可参与投票

### 5.2 投票规则

**委员数量 < 3**
- 必须全票通过
- 否则维持原结果

**委员数量 ≥ 3**
- 需 ≥ 2/3 赞成票
- 否则维持原结果

---

## 6. 合约设计

### 6.1 枚举

```solidity
enum ResolutionStatus { Unresolved, Proposed, Challenged, Resolved, Invalid }
enum DisputeType { Outcome, Rule }
```

### 6.2 结构体
 - **marketId、disputeId、resolutionId由市场管理系统统一生成维护**

```solidity
struct Resolution {
    uint256 resolutionId;
    uint256 marketId;
    bytes32 proposedOutcome;
    address proposer;
    uint256 proposeTime;
    uint256 endTime;
    uint256 disputeWindowTime
    uint256 bondAmount;
    ResolutionStatus status;
}

struct Dispute {
    uint256 disputeId;
    uint256 resolutionId;
    uint256 marketId;
    DisputeType disputeType;
    bytes32 challengedOutcome;
    address challenger;
    uint256 bondAmount;
    uint256 disputeTime;
    bool resolved;
    string reason;  // 争议描述的URL,可以是中心化https或者IPFS的CID
}

struct Vote {
    bool support;
    bool voted;
}

struct Arbitration {
    uint256 disputeId;
    uint256 resolutionId;

    uint256 yesVotes;
    uint256 noVotes;

    uint256 startTime;
    bool finalized;

    bytes32 finalOutcome;   // 仅 outcome dispute 使用
    bool invalidate;        // 是否作废市场
}

```

### 6.3 主要存储

```solidity
mapping(address=>bool) public arbitrators;

mapping(address=>bool) public proposers;

// marketId => Resolution
mapping(uint256=>Resolution) public resolutions;

// marketId => Dispute
mapping(uint256=>Dispute) public disputes;

// marketId => Arbitration
mapping(uint256 => Arbitration) public arbitrations;

// disputeId => arbitrator => Vote
mapping(uint256 => mapping(address => Vote)) public arbitrationVotes;

```

### 6.4 核心事件

```solidity
// 预创建决议
event ResolutionCreated(
    uint256 indexed resolutionId,
    uint256 indexed marketId,  
    address proposer,
    uint256 bondAmount,
    uint256 createTime,
    uint256 endTime;
    uint256 disputeWindowTime,
);

// 结果提案事件
event OutcomeProposed(
    uint256 indexed resolutionId,
    uint256 indexed marketId,
    bytes32 proposedOutcome,
    address proposer,
    uint256 proposeTime
);

// 争议创建事件
event DisputeCreated(
    uint256 indexed disputeId,
    uint256 indexed resolutionId,
    uint256 indexed marketId,
    DisputeType disputeType,
    bytes32 challengedOutcome,
    address challenger,
    uint256 bondAmount,
    uint256 disputeTime,
    string reason
);

// 投票事件
event VoteCast(
    uint256 indexed resolutionId,
    uint256 indexed disputeId,
    address indexed arbitrator,
    bool support,
    uint256 timestamp
);

// 仲裁完成事件
event ArbitrationFinalized(
    uint256 indexed resolutionId,
    uint256 indexed disputeId,
    uint256 indexed marketId,
    bytes32 finalOutcome,
    bool invalidate,
    uint256 yesVotes,
    uint256 noVotes,
    uint256 finalizeTime
);

// 自动确认事件（无挑战过期）
event AutoConfirmed(
    uint256 indexed resolutionId,
    uint256 indexed marketId,
    uint256 confirmTime
);

// Bond 分发事件
event BondDistributed(
    uint256 indexed resolutionId,
    address indexed recipient,
    uint256 indexed marketId,
    uint256 amount,
    string reason  // "no_challenge", "challenge_failed", "challenge_success", "market_invalid"
);

// 仲裁委员变更事件
event ArbitratorAdded(address indexed arbitrator, uint256 timestamp);
event ArbitratorRemoved(address indexed arbitrator, uint256 timestamp);

// 参数更新事件
event ParameterUpdated(
    string parameterName,
    uint256 oldValue,
    uint256 newValue,
    uint256 timestamp
);
```

### 6.5 权限修饰符

```solidity
// 仅管理员可调用
modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin");
    _;
}

// 仅仲裁委员可调用
modifier onlyArbitrator() {
    require(arbitrators[msg.sender], "Only arbitrator");
    _;
}

```

### 6.6 错误码定义

```solidity
error OnlyAdmin();
error OnlyArbitrator();
error InvalidProposer();
error InvalidStatus();
error InvalidStatusTransition();
error NotWithinChallengeWindow();
error AlreadyVoted();
error MarketAlreadyExists();
error MarketNotOver();
error MarketNotExists();
error MarketAlreadyResolved();
error MarketAlreadyChallenged();
error InvalidArbitratorAddress();
error InsufficientBond();
error BondTransferFailed();
error VoteAlreadyFinalized();
error InvalidResolutionId();
```

---

## 7. 核心函数

### 预创建决议

```solidity
createResolution(marketId, resolutionId, disputeWindowTime,endTime)
```

### 提交结果

```solidity
proposeOutcome(marketId, outcome)
```

### 执行决议
- 链外驱动执行决议
```solidity
finalizeResolution(marketId)
```

### 提交争议
- 此方法需要Value参数，用于支付Bond
```solidity
challenge(disputeId, resolutionId, marketId, disputeType, challengedOutcome, reason)
```

### 仲裁投票(自动执行裁决)

```solidity
vote(disputeId, support)
```

### 获取最终结果
- 交易合约与链外统一接口
```solidity
getFinalOutcome(marketId)
returns (outcome, resolved, invalid)
```

---

## 8. Bond 激励模型

| 情况 | Bond 归属 |
|----|----|
| 无挑战 | proposer |
| 挑战失败 | proposer |
| 挑战成功 | challenger |
| 市场作废 | 双方返还或扣费 |

 1. 仲裁押金由仲裁合约管理
 2. 合约需要提供仲裁备用金(如果是平台创建的事件被仲裁结果是用户胜时，合约需要向用户支付奖励)

---

## 9. 索引数据设计

### Resolution

```graphql
type Resolution @entity(immutable: true) {
  id: ID!  # uint256 resolution hex string
  marketId: BigInt! # uint256
  status: Int!
  proposer: Bytes! # address
  proposeTime: BigInt! # uint256 
  proposedOutcome: Bytes! # bytes32
  bondAmount: BigInt! # uint256
  createTime: BigInt! # uint256
  disputeWindowTime: BigInt! # uint256
  endTime: BigInt!
  updateTime: BigInt!
}
```

### Arbitration

```graphql
type Arbitration @entity(immutable: true) {
  id: ID!  # uint256 dispute hex string
  resolutionId: BigInt! # uint256
  marketId: BigInt! # uint256
  disputeType: Int! # uint8
  challengedOutcome: Bytes! # bytes32
  challenger: Bytes! # address
  bondAmount: BigInt! # uint256
  disputeTime: BigInt! # uint256
  reason: String! # string
  yesVotes: BigInt! # uint256
  noVotes: BigInt! # uint256
  resolved: Boolean!
  updateTime: BigInt!
  invalidate: Boolean! # bool
  finalizeTime: BigInt!
  finalOutcome: Bytes! # bytes32
}
```

### ArbitrationVote

```graphql
type Vote @entity(immutable: true) {
  id: Bytes!
  resolutionId: BigInt! # uint256
  marketId: BigInt! # uint256
  disputeId: BigInt! # uint256
  arbitrator: Bytes! # address
  support: Boolean! # bool
  timestamp: BigInt! # uint256
}
```
- [查询页面](https://api.studio.thegraph.com/query/1723380/subgraph/v0.0.2)
---

## 10. 前端页面设计

### 10.1 结果提交页面（Propose Outcome）

**访问权限**：仅管理员/平台

**页面功能**：
- **这个页面在MVP版本时可以没有，主要作用为当服务自动喂数据失败时手动的一个入口**
- 展示已到期但未决议的市场列表
- 表单字段：
  - Resolution ID（自动生成/选择）
  - 提交结果（YES/NO/Option 选择器）
  - 结果描述（可选，存储到中心化/IPFS）
- 提交按钮：调用 `proposeOutcome(marketId, resolutionId, outcome, disputeWindowTime)`
- 显示当前 Challenge Window 时间
- 提交成功后显示 Resolution 状态追踪

**UI 组件**：
- 市场列表卡片
- 结果选择器（单选/多选）
- 提交确认弹窗
- Resolution 状态展示（待提案/已提案/已挑战/已决议）

---

### 10.2 争议提交页面（Challenge）

**访问权限**：所有用户

**页面功能**：
- 展示处于 Challenge Window 的 Resolution 列表
- 选择 Resolution 发起争议
- 表单字段：
  - Market ID  URL 参数,自动填充或者手工填充
  - Resolution ID
  - Dispute Type 选择（Outcome / Rule）
  - Reason（必填，争议描述）
  - Reason 存储方式选择（MVP: 中心化存储(不选择), 后期: IPFS）
- Bond 金额提示（500 U）
- 提交按钮：调用 `challenge(disputeId, resolutionId, marketId, disputeType, challengedOutcome, reason)`
- 显示 Challenge 倒计时

**UI 组件**：
- Resolution 列表（含状态、提案人、提案时间）
- Dispute Type 选择器
- Reason 文本编辑器
- Bond 支付确认弹窗
- 争议提交成功提示

---

### 10.3 仲裁管理页面（Arbitration Dashboard）

**访问权限**：仅仲裁委员

**页面功能**：

**待仲裁列表**：
- 展示所有 Challenged 状态的 Resolution
- 显示基本信息：
  - Resolution ID
  - Proposed Outcome
  - Dispute Type & Reason
  - Disputer & Challenger
  - 开始时间 & 倒计时
- 快速进入投票入口

**投票详情页**：
- 显示 Resolution 和 Dispute 完整信息
- 显示当前投票进度（Yes Votes / No Votes）
- 显示已投票委员列表及投票结果
- 投票按钮：
  - 支持（Support）- 调用 `vote(disputeId, true)`
  - 反对（Oppose）- 调用 `vote(disputeId, false)`
- 显示投票规则提示（委员数 <3 需全票, ≥3 需 2/3 赞成）

**历史记录**：
- 已完成的仲裁记录
- 投票结果统计
- 最终 Outcome

**UI 组件**：
- 仲裁任务卡片列表
- 投票进度条
- 委员投票状态展示（头像/地址 + 投票结果）
- 投票确认弹窗
- 历史记录表格/时间线

---

### 10.4 市场详情页（Market Detail）

**访问权限**：所有用户

**页面功能**：
- **这个页面可以不单独设计，跳转到主站即可**
- 显示市场基本信息
- 显示 Resolution 状态：
  - Unresolved：未决议
  - Proposed：已提案，显示 Challenge 倒计时
  - Challenged：已争议，显示仲裁进度
  - Resolved：已决议，显示最终 Outcome
  - Invalid：已作废
- 显示 Resolution/Dispute 详情（如适用）
- 提供争议入口（当处于 Challenge Window 时）

**UI 组件**：
- Resolution 状态徽章
- 时间线展示（提案 -> 争议 -> 仲裁 -> 决议）
- 争议按钮（带倒计时）
- 仲裁投票进度展示（公开可见）

---

### 10.5 数据展示与索引

**前端所需数据结构**：

```typescript
interface Resolution {
  resolutionId: string;
  marketId: string;
  proposedOutcome: string;
  proposer: string;
  proposeTime: number;
  status: 'Unresolved' | 'Proposed' | 'Challenged' | 'Resolved' | 'Invalid';
  dispute?: Dispute;
  arbitration?: Arbitration;
}

interface Dispute {
  disputeId: string;
  resolutionId: string;
  disputeType: 'Outcome' | 'Rule';
  challenger: string;
  bondAmount: string;
  disputeTime: number;
  resolved: boolean;
  reason: string;  // URL
}

interface Arbitration {
  disputeId: string;
  resolutionId: string;
  yesVotes: number;
  noVotes: number;
  startTime: number;
  finalized: boolean;
  finalOutcome?: string;
  invalidate: boolean;
  votes: ArbitrationVote[];
}

interface ArbitrationVote {
  arbitrator: string;
  support: boolean;
  timestamp: number;
}
```

---

### 10.6 API 接口需求

**合约交互接口**：
```typescript
// 提交结果
proposeOutcome(marketId: string, resolutionId: string, outcome: string, disputeWindowTime: number): Promise<TransactionResponse>

// 提交争议
challenge(disputeId: string, resolutionId: string, marketId: string, disputeType: number, reason: string): Promise<TransactionResponse>

// 仲裁投票
vote(disputeId: string, support: bool): Promise<TransactionResponse>

// 查询最终结果(outcome为""时表示未提交决议)
getFinalOutcome(marketId: string): Promise<{outcome: string, resolved: boolean, invalid: boolean}>
```

**子图查询接口**：
```graphql
# 获取待决议列表
query GetPendingResolutions {
  marketResolutions(where: {status_in: ["Proposed", "Challenged"]}) {
    marketId
    resolutionId
    proposedOutcome
    proposer
    proposeTime
    status
  }
}

# 获取争议详情
query GetDispute($marketId: String!) {
  marketDisputes(where: {marketId: $marketId}) {
    marketId
    disputeId
    disputeType
    challenger
    bondAmount
    disputeTime
    resolved
    reason
  }
}

# 获取仲裁投票记录
query GetArbitrationVotes($disputeId: String!) {
  arbitrationVotes(where: {disputeId: $disputeId}) {
    arbitrator
    support
    timestamp
  }
}
```

---

### 10.7 页面路由设计

```
/resolution/:id
  └─ 显示市场详情 + Resolution 状态
  └─ 显示 Resolution 详情
      ├─ 提交结果按钮（管理员）
      ├─ 发起争议按钮（Challenge Window 内）
      └─ 仲裁详情（如已争议）

/arbitration
  └─ 仲裁管理面板（仅委员）
      ├─ 待仲裁任务列表
      ├─ 投票页面
      └─ 历史记录

/challenge/new
  └─ 创建新争议页面
```

---

## 13. 与交易系统对接

```solidity
getFinalOutcome(marketId)
returns (outcome, resolved, invalid)
```
- outcome 为""未propose
- resolved 才可结算
- invalid → 退款
