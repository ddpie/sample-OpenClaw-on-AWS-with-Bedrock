import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Table from '@cloudscape-design/components/table';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

function StatCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle?: string; icon: string }) {
  return (
    <Container>
      <Box variant="awsui-key-label">{icon} {title}</Box>
      <Box variant="h1" fontSize="display-l" fontWeight="bold">{value}</Box>
      {subtitle && <Box fontSize="body-s" color="text-body-secondary">{subtitle}</Box>}
    </Container>
  );
}

const TENANT_USAGE = [
  { tenant: 'Alex Wang', tenantId: 'tg__engineer_alex', role: 'Senior Engineer', inputTokens: 48200, outputTokens: 31500, requests: 67, cost: 0.24, trend: 'up' },
  { tenant: 'Jordan Lee', tenantId: 'dc__admin_jordan', role: 'IT Admin', inputTokens: 35800, outputTokens: 22100, requests: 42, cost: 0.17, trend: 'stable' },
  { tenant: 'Carol Zhang', tenantId: 'sl__finance_carol', role: 'Finance Analyst', inputTokens: 22400, outputTokens: 15600, requests: 31, cost: 0.11, trend: 'up' },
  { tenant: 'Sarah Chen', tenantId: 'wa__intern_sarah', role: 'Intern', inputTokens: 18900, outputTokens: 9800, requests: 28, cost: 0.08, trend: 'down' },
  { tenant: 'Mike Johnson', tenantId: 'wa__sales_mike', role: 'Sales Manager', inputTokens: 5200, outputTokens: 3100, requests: 8, cost: 0.02, trend: 'down' },
];

const totalInput = TENANT_USAGE.reduce((s, t) => s + t.inputTokens, 0);
const totalOutput = TENANT_USAGE.reduce((s, t) => s + t.outputTokens, 0);
const totalCost = TENANT_USAGE.reduce((s, t) => s + t.cost, 0);

const COST_COMPARISON = [
  { provider: 'OpenClaw + Nova 2 Lite', inputRate: '$0.30', outputRate: '$2.50', dailyCost: `$${totalCost.toFixed(2)}`, monthlyCost: `$${(totalCost * 30).toFixed(2)}`, savings: '—' },
  { provider: 'ChatGPT Team', inputRate: '$30/user', outputRate: 'included', dailyCost: '$5.00', monthlyCost: '$150.00', savings: '' },
  { provider: 'Claude Pro (5 seats)', inputRate: '$20/user', outputRate: 'included', dailyCost: '$3.33', monthlyCost: '$100.00', savings: '' },
];

const trendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return '📈';
    case 'down': return '📉';
    default: return '➡️';
  }
};

export default function Usage() {
  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Token consumption, cost tracking, and per-tenant breakdown">
          Usage &amp; Cost
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Grid gridDefinition={[{ colspan: 3 }, { colspan: 3 }, { colspan: 3 }, { colspan: 3 }]}>
          <StatCard icon="📥" title="Input Tokens (today)" value={`${(totalInput / 1000).toFixed(1)}k`} subtitle={`${TENANT_USAGE.length} active tenants`} />
          <StatCard icon="📤" title="Output Tokens (today)" value={`${(totalOutput / 1000).toFixed(1)}k`} subtitle={`Avg ${(totalOutput / TENANT_USAGE.length / 1000).toFixed(1)}k per tenant`} />
          <StatCard icon="💰" title="Cost Today" value={`$${totalCost.toFixed(2)}`} subtitle="Nova 2 Lite pricing" />
          <StatCard icon="🆚" title="ChatGPT Equivalent" value="$5.00/day" subtitle={`You save ~$${(5.0 - totalCost).toFixed(2)}/day`} />
        </Grid>

        <Container header={<Header variant="h2">Cost Comparison</Header>}>
          <ColumnLayout columns={1}>
            <Table
              items={COST_COMPARISON}
              columnDefinitions={[
                { id: 'provider', header: 'Provider', cell: (c) => <Box fontWeight="bold">{c.provider}</Box> },
                { id: 'inputRate', header: 'Input Rate', cell: (c) => c.inputRate },
                { id: 'outputRate', header: 'Output Rate', cell: (c) => c.outputRate },
                { id: 'dailyCost', header: 'Est. Daily Cost', cell: (c) => c.dailyCost },
                { id: 'monthlyCost', header: 'Est. Monthly Cost', cell: (c) => c.monthlyCost },
                {
                  id: 'savings',
                  header: 'vs OpenClaw',
                  cell: (c) => {
                    if (c.savings === '—') return <Badge color="green">Current</Badge>;
                    const monthly = parseFloat(c.monthlyCost.replace('$', ''));
                    const ours = totalCost * 30;
                    const pct = ((monthly - ours) / monthly * 100).toFixed(0);
                    return <StatusIndicator type="success">{pct}% cheaper with OpenClaw</StatusIndicator>;
                  },
                },
              ]}
              variant="embedded"
            />
          </ColumnLayout>
        </Container>

        <Table
          items={TENANT_USAGE}
          columnDefinitions={[
            {
              id: 'tenant',
              header: 'Tenant',
              cell: (t) => (
                <Box>
                  <Box fontWeight="bold">{t.tenant}</Box>
                  <Box fontSize="body-s" color="text-body-secondary">{t.role}</Box>
                </Box>
              ),
            },
            { id: 'requests', header: 'Requests', cell: (t) => t.requests },
            { id: 'input', header: 'Input Tokens', cell: (t) => t.inputTokens.toLocaleString() },
            { id: 'output', header: 'Output Tokens', cell: (t) => t.outputTokens.toLocaleString() },
            { id: 'cost', header: 'Cost', cell: (t) => `$${t.cost.toFixed(2)}` },
            { id: 'trend', header: 'Trend', cell: (t) => <span>{trendIcon(t.trend)} {t.trend}</span> },
            {
              id: 'share',
              header: '% of Total',
              cell: (t) => {
                const pct = (t.cost / totalCost * 100).toFixed(1);
                return <Badge color="blue">{pct}%</Badge>;
              },
            },
          ]}
          variant="full-page"
          stickyHeader
          header={<Header variant="h2" counter={`(${TENANT_USAGE.length})`}>Per-Tenant Breakdown</Header>}
          sortingDisabled
        />
      </SpaceBetween>
    </ContentLayout>
  );
}
