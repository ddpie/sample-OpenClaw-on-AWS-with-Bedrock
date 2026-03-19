import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';

function StatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return (
    <Container>
      <Box variant="awsui-key-label">{icon} {title}</Box>
      <Box variant="h1" fontSize="display-l" fontWeight="bold">{value}</Box>
      {subtitle && <Box fontSize="body-s" color="text-body-secondary">{subtitle}</Box>}
    </Container>
  );
}

const BLOCKED_TOOLS = [
  { tool: 'rm -rf', category: 'Destructive', reason: 'Recursive file deletion — always blocked regardless of role', severity: 'critical' },
  { tool: 'curl | bash', category: 'Remote Exec', reason: 'Piped remote code execution — injection vector', severity: 'critical' },
  { tool: 'chmod 777', category: 'Permission', reason: 'World-writable permissions — security violation', severity: 'high' },
  { tool: 'eval()', category: 'Code Injection', reason: 'Dynamic code evaluation — prompt injection vector', severity: 'critical' },
  { tool: '/etc/shadow', category: 'Sensitive File', reason: 'Password hash file — never accessible', severity: 'critical' },
  { tool: 'nc -l (netcat)', category: 'Network', reason: 'Reverse shell listener — exfiltration risk', severity: 'high' },
  { tool: 'env / printenv', category: 'Secrets', reason: 'Environment variable dump — may expose API keys', severity: 'medium' },
];

const ISOLATION_CHECKLIST = [
  { item: 'Tenant ID injected into every LLM prompt', status: true, layer: 'Identity' },
  { item: 'Plan A: Pre-execution permission check', status: true, layer: 'Plan A' },
  { item: 'Plan E: Post-execution output validation', status: true, layer: 'Plan E' },
  { item: 'Docker sandbox per code execution', status: true, layer: 'Sandbox' },
  { item: 'No cross-tenant data leakage in context', status: true, layer: 'Isolation' },
  { item: 'Approval workflow for privilege escalation', status: true, layer: 'Approval' },
  { item: 'Audit log for all tool invocations', status: true, layer: 'Audit' },
  { item: 'Rate limiting per tenant', status: false, layer: 'Rate Limit' },
  { item: 'Encrypted secrets at rest (SSM Parameter Store)', status: true, layer: 'Secrets' },
];

const RECENT_INCIDENTS = [
  { time: '10:28 AM', tenant: 'Sarah Chen', event: 'Plan A blocked shell access (intern role)', severity: 'medium' },
  { time: '10:10 AM', tenant: 'Mike Johnson', event: 'Plan E caught write to /etc/config', severity: 'high' },
  { time: '9:50 AM', tenant: 'Unknown', event: 'Prompt injection attempt detected and blocked', severity: 'critical' },
];

export default function Security() {
  const passCount = ISOLATION_CHECKLIST.filter(c => c.status).length;
  const totalCount = ISOLATION_CHECKLIST.length;

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Security posture, threat monitoring, and compliance status">
          Security Center
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
          <StatCard icon="🛡️" title="Plan A Blocks" value={14} subtitle="Pre-execution denials today" />
          <StatCard icon="🔍" title="Plan E Catches" value={3} subtitle="Post-execution violations today" />
          <StatCard icon="💉" title="Injection Attempts" value={1} subtitle="Prompt injection blocked" />
          <StatCard icon="✅" title="Compliance Status" value={`${passCount}/${totalCount}`} subtitle={passCount === totalCount ? 'All checks passing' : `${totalCount - passCount} item(s) need attention`} />
        </Grid>

        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 8 }]}>
          <Container header={<Header variant="h2">Recent Incidents</Header>}>
            <SpaceBetween size="m">
              {RECENT_INCIDENTS.map((inc, i) => (
                <div key={i}>
                  <Box fontSize="body-s" color="text-body-secondary">{inc.time}</Box>
                  <StatusIndicator type={inc.severity === 'critical' ? 'error' : inc.severity === 'high' ? 'warning' : 'info'}>
                    {inc.event}
                  </StatusIndicator>
                  <Box fontSize="body-s" color="text-body-secondary">Tenant: {inc.tenant}</Box>
                </div>
              ))}
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Always-Blocked Tools</Header>}>
            <Table
              items={BLOCKED_TOOLS}
              columnDefinitions={[
                { id: 'tool', header: 'Tool / Pattern', cell: (t) => <Box fontWeight="bold"><code>{t.tool}</code></Box> },
                { id: 'category', header: 'Category', cell: (t) => <Badge>{t.category}</Badge> },
                { id: 'severity', header: 'Severity', cell: (t) => (
                  <Badge color={t.severity === 'critical' ? 'red' : t.severity === 'high' ? 'blue' : 'grey'}>
                    {t.severity}
                  </Badge>
                )},
                { id: 'reason', header: 'Reason', cell: (t) => <Box fontSize="body-s">{t.reason}</Box> },
              ]}
              variant="embedded"
            />
          </Container>
        </Grid>

        <Container header={<Header variant="h2">Isolation Model Checklist</Header>}>
          <ColumnLayout columns={2}>
            {ISOLATION_CHECKLIST.map((check, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StatusIndicator type={check.status ? 'success' : 'warning'}>
                  {check.item}
                </StatusIndicator>
                <Badge color={check.status ? 'green' : 'grey'}>{check.layer}</Badge>
              </div>
            ))}
          </ColumnLayout>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
