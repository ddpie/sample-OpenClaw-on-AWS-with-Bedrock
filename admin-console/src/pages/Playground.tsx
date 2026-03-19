import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Select from '@cloudscape-design/components/select';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Box from '@cloudscape-design/components/box';
import ContentLayout from '@cloudscape-design/components/content-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Badge from '@cloudscape-design/components/badge';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

const TENANT_OPTIONS = [
  { label: 'Sarah Chen — Intern (WhatsApp)', value: 'wa__intern_sarah', description: 'Role: intern | Tools: web_search' },
  { label: 'Alex Wang — Senior Engineer (Telegram)', value: 'tg__engineer_alex', description: 'Role: engineer | Tools: shell, browser, file, code_execution' },
  { label: 'Jordan Lee — IT Admin (Discord)', value: 'dc__admin_jordan', description: 'Role: admin | Tools: all' },
  { label: 'Carol Zhang — Finance Analyst (Slack)', value: 'sl__finance_carol', description: 'Role: finance | Tools: web_search, file' },
];

const PERMISSION_PROFILES: Record<string, { role: string; tools: string[]; planA: string; planE: string }> = {
  wa__intern_sarah: {
    role: 'intern',
    tools: ['web_search'],
    planA: 'DENY shell, file_write, code_execution, browser.\nALLOW web_search.\nAll other tools require approval.',
    planE: 'Block any output containing: file paths outside /tmp, system credentials, internal IPs.\nFlag: code snippets > 50 lines.',
  },
  tg__engineer_alex: {
    role: 'engineer',
    tools: ['web_search', 'shell', 'browser', 'file', 'file_write', 'code_execution'],
    planA: 'ALLOW shell, browser, file, file_write, code_execution, web_search.\nDENY: rm -rf, chmod 777, eval().\nSandbox: Docker for code_execution.',
    planE: 'Block any output containing: /etc/shadow, AWS credentials, private keys.\nAllow: all standard development output.',
  },
  dc__admin_jordan: {
    role: 'admin',
    tools: ['web_search', 'shell', 'browser', 'file', 'file_write', 'code_execution'],
    planA: 'ALLOW all tools.\nDENY: always-blocked patterns (rm -rf /, curl|bash).\nLog: all admin actions to audit trail.',
    planE: 'Block: credential exposure in output.\nAllow: system configuration output.\nFlag: bulk data operations.',
  },
  sl__finance_carol: {
    role: 'finance',
    tools: ['web_search', 'file'],
    planA: 'ALLOW web_search, file (read-only).\nDENY shell, code_execution, file_write.\nData paths: /finance/** only.',
    planE: 'Block: PII in output (SSN, credit card numbers).\nBlock: data outside /finance/ scope.\nAllow: financial reports, market data.',
  },
};

const DEMO_CONVERSATIONS: Record<string, ChatMessage[]> = {
  wa__intern_sarah: [
    { role: 'system', content: '🔒 Tenant context loaded: intern role, limited permissions', timestamp: '' },
  ],
  tg__engineer_alex: [
    { role: 'system', content: '🔧 Tenant context loaded: engineer role, full dev tools', timestamp: '' },
  ],
  dc__admin_jordan: [
    { role: 'system', content: '⚡ Tenant context loaded: admin role, elevated access', timestamp: '' },
  ],
  sl__finance_carol: [
    { role: 'system', content: '📊 Tenant context loaded: finance role, data-scoped access', timestamp: '' },
  ],
};

const DEMO_RESPONSES: Record<string, Record<string, string>> = {
  wa__intern_sarah: {
    default: "I can help you search the web for information. Note that shell access and file operations aren't available for your role. What would you like to look up?",
    shell: "⛔ Permission denied: Your intern role does not have access to shell commands. This request has been logged. You can submit an approval request if you need temporary access.",
  },
  tg__engineer_alex: {
    default: "Ready to help with your engineering tasks. I have access to shell, file operations, browser, and code execution in a sandboxed environment. What are you working on?",
    shell: "✅ Shell access granted. Running in sandboxed environment.\n\n```\n$ git status\nOn branch main\nYour branch is up to date with 'origin/main'.\nnothing to commit, working tree clean\n```",
  },
  dc__admin_jordan: {
    default: "Admin console ready. Full platform access enabled with audit logging. All actions are recorded. How can I help?",
  },
  sl__finance_carol: {
    default: "I can help you with financial research and file access within the /finance/ directory. What report or data do you need?",
  },
};

export default function Playground() {
  const [selectedTenant, setSelectedTenant] = useState(TENANT_OPTIONS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_CONVERSATIONS[TENANT_OPTIONS[0].value]);
  const [inputValue, setInputValue] = useState('');
  const [lastPlanEResult, setLastPlanEResult] = useState('No messages processed yet');

  const tenantId = selectedTenant.value;
  const profile = PERMISSION_PROFILES[tenantId];

  const handleTenantChange = (option: typeof selectedTenant) => {
    setSelectedTenant(option);
    setMessages(DEMO_CONVERSATIONS[option.value] || []);
    setInputValue('');
    setLastPlanEResult('No messages processed yet');
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const now = new Date().toLocaleTimeString();
    const userMsg: ChatMessage = { role: 'user', content: inputValue, timestamp: now };

    const responses = DEMO_RESPONSES[tenantId] || {};
    const isShellRequest = inputValue.toLowerCase().includes('shell') || inputValue.toLowerCase().includes('run') || inputValue.toLowerCase().includes('execute');
    const responseText = isShellRequest && responses.shell ? responses.shell : (responses.default || 'Message received.');

    const assistantMsg: ChatMessage = { role: 'assistant', content: responseText, timestamp: now };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInputValue('');

    if (responseText.includes('⛔')) {
      setLastPlanEResult('⛔ BLOCKED — Plan A denied before execution. No Plan E evaluation needed.');
    } else {
      setLastPlanEResult('✅ PASS — Output scanned. No sensitive data, no policy violations detected.');
    }
  };

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Test agent behavior with different tenant contexts and permission profiles">
          Agent Playground
        </Header>
      }
    >
      <ColumnLayout columns={2}>
        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Chat</Header>}>
            <SpaceBetween size="m">
              <Select
                selectedOption={selectedTenant}
                onChange={({ detail }) => handleTenantChange(detail.selectedOption as typeof selectedTenant)}
                options={TENANT_OPTIONS}
                placeholder="Select a tenant..."
              />

              <div style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
                <SpaceBetween size="s">
                  {messages.map((msg, i) => (
                    <div key={i} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      <Box fontSize="body-s" color="text-body-secondary">
                        {msg.role === 'system' ? '⚙️ System' : msg.role === 'user' ? '👤 You' : '🤖 Agent'}
                        {msg.timestamp && ` · ${msg.timestamp}`}
                      </Box>
                      <div style={{
                        display: 'inline-block',
                        padding: '8px 12px',
                        borderRadius: 8,
                        maxWidth: '85%',
                        textAlign: 'left',
                        background: msg.role === 'user' ? 'rgba(0, 115, 187, 0.15)' : msg.role === 'system' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                        whiteSpace: 'pre-wrap',
                        fontSize: 14,
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </SpaceBetween>
              </div>

              <SpaceBetween direction="horizontal" size="xs">
                <div style={{ flex: 1 }}>
                  <Input
                    value={inputValue}
                    onChange={({ detail }) => setInputValue(detail.value)}
                    placeholder="Type a message (try 'run shell command')..."
                    onKeyDown={({ detail }) => { if (detail.key === 'Enter') handleSend(); }}
                  />
                </div>
                <Button variant="primary" onClick={handleSend}>Send</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        </SpaceBetween>

        <SpaceBetween size="l">
          <Container header={<Header variant="h2">Pipeline Inspector</Header>}>
            <SpaceBetween size="m">
              <div>
                <Box variant="awsui-key-label">Tenant ID</Box>
                <Box><code>{tenantId}</code></Box>
              </div>
              <div>
                <Box variant="awsui-key-label">Permission Profile</Box>
                <SpaceBetween direction="horizontal" size="xs">
                  <Badge color="blue">{profile.role}</Badge>
                  {profile.tools.map(t => <Badge key={t} color="green">{t}</Badge>)}
                </SpaceBetween>
              </div>
              <div>
                <Box variant="awsui-key-label">Plan A — Pre-Execution Prompt</Box>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap', fontSize: 13, fontFamily: 'monospace' }}>
                  {profile.planA}
                </div>
              </div>
              <div>
                <Box variant="awsui-key-label">Plan E — Post-Execution Rules</Box>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap', fontSize: 13, fontFamily: 'monospace' }}>
                  {profile.planE}
                </div>
              </div>
              <div>
                <Box variant="awsui-key-label">Last Plan E Result</Box>
                <StatusIndicator type={lastPlanEResult.includes('PASS') ? 'success' : lastPlanEResult.includes('BLOCKED') ? 'error' : 'info'}>
                  {lastPlanEResult}
                </StatusIndicator>
              </div>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </ColumnLayout>
    </ContentLayout>
  );
}
