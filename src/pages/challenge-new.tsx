import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { BondWarning } from '@/components/challenge/bond-warning';
import { CountdownTimer } from '@/components/resolution/countdown-timer';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { AddressDisplay } from '@/components/shared/address-display';
import { EmptyState } from '@/components/shared/empty-state';
import { getResolutionById } from '@/data/mock-data';
import type { DisputeType } from '@/types';
import {
  ArrowLeft,
  Clock,
  FileText,
  Plus,
  X,
  Upload,
  CheckCircle,
} from 'lucide-react';

export function ChallengeNewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resolutionId = searchParams.get('resolutionId') || '';
  const resolution = resolutionId ? getResolutionById(resolutionId) : undefined;

  // 表单状态
  const [disputeType, setDisputeType] = useState<DisputeType>('Outcome');
  const [challengedOutcome, setChallengedOutcome] = useState<'YES' | 'NO'>(
    resolution?.proposedOutcome === 'YES' ? 'NO' : 'YES'
  );
  const [reason, setReason] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>(['']);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [txHash, setTxHash] = useState('');

  // 弹窗状态
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 验证
  const isValid =
    reason.trim().length > 0 &&
    evidenceUrls.some((url) => url.trim().length > 0);

  const handleAddUrl = () => {
    setEvidenceUrls([...evidenceUrls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...evidenceUrls];
    newUrls[index] = value;
    setEvidenceUrls(newUrls);
  };

  const handleFileUpload = () => {
    // 模拟文件上传
    const fileName = `evidence_${Date.now()}.pdf`;
    setEvidenceFiles([...evidenceFiles, fileName]);
  };

  const handleRemoveFile = (index: number) => {
    setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    // 模拟提交
    setTimeout(() => {
      setShowSuccess(true);
    }, 500);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate(`/resolution/${resolutionId}`);
  };

  // 检查是否在挑战窗口期内
  const isInChallengeWindow =
    resolution &&
    resolution.status === 'Proposed' &&
    resolution.challengeDeadline > Date.now();

  if (!resolution) {
    return (
      <PageLayout>
        <EmptyState
          title="决议不存在"
          description="请从决议详情页发起争议"
          action={
            <Button variant="outline" onClick={() => navigate('/resolutions')}>
              返回列表
            </Button>
          }
        />
      </PageLayout>
    );
  }

  if (!isInChallengeWindow) {
    return (
      <PageLayout>
        <EmptyState
          title="挑战窗口已关闭"
          description="该决议已超过挑战期限，无法发起争议"
          action={
            <Button
              variant="outline"
              onClick={() => navigate(`/resolution/${resolutionId}`)}
            >
              返回详情
            </Button>
          }
        />
      </PageLayout>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
  };

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* 返回按钮和标题 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/resolution/${resolutionId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">发起争议</h1>
            <p className="text-sm text-muted-foreground">
              对 Resolution #{resolutionId} 提出争议
            </p>
          </div>
        </div>

        {/* 目标市场信息 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              目标市场
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground">
                {resolution.market.title}
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">当前提案结果</span>
                <Badge
                  variant="outline"
                  className={
                    resolution.proposedOutcome === 'YES'
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/50 bg-red-500/10 text-red-400'
                  }
                >
                  {resolution.proposedOutcome}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  挑战截止
                </span>
                <CountdownTimer deadline={resolution.challengeDeadline} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">提案人</span>
                <AddressDisplay address={resolution.proposer} chars={4} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">提案时间</span>
                <span className="text-sm text-foreground">
                  {formatTime(resolution.proposeTime)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 争议表单 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">争议内容</CardTitle>
            <CardDescription>填写您的争议理由和证据材料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 争议类型 */}
            <div className="space-y-3">
              <Label>争议类型</Label>
              <RadioGroup
                value={disputeType}
                onValueChange={(value) => setDisputeType(value as DisputeType)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Outcome" id="outcome" />
                  <Label htmlFor="outcome" className="cursor-pointer">
                    结果仲裁
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Rule" id="rule" />
                  <Label htmlFor="rule" className="cursor-pointer">
                    规则仲裁
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {disputeType === 'Outcome'
                  ? '对市场结果提出异议，认为提案结果错误'
                  : '对市场规则提出异议，认为市场规则不合理或无法判定'}
              </p>
            </div>

            <Separator />

            {/* 主张结果 */}
            <div className="space-y-3">
              <Label>您认为正确的结果</Label>
              <Select
                value={challengedOutcome}
                onValueChange={(value) =>
                  setChallengedOutcome(value as 'YES' | 'NO')
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YES">YES</SelectItem>
                  <SelectItem value="NO">NO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* 争议理由 */}
            <div className="space-y-3">
              <Label htmlFor="reason">
                争议理由 <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="请详细说明您的争议理由..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                请提供清晰、具体的理由，说明为什么当前提案结果是错误的
              </p>
            </div>

            <Separator />

            {/* 证据链接 */}
            <div className="space-y-3">
              <Label>
                权威来源链接 <span className="text-red-400">*</span>
              </Label>
              <div className="space-y-2">
                {evidenceUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                    />
                    {evidenceUrls.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveUrl(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddUrl}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                添加链接
              </Button>
            </div>

            <Separator />

            {/* 证据文件 */}
            <div className="space-y-3">
              <Label>上传文件（可选）</Label>
              <div className="space-y-2">
                {evidenceFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                  >
                    <span className="text-sm text-foreground">{file}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFileUpload}
                className="gap-1"
              >
                <Upload className="h-3.5 w-3.5" />
                上传文件
              </Button>
              <p className="text-xs text-muted-foreground">
                支持图片、PDF 格式
              </p>
            </div>

            <Separator />

            {/* 交易哈希 */}
            <div className="space-y-3">
              <Label htmlFor="txHash">链上 Tx Hash（可选）</Label>
              <Input
                id="txHash"
                placeholder="0x..."
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 押金警告 */}
        <BondWarning amount={500} />

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/resolution/${resolutionId}`)}
          >
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            提交争议
          </Button>
        </div>

        {/* 确认弹窗 */}
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title="确认提交争议"
          description="您将质押 500 USDT 发起此争议。如果争议被驳回，押金将被没收。确定要继续吗？"
          confirmText="确认提交"
          onConfirm={handleConfirm}
        />

        {/* 成功弹窗 */}
        <ConfirmDialog
          open={showSuccess}
          onOpenChange={handleSuccessClose}
          title="争议提交成功"
          description="您的争议已成功提交，仲裁委员会将在24小时内进行裁决。"
          confirmText="查看详情"
          cancelText=""
          onConfirm={handleSuccessClose}
        />
      </div>
    </PageLayout>
  );
}
