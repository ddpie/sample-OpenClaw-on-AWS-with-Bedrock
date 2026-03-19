import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Box from '@cloudscape-design/components/box';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Tabs from '@cloudscape-design/components/tabs';

interface ApprovalRequest {
  id: string;
  tenant: string;
  tenantId: string;
  tool: string;
  reason: string;
  risk: 'high' | 'medium' | 'low';
  timestamp: string;
  status: 'pending' | 'approved' | 'denied';
  reviewer?: string;
  resolvedAt?: string;
}

const INITIAL_PENDING: ApprovalRequest[] = [
  {
    id: 'APR-001',
    tenant: 'Sarah Chen',
    tenantId: 'wa__intern_sarah',
    tool: 'shell',
    reason: 'Need shell access to run unit tests for onboarding project',
    risk: 'high',
    timestamp: '2025-07-14T09:23:00Z',
    status: 'pending',
  },
  {
    id: 'APR-002',
    tenant: 'Carol Zhang',
    tenantId: 'sl__finance_carol',
    tool: 'data_path:/finance/reports/q2',
    reason: 'Quarterly report generation requires access to Q2 financial data',
    risk: 'medium',
    timestamp: '2025-07-14T10:05:00Z',
    status: 'pending',
  },
];

const RESOLVED: ApprovalRequest[] = [
  {
    id: 'APR-098',
    tenant: 'Alex Wang',
    tenantId: 'tg__engineer_alex',
    tool: 'code_execution',
    reason: 'CI pipeline debugging requires code execution in sandbox',
    risk: 'high',
    timestamp: '2025-07-13T14:12:00Z',
    status: 'approved',
    reviewer: 'Jordan Lee',
    resolvedAt: '2025-07-13T14:18:00Z',
  },
  {
    id: 'APR-097',
    tenant: 'Mike Johnson',
    tenantId: 'wa__sales_mike',
    tool: 'file_write',
    reason: 'Export CRM contacts to CSV',
    risk: 'medium',
    timestamp: '2025-07-13T11:30:00Z',
    status: 'denied',
    reviewer: 'Jordan Lee',
    resolvedAt: '2025-07-13T11:45:00Z',
  },
  {
    id: 'APR-096',
    tenant: 'Sarah Chen',
    tenantId: 'wa__intern_sarah',
    tool: 'browser',
    reason: 'Research internal wiki for documentation task',
    risk: 'low',
    timestamp: '2025-07-12T16:00:00Z',
    status: 'approved',
    reviewer: 'Auto-approved (low risk)',
    resolvedAt: '2025-07-12T16:00:00Z',
  },
];

const riskColor = (risk: string) => risk === 'high' ? 'red' : risk === 'medium' ? 'blue' : 'green';

function ApprovalCard({ request, onApprove, onDeny }: { request: ApprovalRequest; onApprove?: () => void; onDeny?: () => void }) {
  return (
    <Container
      header={
        <Header
          variant="h3"
          actions={
            request.status === 'pending' ? (
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="primary" onClick={onApprove}>Approve</Button>
                <Button onClick={onDeny}>Deny</Button>
              </SpaceBetween>
            ) : undefined
          }
        >
          <SpaceBetween direction="horizontal" size="xs">
            <span>{request.id}</span>
            <Badge color={riskColor(request.risk)}>{request.risk} risk</Badge>
            {request.status !== 'pending' && (
              <Badge color={request.status === 'approved' ? 'green' : 'red'}>{request.status}</Badge>
            )}
          </SpaceBetween>
        </Header>
      }
    >
      <SpaceBetween size="s">
        <div>
          <Box variant="awsui-key-label">Requester</Box>
          <Box>{request.tenant} <span style={{ opacity: 0.6, fontSize: 12 }}>({request.tenantId})</span></Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Tool / Resource</Box>
          <Box><Badge color="blue">{request.tool}</Badge></Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Justification</Box>
          <Box>{request.reason}</Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Requested</Box>
          <Box>{new Date(request.timestamp).toLocaleString()}</Box>
        </div>
        {request.reviewer && (
          <div>
            <Box variant="awsui-key-label">Reviewed by</Box>
            <Box>
              <StatusIndicator type={request.status === 'approved' ? 'success' : 'error'}>
                {request.reviewer}
              </StatusIndicator>
              {request.resolvedAt && <span style={{ opacity: 0.6, fontSize: 12, marginLeft: 8 }}>{new Date(request.resolvedAt).toLocaleString()}</span>}
            </Box>
          </div>
        )}
      </SpaceBetween>
    </Container>
  );
}

export default function Approvals() {
  const [pending, setPending] = useState(INITIAL_PENDING);
  const [resolved, setResolved] = useState(RESOLVED);

  const handleApprove = (id: string) => {
    const req = pending.find(r => r.id === id);
    if (!req) return;
    setPending(prev => prev.filter(r => r.id !== id));
    setResolved(prev => [{ ...req, status: 'approved' as const, reviewer: 'You (Admin)', resolvedAt: new Date().toISOString() }, ...prev]);
  };

  const handleDeny = (id: string) => {
    const req = pending.find(r => r.id === id);
    if (!req) return;
    setPending(prev => prev.filter(r => r.id !== id));
    setResolved(prev => [{ ...req, status: 'denied' as const, reviewer: 'You (Admin)', resolvedAt: new Date().toISOString() }, ...prev]);
  };

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Review and manage permission escalation requests">
          Approval Queue
        </Header>
      }
    >
      <Tabs
        tabs={[
          {
            label: <span>Pending <Badge color="red">{pending.length}</Badge></span>,
            id: 'pending',
            content: (
              <SpaceBetween size="l">
                {pending.length === 0 ? (
                  <Container>
                    <Box textAlign="center" padding="l">
                      <StatusIndicator type="success">All caught up — no pending approvals</StatusIndicator>
                    </Box>
                  </Container>
                ) : (
                  pending.map(req => (
                    <ApprovalCard
                      key={req.id}
                      request={req}
                      onApprove={() => handleApprove(req.id)}
                      onDeny={() => handleDeny(req.id)}
                    />
                  ))
                )}
              </SpaceBetween>
            ),
          },
          {
            label: `Resolved (${resolved.length})`,
            id: 'resolved',
            content: (
              <SpaceBetween size="l">
                {resolved.map(req => (
                  <ApprovalCard key={req.id} request={req} />
                ))}
              </SpaceBetween>
            ),
          },
        ]}
      />
    </ContentLayout>
  );
}
