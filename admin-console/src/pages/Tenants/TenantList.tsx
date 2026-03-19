import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Table from '@cloudscape-design/components/table';
import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';

const DEMO_TENANTS = [
  { id: 'wa__intern_sarah', name: 'Sarah Chen', role: 'Intern', dept: 'Engineering', ch: 'WhatsApp', tools: ['web_search'], status: 'active', skills: 3 },
  { id: 'tg__engineer_alex', name: 'Alex Wang', role: 'Senior Engineer', dept: 'Engineering', ch: 'Telegram', tools: ['web_search','shell','browser','file','file_write','code_execution'], status: 'active', skills: 7 },
  { id: 'dc__admin_jordan', name: 'Jordan Lee', role: 'IT Admin', dept: 'IT', ch: 'Discord', tools: ['web_search','shell','browser','file','file_write','code_execution'], status: 'active', skills: 7 },
  { id: 'sl__finance_carol', name: 'Carol Zhang', role: 'Finance Analyst', dept: 'Finance', ch: 'Slack', tools: ['web_search','file'], status: 'active', skills: 5 },
  { id: 'wa__sales_mike', name: 'Mike Johnson', role: 'Sales Manager', dept: 'Sales', ch: 'WhatsApp', tools: ['web_search'], status: 'inactive', skills: 3 },
];

export default function TenantList() {
  return (
    <ContentLayout header={<Header variant="h1" actions={<Button variant="primary">Add Tenant</Button>}>Tenant Management</Header>}>
      <Table
        items={DEMO_TENANTS}
        columnDefinitions={[
          { id: 'name', header: 'Name', cell: (t) => <><b>{t.name}</b><br/><span style={{fontSize:11,opacity:0.6}}>{t.id}</span></> },
          { id: 'role', header: 'Role', cell: (t) => t.role },
          { id: 'dept', header: 'Department', cell: (t) => t.dept },
          { id: 'ch', header: 'Channel', cell: (t) => <Badge color="blue">{t.ch}</Badge> },
          { id: 'tools', header: 'Tools', cell: (t) => <SpaceBetween direction="horizontal" size="xxs">{t.tools.map(tool => <Badge key={tool} color="green">{tool}</Badge>)}</SpaceBetween> },
          { id: 'skills', header: 'Skills', cell: (t) => t.skills },
          { id: 'status', header: 'Status', cell: (t) => <Badge color={t.status === 'active' ? 'green' : 'grey'}>{t.status}</Badge> },
        ]}
        variant="full-page"
        stickyHeader
        header={<Header counter={`(${DEMO_TENANTS.length})`}>All Tenants</Header>}
      />
    </ContentLayout>
  );
}
