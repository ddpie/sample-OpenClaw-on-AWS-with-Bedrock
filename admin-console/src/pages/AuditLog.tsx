import { useState } from 'react';
import Table from '@cloudscape-design/components/table';
import Header from '@cloudscape-design/components/header';
import ContentLayout from '@cloudscape-design/components/content-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import TextFilter from '@cloudscape-design/components/text-filter';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Badge from '@cloudscape-design/components/badge';
import Box from '@cloudscape-design/components/box';
import Select from '@cloudscape-design/components/select';

interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: 'agent_invocation' | 'permission_denied' | 'approval_decision' | 'tool_execution' | 'tenant_login' | 'config_change';
  tenantId: string;
  tenantName: string;
  tool: string;
  status: 'success' | 'blocked' | 'warning' | 'info';
  latencyMs: number;
  detail: string;
}

const AUDIT_EVENTS: AuditEvent[] = [
  { id: 'EVT-1001', timestamp: '2025-07-14T10:32:15Z', eventType: 'agent_invocation', tenantId: 'tg__engineer_alex', tenantName: 'Alex Wang', tool: 'shell', status: 'success', latencyMs: 245, detail: 'Executed: git status' },
  { id: 'EVT-1002', timestamp: '2025-07-14T10:28:03Z', eventType: 'permission_denied', tenantId: 'wa__intern_sarah', tenantName: 'Sarah Chen', tool: 'shell', status: 'blocked', latencyMs: 12, detail: 'Plan A blocked: intern role cannot access shell' },
  { id: 'EVT-1003', timestamp: '2025-07-14T10:25:44Z', eventType: 'approval_decision', tenantId: 'sl__finance_carol', tenantName: 'Carol Zhang', tool: 'data_path:/finance/q2', status: 'info', latencyMs: 0, detail: 'Approved by Jordan Lee' },
  { id: 'EVT-1004', timestamp: '2025-07-14T10:20:11Z', eventType: 'tool_execution', tenantId: 'dc__admin_jordan', tenantName: 'Jordan Lee', tool: 'code_execution', status: 'success', latencyMs: 1823, detail: 'Python sandbox: health check script' },
  { id: 'EVT-1005', timestamp: '2025-07-14T10:15:30Z', eventType: 'agent_invocation', tenantId: 'wa__intern_sarah', tenantName: 'Sarah Chen', tool: 'web_search', status: 'success', latencyMs: 890, detail: 'Query: "React useEffect cleanup patterns"' },
  { id: 'EVT-1006', timestamp: '2025-07-14T10:10:02Z', eventType: 'permission_denied', tenantId: 'wa__sales_mike', tenantName: 'Mike Johnson', tool: 'file_write', status: 'blocked', latencyMs: 8, detail: 'Plan E caught: attempted write to /etc/config' },
  { id: 'EVT-1007', timestamp: '2025-07-14T10:05:18Z', eventType: 'tenant_login', tenantId: 'tg__engineer_alex', tenantName: 'Alex Wang', tool: '—', status: 'info', latencyMs: 156, detail: 'Session started via Telegram' },
  { id: 'EVT-1008', timestamp: '2025-07-14T09:58:45Z', eventType: 'agent_invocation', tenantId: 'sl__finance_carol', tenantName: 'Carol Zhang', tool: 'web_search', status: 'success', latencyMs: 672, detail: 'Query: "Q2 2025 market analysis"' },
  { id: 'EVT-1009', timestamp: '2025-07-14T09:50:33Z', eventType: 'config_change', tenantId: 'dc__admin_jordan', tenantName: 'Jordan Lee', tool: '—', status: 'warning', latencyMs: 0, detail: 'Updated model to Claude Sonnet 4.5' },
  { id: 'EVT-1010', timestamp: '2025-07-14T09:45:12Z', eventType: 'tool_execution', tenantId: 'tg__engineer_alex', tenantName: 'Alex Wang', tool: 'file_write', status: 'success', latencyMs: 34, detail: 'Wrote: /workspace/src/utils/helper.ts' },
];

const eventTypeOptions = [
  { label: 'All Events', value: 'all' },
  { label: 'Agent Invocation', value: 'agent_invocation' },
  { label: 'Permission Denied', value: 'permission_denied' },
  { label: 'Approval Decision', value: 'approval_decision' },
  { label: 'Tool Execution', value: 'tool_execution' },
  { label: 'Tenant Login', value: 'tenant_login' },
  { label: 'Config Change', value: 'config_change' },
];

const statusIcon = (status: string) => {
  switch (status) {
    case 'success': return <StatusIndicator type="success">Success</StatusIndicator>;
    case 'blocked': return <StatusIndicator type="error">Blocked</StatusIndicator>;
    case 'warning': return <StatusIndicator type="warning">Warning</StatusIndicator>;
    default: return <StatusIndicator type="info">Info</StatusIndicator>;
  }
};

const eventBadgeColor = (type: string) => {
  switch (type) {
    case 'agent_invocation': return 'green';
    case 'permission_denied': return 'red';
    case 'approval_decision': return 'blue';
    case 'config_change': return 'grey';
    default: return 'blue';
  }
};

export default function AuditLog() {
  const [filterText, setFilterText] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState(eventTypeOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filtered = AUDIT_EVENTS.filter(e => {
    const matchesText = filterText === '' ||
      e.tenantName.toLowerCase().includes(filterText.toLowerCase()) ||
      e.tool.toLowerCase().includes(filterText.toLowerCase()) ||
      e.detail.toLowerCase().includes(filterText.toLowerCase());
    const matchesType = eventTypeFilter.value === 'all' || e.eventType === eventTypeFilter.value;
    return matchesText && matchesType;
  });

  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Complete audit trail of all platform events" counter={`(${filtered.length})`}>
          Audit Log
        </Header>
      }
    >
      <Table
        items={paginated}
        columnDefinitions={[
          {
            id: 'timestamp',
            header: 'Timestamp',
            cell: (e) => (
              <Box>
                <Box>{new Date(e.timestamp).toLocaleDateString()}</Box>
                <Box fontSize="body-s" color="text-body-secondary">{new Date(e.timestamp).toLocaleTimeString()}</Box>
              </Box>
            ),
            sortingField: 'timestamp',
            width: 160,
          },
          {
            id: 'eventType',
            header: 'Event Type',
            cell: (e) => <Badge color={eventBadgeColor(e.eventType)}>{e.eventType.replace(/_/g, ' ')}</Badge>,
            width: 170,
          },
          {
            id: 'tenant',
            header: 'Tenant',
            cell: (e) => (
              <Box>
                <Box fontWeight="bold">{e.tenantName}</Box>
                <Box fontSize="body-s" color="text-body-secondary">{e.tenantId}</Box>
              </Box>
            ),
            width: 180,
          },
          { id: 'tool', header: 'Tool', cell: (e) => e.tool !== '—' ? <Badge>{e.tool}</Badge> : '—', width: 140 },
          { id: 'status', header: 'Status', cell: (e) => statusIcon(e.status), width: 120 },
          { id: 'latency', header: 'Latency', cell: (e) => e.latencyMs > 0 ? `${e.latencyMs}ms` : '—', width: 90 },
          { id: 'detail', header: 'Detail', cell: (e) => <Box fontSize="body-s">{e.detail}</Box> },
        ]}
        variant="full-page"
        stickyHeader
        filter={
          <SpaceBetween direction="horizontal" size="s">
            <TextFilter
              filteringText={filterText}
              onChange={({ detail }) => { setFilterText(detail.filteringText); setCurrentPage(1); }}
              filteringPlaceholder="Search by tenant, tool, or detail..."
            />
            <Select
              selectedOption={eventTypeFilter}
              onChange={({ detail }) => { setEventTypeFilter(detail.selectedOption as typeof eventTypeFilter); setCurrentPage(1); }}
              options={eventTypeOptions}
            />
          </SpaceBetween>
        }
        pagination={
          <Pagination
            currentPageIndex={currentPage}
            pagesCount={Math.ceil(filtered.length / pageSize)}
            onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
          />
        }
        header={<Header counter={`(${filtered.length})`}>Events</Header>}
        empty={
          <Box textAlign="center" padding="l">
            <StatusIndicator type="info">No events match the current filters</StatusIndicator>
          </Box>
        }
      />
    </ContentLayout>
  );
}
