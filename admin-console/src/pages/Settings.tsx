import { useState } from 'react';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Toggle from '@cloudscape-design/components/toggle';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';

export default function Settings() {
  const [fastPath, setFastPath] = useState(true);
  const [dockerSandbox, setDockerSandbox] = useState(true);
  const [auditVerbose, setAuditVerbose] = useState(false);

  return (
    <ContentLayout
      header={
        <Header variant="h1" description="Platform configuration, model selection, and service health">
          Settings
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Container
          header={
            <Header
              variant="h2"
              actions={<Button>Change Model</Button>}
            >
              Model Selection
            </Header>
          }
        >
          <ColumnLayout columns={3}>
            <div>
              <Box variant="awsui-key-label">Current Model</Box>
              <Box variant="h3">Amazon Nova 2 Lite</Box>
              <Box fontSize="body-s" color="text-body-secondary">global.amazon.nova-2-lite-v1:0</Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Pricing</Box>
              <Box>Input: <Badge color="green">$0.30 / 1M tokens</Badge></Box>
              <Box>Output: <Badge color="green">$2.50 / 1M tokens</Badge></Box>
            </div>
            <div>
              <Box variant="awsui-key-label">Capabilities</Box>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Text generation</StatusIndicator>
                <StatusIndicator type="success">Tool use / function calling</StatusIndicator>
                <StatusIndicator type="warning">Limited reasoning (use Sonnet for complex tasks)</StatusIndicator>
              </SpaceBetween>
            </div>
          </ColumnLayout>
        </Container>

        <Container header={<Header variant="h2">Service Status</Header>}>
          <ColumnLayout columns={3}>
            <div>
              <Box variant="awsui-key-label">Gateway Proxy</Box>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Running on port 18789</StatusIndicator>
                <Box fontSize="body-s" color="text-body-secondary">Uptime: 14d 6h 32m</Box>
                <Box fontSize="body-s" color="text-body-secondary">Requests today: 176</Box>
              </SpaceBetween>
            </div>
            <div>
              <Box variant="awsui-key-label">Auth Agent</Box>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Healthy</StatusIndicator>
                <Box fontSize="body-s" color="text-body-secondary">Uptime: 14d 6h 32m</Box>
                <Box fontSize="body-s" color="text-body-secondary">Approvals processed: 42</Box>
              </SpaceBetween>
            </div>
            <div>
              <Box variant="awsui-key-label">Bedrock Connection</Box>
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Connected (us-west-2)</StatusIndicator>
                <Box fontSize="body-s" color="text-body-secondary">VPC Endpoint: enabled</Box>
                <Box fontSize="body-s" color="text-body-secondary">Avg latency: 245ms</Box>
              </SpaceBetween>
            </div>
          </ColumnLayout>
        </Container>

        <Container header={<Header variant="h2">Gateway Configuration</Header>}>
          <SpaceBetween size="l">
            <ColumnLayout columns={2}>
              <div>
                <Box variant="awsui-key-label">Gateway Token</Box>
                <Box fontWeight="bold" fontSize="heading-m">
                  <code>oc_••••••••••••••••3f7a</code>
                </Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  Stored in SSM Parameter Store: /openclaw/*/gateway-token
                </Box>
              </div>
              <div>
                <Box variant="awsui-key-label">Region</Box>
                <Box fontWeight="bold">us-west-2 (Oregon)</Box>
                <Box fontSize="body-s" color="text-body-secondary">
                  Instance: c7g.large · VPC Endpoints: enabled
                </Box>
              </div>
            </ColumnLayout>

            <ColumnLayout columns={3}>
              <div>
                <Toggle
                  checked={fastPath}
                  onChange={({ detail }) => setFastPath(detail.checked)}
                >
                  Fast-Path Routing
                </Toggle>
                <Box fontSize="body-s" color="text-body-secondary">
                  Skip Plan A for pre-approved tool+role combos
                </Box>
              </div>
              <div>
                <Toggle
                  checked={dockerSandbox}
                  onChange={({ detail }) => setDockerSandbox(detail.checked)}
                >
                  Docker Sandbox
                </Toggle>
                <Box fontSize="body-s" color="text-body-secondary">
                  Isolate code_execution in Docker containers
                </Box>
              </div>
              <div>
                <Toggle
                  checked={auditVerbose}
                  onChange={({ detail }) => setAuditVerbose(detail.checked)}
                >
                  Verbose Audit Logging
                </Toggle>
                <Box fontSize="body-s" color="text-body-secondary">
                  Log full request/response payloads (increases storage)
                </Box>
              </div>
            </ColumnLayout>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
}
