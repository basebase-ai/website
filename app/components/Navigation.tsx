'use client';

import {
  Group,
  Button,
  Text,
  Container,
  Burger,
  Drawer,
  Stack,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { appConfig } from '../../config';

interface NavigationProps {
  onAuthClick: () => void;
  isAuthenticated: boolean;
  userEmail?: string;
}

export function Navigation({ onAuthClick, isAuthenticated, userEmail }: NavigationProps) {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

  const navLinks = [
    { label: 'Projects', href: '/projects' },
    { label: 'Docs', href: '/docs' },
    { label: 'Community', href: '/community' },
  ];

  const NavLinks = ({ vertical = false }: { vertical?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Text
          key={link.label}
          component="a"
          href={link.href}
          size="sm"
          fw={500}
          c="dimmed"
          style={{
            textDecoration: 'none',
            cursor: 'pointer',
            padding: vertical ? '0.5rem 0' : '0.5rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease',
          }}
          className="nav-link"
        >
          {link.label}
        </Text>
      ))}
    </>
  );

  return (
    <>
      <Box 
        component="header"
        h={70} 
        px="md" 
        style={{ 
          border: 'none', 
          backgroundColor: 'transparent',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--mantine-color-gray-2)'
        }}
      >
        <Container size="xl" h="100%">
          <Group justify="space-between" h="100%">
            {/* Logo */}
            <Group>
              <Text
                size="xl"
                fw={700}
                variant="gradient"
                gradient={{ from: 'violet', to: 'blue', deg: 45 }}
                style={{ cursor: 'pointer' }}
              >
                {appConfig.name}
              </Text>
            </Group>

            {/* Desktop Navigation */}
            <Group visibleFrom="sm" gap="xs">
              <NavLinks />
            </Group>

            {/* Desktop Auth Button */}
            <Group visibleFrom="sm">
              {isAuthenticated ? (
                <Group>
                  <Text size="sm" c="dimmed">
                    {userEmail}
                  </Text>
                  <Button variant="outline" size="sm" onClick={onAuthClick}>
                    Sign Out
                  </Button>
                </Group>
              ) : (
                <Button size="sm" onClick={onAuthClick}>
                  Sign In
                </Button>
              )}
            </Group>

            {/* Mobile Burger */}
            <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
          </Group>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        position="right"
        size="xs"
        padding="md"
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <Stack gap="lg">
          <NavLinks vertical />
          <Box>
            {isAuthenticated ? (
              <Stack gap="sm">
                <Text size="sm" c="dimmed">
                  {userEmail}
                </Text>
                <Button variant="outline" fullWidth onClick={onAuthClick}>
                  Sign Out
                </Button>
              </Stack>
            ) : (
              <Button fullWidth onClick={onAuthClick}>
                Sign In
              </Button>
            )}
          </Box>
        </Stack>
      </Drawer>

      <style jsx global>{`
        .nav-link:hover {
          color: var(--mantine-color-violet-6) !important;
          background-color: var(--mantine-color-violet-0);
        }
        
        [data-mantine-color-scheme="dark"] .nav-link:hover {
          background-color: var(--mantine-color-violet-9);
        }
      `}</style>
    </>
  );
} 