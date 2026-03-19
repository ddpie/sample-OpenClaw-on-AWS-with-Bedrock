import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@cloudscape-design/components/app-layout';
import SideNavigation, { SideNavigationProps } from '@cloudscape-design/components/side-navigation';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import Badge from '@cloudscape-design/components/badge';

const NAV_ITEMS: SideNavigationProps.Item[] = [
  { type: 'link', text: 'Dashboard', href: '/dashboard' },
  { type: 'link', text: 'Tenants', href: '/tenants' },
  { type: 'link', text: 'Skills', href: '/skills' },
  {
    type: 'link',
    text: 'Approvals',
    href: '/approvals',
    info: <Badge color="red">2</Badge>,
  },
  { type: 'link', text: 'Audit Log', href: '/audit' },
  { type: 'divider' },
  { type: 'link', text: 'Usage & Cost', href: '/usage' },
  { type: 'link', text: 'Security', href: '/security' },
  { type: 'divider' },
  { type: 'link', text: 'Playground', href: '/playground' },
  { type: 'link', text: 'Settings', href: '/settings' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(true);

  return (
    <>
      <div id="top-nav">
        <TopNavigation
          identity={{
            href: '/',
            title: 'OpenClaw Enterprise',
            logo: { src: '', alt: 'OpenClaw' },
          }}
          utilities={[
            {
              type: 'button',
              iconName: 'notification',
              ariaLabel: 'Notifications',
              badge: true,
              disableUtilityCollapse: false,
            },
            {
              type: 'button',
              iconName: 'settings',
              ariaLabel: 'Settings',
              onClick: () => navigate('/settings'),
            },
          ]}
        />
      </div>
      <AppLayout
        navigation={
          <SideNavigation
            header={{ text: 'Admin Console', href: '/' }}
            activeHref={location.pathname}
            items={NAV_ITEMS}
            onFollow={(e) => {
              e.preventDefault();
              navigate(e.detail.href);
            }}
          />
        }
        navigationOpen={navOpen}
        onNavigationChange={({ detail }) => setNavOpen(detail.open)}
        content={children}
        toolsHide
        headerSelector="#top-nav"
      />
    </>
  );
}
