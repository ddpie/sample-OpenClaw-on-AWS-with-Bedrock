import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import Badge from '@cloudscape-design/components/badge';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Box from '@cloudscape-design/components/box';
import Grid from '@cloudscape-design/components/grid';
import Container from '@cloudscape-design/components/container';
import Button from '@cloudscape-design/components/button';

const SKILLS = [
  { id: 'jina-reader', name: 'Jina Reader', icon: '📖', desc: 'Extract clean text from any URL', layer: 1, label: 'Docker', roles: ['*'], status: 'installed', keys: 0 },
  { id: 'deep-research', name: 'Deep Research', icon: '🔬', desc: 'Multi-step research with sub-agents', layer: 1, label: 'Docker', roles: ['*'], status: 'installed', keys: 0 },
  { id: 'transcript', name: 'Transcript', icon: '📝', desc: 'YouTube video transcript extraction', layer: 1, label: 'Docker', roles: ['*'], status: 'installed', keys: 0 },
  { id: 'jira-query', name: 'Jira Query', icon: '🎫', desc: 'Query Jira issues by ID or search', layer: 2, label: 'S3', roles: ['engineering','product'], status: 'installed', keys: 2 },
  { id: 'weather', name: 'Weather Lookup', icon: '🌤️', desc: 'Current weather for any city', layer: 2, label: 'S3', roles: ['*'], status: 'installed', keys: 0 },
  { id: 'sap', name: 'SAP Connector', icon: '💼', desc: 'Query financial data from SAP ERP', layer: 2, label: 'S3', roles: ['finance'], status: 'installed', keys: 1 },
  { id: 'slack-bridge', name: 'Slack Bridge', icon: '💬', desc: 'Cross-channel messaging', layer: 3, label: 'Bundle', roles: ['*'], status: 'installed', keys: 0 },
  { id: 'github-pr', name: 'GitHub PR Review', icon: '🔍', desc: 'Automated PR review', layer: 3, label: 'Bundle', roles: ['engineering'], status: 'available', keys: 0 },
];

const layerColor = (l: number) => l === 1 ? 'blue' : l === 2 ? 'green' : 'grey';

export default function SkillCatalog() {
  const l1 = SKILLS.filter(s => s.layer === 1).length;
  const l2 = SKILLS.filter(s => s.layer === 2).length;
  const l3 = SKILLS.filter(s => s.layer === 3).length;

  return (
    <ContentLayout header={<Header variant="h1" actions={<Button variant="primary">Add Skill</Button>}>Skills Catalog</Header>}>
      <SpaceBetween size="l">
        <Grid gridDefinition={[{ colspan: 4 }, { colspan: 4 }, { colspan: 4 }]}>
          <Container><Box variant="awsui-key-label">🐳 Layer 1 — Docker Built-in</Box><Box variant="h1" fontSize="display-l">{l1}</Box></Container>
          <Container><Box variant="awsui-key-label">☁️ Layer 2 — S3 Hot-Load</Box><Box variant="h1" fontSize="display-l">{l2}</Box></Container>
          <Container><Box variant="awsui-key-label">📦 Layer 3 — Pre-built Bundle</Box><Box variant="h1" fontSize="display-l">{l3}</Box></Container>
        </Grid>

        <Cards
          items={SKILLS}
          cardDefinition={{
            header: (s) => (
              <SpaceBetween direction="horizontal" size="xs">
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span>{s.name}</span>
                <Badge color={layerColor(s.layer)}>Layer {s.layer} · {s.label}</Badge>
              </SpaceBetween>
            ),
            sections: [
              { id: 'desc', content: (s) => s.desc },
              {
                id: 'meta', content: (s) => (
                  <SpaceBetween direction="horizontal" size="xs">
                    <Badge color={s.status === 'installed' ? 'green' : 'grey'}>{s.status}</Badge>
                    {s.keys > 0 && <Badge color="blue">🔑 {s.keys} keys</Badge>}
                    <span style={{ fontSize: 11, opacity: 0.6 }}>
                      Roles: {s.roles.includes('*') ? 'All' : s.roles.join(', ')}
                    </span>
                  </SpaceBetween>
                ),
              },
            ],
          }}
          cardsPerRow={[{ cards: 1 }, { minWidth: 300, cards: 3 }]}
        />
      </SpaceBetween>
    </ContentLayout>
  );
}
