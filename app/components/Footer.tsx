'use client';

import {
  Box,
  Container,
  Group,
  Text,
  Stack,
  Grid,
  Divider,
  rem,
} from '@mantine/core';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { appConfig } from '../../config';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Changelog', href: '/changelog' },
    ],
    Company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press Kit', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
    Resources: [
      { label: 'Community', href: '/community' },
      { label: 'Help Center', href: '/help' },
      { label: 'Status', href: '/status' },
      { label: 'Security', href: '/security' },
      { label: 'System Status', href: '/status' },
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Acceptable Use', href: '/acceptable-use' },
      { label: 'Data Processing', href: '/data-processing' },
    ],
  };

  const socialLinks = [
    { icon: IconBrandGithub, href: 'https://github.com/basebase', label: 'GitHub' },
    { icon: IconBrandTwitter, href: 'https://twitter.com/basebase', label: 'Twitter' },
    { icon: IconBrandLinkedin, href: 'https://linkedin.com/company/basebase', label: 'LinkedIn' },
    { icon: IconMail, href: 'mailto:hello@basebase.ai', label: 'Email' },
  ];

  return (
    <Box 
      component="footer" 
      style={{ 
        backgroundColor: 'var(--mantine-color-gray-9)',
        color: 'var(--mantine-color-gray-3)',
        marginTop: 'auto'
      }}
      py={rem(60)}
    >
      <Container size="xl">
        <Stack gap="xl">
          {/* Main Footer Content */}
          <Grid gutter="xl">
            {/* Brand Section */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap="md">
                <Text
                  size="xl"
                  fw={700}
                  style={{
                    background: 'linear-gradient(45deg, var(--mantine-color-violet-6), var(--mantine-color-blue-6))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {appConfig.name}
                </Text>
                <Text size="sm" c="dimmed" maw={300}>
                  A powerful platform where communities can develop real production apps by vibe coding together, in real time.
                </Text>
                <Group gap="md">
                  {socialLinks.map((social) => (
                    <Box
                      key={social.label}
                      component="a"
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--mantine-color-gray-5)',
                        transition: 'color 0.2s ease',
                        cursor: 'pointer',
                      }}
                      className="social-link"
                    >
                      <social.icon size={20} />
                    </Box>
                  ))}
                </Group>
              </Stack>
            </Grid.Col>

            {/* Links Sections */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Grid>
                {Object.entries(footerLinks).map(([category, links]) => (
                  <Grid.Col key={category} span={{ base: 6, sm: 3 }}>
                    <Stack gap="sm">
                      <Text fw={600} size="sm" c="white">
                        {category}
                      </Text>
                      <Stack gap="xs">
                        {links.map((link) => (
                          <Text
                            key={link.label}
                            component="a"
                            href={link.href}
                            size="sm"
                            c="dimmed"
                            style={{
                              textDecoration: 'none',
                              cursor: 'pointer',
                              transition: 'color 0.2s ease',
                            }}
                            className="footer-link"
                          >
                            {link.label}
                          </Text>
                        ))}
                      </Stack>
                    </Stack>
                  </Grid.Col>
                ))}
              </Grid>
            </Grid.Col>
          </Grid>

          {/* Divider */}
          <Divider color="gray.7" />

          {/* Bottom Section */}
          <Group justify="space-between" wrap="wrap">
            <Text size="sm" c="dimmed">
              © {currentYear} {appConfig.name}. All rights reserved.
            </Text>
            <Group gap="md" wrap="wrap">
              <Text
                component="a"
                href="/privacy"
                size="sm"
                c="dimmed"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                className="footer-link"
              >
                Privacy
              </Text>
              <Text
                component="a"
                href="/terms"
                size="sm"
                c="dimmed"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                className="footer-link"
              >
                Terms
              </Text>
              <Text
                component="a"
                href="/cookies"
                size="sm"
                c="dimmed"
                style={{ textDecoration: 'none', cursor: 'pointer' }}
                className="footer-link"
              >
                Cookies
              </Text>
              <Text size="sm" c="dimmed">
                Made with ♥ for developers
              </Text>
            </Group>
          </Group>
        </Stack>
      </Container>

      <style jsx global>{`
        .footer-link:hover {
          color: var(--mantine-color-violet-4) !important;
        }
        
        .social-link:hover {
          color: var(--mantine-color-violet-4) !important;
          transform: translateY(-1px);
        }
        
        [data-mantine-color-scheme="light"] footer {
          background-color: var(--mantine-color-gray-9) !important;
        }
        
        [data-mantine-color-scheme="dark"] footer {
          background-color: var(--mantine-color-dark-9) !important;
        }
      `}</style>
    </Box>
  );
} 