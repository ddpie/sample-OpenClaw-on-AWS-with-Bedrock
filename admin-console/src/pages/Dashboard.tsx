import { useQuery } from '@tanstack/react-query';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Table from '@cloudscape-design/components/table';
import ContentLayout from '@cloudscape-design/components/content-layout';
import { fetchDashboard, fetchRecentAudit } from '../api/dashboard';

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <Container>
      <Box variant="awsui-key-label">{icon} {title}</Box>
      <Box variant="h1" fontSize="display-l" fontWeight="bold">{value}</Box>
    </Container>
  );
}

export default function Dashboard() {
  const { data: dash } = useQuery({ queryKey: ['dashboard'], queryFn: fetchDashboard });
  const { data: audit } = useQuery({ queryKey: ['audit-recent'], queryFn: fetchRecentAudit });

  const d = dash ?? { tenants: 0, active: 0, reqs: 0, tokens: 0, cost_today: 0, pending: 0, violations: 0, skills_total: 0 };

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Enterprise Multi-Tenant OpenClaw Platform">
          <StatusIndicator type="success">All systems operational</StatusIndicator>
          {' '}Dashboard
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Grid gridDefinition={[
          { colspan: 2 }, { colspan: 2 }, { colspan: 2 },
          { colspan: 2 }, { colspan: 2 }, { colspan: 2 },
        ]}>
          <StatCard title="Tenants" value={d.tenants} icon="👥" />
          <StatCard title="Active" value={d.active} icon="⚡" />
          <StatCard title="Requests" value={d.reqs.toLocaleString()} icon="💬" />
          <StatCard title="Tokens" value={`${(d.tokens / 1000).toFixed(0)}k`} icon="🪙" />
          <StatCard title="Cost Today" value={`$${d.cost_today.toFixed(2)}`} icon="💰" />
          <StatCard title="Alerts" value={d.pending + d.violations} icon="🔔" />
        </Grid>

        <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
          <Container header={<Header variant="h2">Recent Activity</Header>}>
            <Table
              items={audit?.events ?? []}
              columnDefinitions={[
                { id: 'ts', header: 'Time', cell: (e) => new Date(e.ts).toLocaleTimeString() },
                {
                  id: 'ev', header: 'Event', cell: (e) => (
                    <StatusIndicator type={e.ev === 'permission_denied' ? 'error' : e.ev === 'approval_decision' ? 'warning' : 'success'}>
                      {e.ev.replace(/_/g, ' ')}
                    </StatusIndicator>
                  ),
                },
                { id: 'tid', header: 'Tenant', cell: (e) => e.tid },
                { id: 'tool', header: 'Detail', cell: (e) => e.tool || '—' },
                { id: 'ms', header: 'Latency', cell: (e) => `${e.ms}ms` },
              ]}
              variant="embedded"
              empty="No recent events"
            />
          </Container>

          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Pending Approvals</Header>}>
              <Box variant="h1" fontSize="display-l" textAlign="center" color="text-status-error">
                {d.pending}
              </Box>
              <Box textAlign="center" color="text-body-secondary">
                requests awaiting review
              </Box>
            </Container>
            <Container header={<Header variant="h2">Security</Header>}>
              <Box variant="h1" fontSize="display-l" textAlign="center" color="text-status-warning">
                {d.violations}
              </Box>
              <Box textAlign="center" color="text-body-secondary">
                Plan E violations today
              </Box>
            </Container>
          </SpaceBetween>
        </Grid>
      </SpaceBetween>
    </ContentLayout>
  );
}
