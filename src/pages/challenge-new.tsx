import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
} from 'lucide-react';

export function ChallengeNewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const resolutionId = searchParams.get('resolutionId') || '';
  const resolution = resolutionId ? getResolutionById(resolutionId) : undefined;

  // 表单状态
  const [disputeId, setDisputeId] = useState('');
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
    disputeId.trim().length > 0 &&
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

  const formatTime = (timestamp: number) => {
    const locale = i18n.language === 'zh-TW' ? 'zh-TW' : 'en-US';
    return new Date(timestamp).toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    });
  };

  if (!resolution) {
    return (
      <PageLayout>
        <EmptyState
          title={t('challenge.notFound')}
          description={t('challenge.notFoundDesc')}
          action={
            <Button variant="outline" onClick={() => navigate('/resolutions')}>
              {t('common.backToList')}
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
          title={t('challenge.windowClosed')}
          description={t('challenge.windowClosedDesc')}
          action={
            <Button
              variant="outline"
              onClick={() => navigate(`/resolution/${resolutionId}`)}
            >
              {t('challenge.backToDetails')}
            </Button>
          }
        />
      </PageLayout>
    );
  }

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
            <h1 className="text-xl font-bold text-foreground">{t('challenge.title')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('challenge.subtitle', { id: resolutionId })}
            </p>
          </div>
        </div>

        {/* 目标市场信息 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              {t('challenge.targetMarket')}
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
                <span className="text-sm text-muted-foreground">{t('challenge.currentProposal')}</span>
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
                  {t('resolution.challengeDeadline')}
                </span>
                <CountdownTimer deadline={resolution.challengeDeadline} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('resolution.proposer')}</span>
                <AddressDisplay address={resolution.proposer} chars={4} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('resolution.proposeTime')}</span>
                <span className="text-sm text-foreground">
                  {formatTime(resolution.proposeTime)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 仲裁表单 */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">{t('challenge.form.title')}</CardTitle>
            <CardDescription>{t('challenge.form.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dispute ID */}
            <div className="space-y-3">
              <Label htmlFor="disputeId">
                {t('challenge.form.disputeId')} <span className="text-red-400">*</span>
              </Label>
              <Input
                id="disputeId"
                placeholder={t('challenge.form.disputeIdPlaceholder')}
                value={disputeId}
                onChange={(e) => setDisputeId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {t('challenge.form.disputeIdHint')}
              </p>
            </div>

            <Separator />

            {/* 仲裁类型 */}
            <div className="space-y-3">
              <Label>{t('challenge.form.disputeType')}</Label>
              <RadioGroup
                value={disputeType}
                onValueChange={(value) => setDisputeType(value as DisputeType)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Outcome" id="outcome" />
                  <Label htmlFor="outcome" className="cursor-pointer">
                    {t('challenge.form.outcomeDispute')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Rule" id="rule" />
                  <Label htmlFor="rule" className="cursor-pointer">
                    {t('challenge.form.ruleDispute')}
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {disputeType === 'Outcome'
                  ? t('challenge.form.outcomeDisputeDesc')
                  : t('challenge.form.ruleDisputeDesc')}
              </p>
            </div>

            <Separator />

            {/* 主张结果 */}
            <div className="space-y-3">
              <Label>{t('challenge.form.correctOutcome')}</Label>
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

            {/* 仲裁理由 */}
            <div className="space-y-3">
              <Label htmlFor="reason">
                {t('challenge.form.reason')} <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder={t('challenge.form.reasonPlaceholder')}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                {t('challenge.form.reasonHint')}
              </p>
            </div>

            <Separator />

            {/* 证据链接 */}
            <div className="space-y-3">
              <Label>
                {t('challenge.form.evidenceUrls')} <span className="text-red-400">*</span>
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
                {t('challenge.form.addLink')}
              </Button>
            </div>

            <Separator />

            {/* 证据文件 */}
            <div className="space-y-3">
              <Label>{t('challenge.form.uploadFiles')}</Label>
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
                {t('challenge.form.uploadButton')}
              </Button>
              <p className="text-xs text-muted-foreground">
                {t('challenge.form.supportedFormats')}
              </p>
            </div>

            <Separator />

            {/* 交易哈希 */}
            <div className="space-y-3">
              <Label htmlFor="txHash">{t('challenge.form.txHash')}</Label>
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
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {t('challenge.submitApplication')}
          </Button>
        </div>

        {/* 确认弹窗 */}
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title={t('confirmDialog.submitTitle')}
          description={t('confirmDialog.submitDesc', { amount: 500 })}
          confirmText={t('confirmDialog.submitConfirm')}
          onConfirm={handleConfirm}
        />

        {/* 成功弹窗 */}
        <ConfirmDialog
          open={showSuccess}
          onOpenChange={handleSuccessClose}
          title={t('confirmDialog.successTitle')}
          description={t('confirmDialog.successDesc')}
          confirmText={t('confirmDialog.viewDetails')}
          cancelText=""
          onConfirm={handleSuccessClose}
        />
      </div>
    </PageLayout>
  );
}
