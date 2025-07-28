'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Button,
  Stack,
  Container,
  Group,
  Card,
  Grid,
  Box,
  rem,
  SimpleGrid,
  ThemeIcon,
  Modal,
  TextInput,
  Alert,
  Loader,
  Center,
  Paper,
} from '@mantine/core';
import {
  IconRocket,
  IconBolt,
  IconRefresh,
  IconWorld,
  IconArrowRight,
  IconCheck,
} from '@tabler/icons-react';
import {
  getAuthState,
  onAuthStateChanged,
  requestCode,
  verifyCode,
  signOut,
  type AuthState,
} from 'basebase-js';
import { appConfig } from '../config';
import { Navigation } from './components/Navigation';
import { ProjectsExplorer } from './components/ProjectsExplorer';
import { Footer } from './components/Footer';

export default function HomePage() {
  const [authState, setAuthState] = useState<AuthState>({ 
    isAuthenticated: false, 
    user: null, 
    project: null, 
    token: null 
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Form fields
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const initialAuthState = getAuthState();
    setAuthState(initialAuthState);

    const unsubscribe = onAuthStateChanged((newAuthState: AuthState) => {
      setAuthState(newAuthState);
      if (newAuthState.isAuthenticated) {
        setShowAuthModal(false);
        resetForm();
      }
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setUsername('');
    setPhone('');
    setCode('');
    setAuthStep('phone');
    setError('');
    setLoading(false);
  };

  const handleAuthClick = () => {
    if (authState.isAuthenticated) {
      handleSignOut();
    } else {
      setShowAuthModal(true);
      setError('');
    }
  };

  const handleRequestCode = async () => {
    if (!username.trim() || !phone.trim()) {
      setError('Please enter both username and phone number');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username must contain only letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await requestCode(username.trim(), phone.trim());
      setAuthStep('code');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authResult = await verifyCode(phone.trim(), code.trim(), appConfig.defaultProjectId);
      const newAuthState = {
        isAuthenticated: true,
        user: authResult.user,
        project: authResult.project,
        token: authResult.token
      };
      setAuthState(newAuthState);
      setShowAuthModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setAuthState({
      isAuthenticated: false,
      user: null,
      project: null,
      token: null
    });
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    resetForm();
  };

  const features = [
    {
      icon: IconRocket,
      title: 'Launch with Users',
      description: 'Start with an existing community instead of building from zero. Shared data means instant social graphs and content.',
    },
    {
      icon: IconBolt,
      title: 'Rapid Prototyping',
      description: 'Web-based IDE with AI assistance. Dynamic schemas that evolve with your ideas. From concept to live app in minutes.',
    },
    {
      icon: IconRefresh,
      title: 'Easy Forking',
      description: 'Clone any project and make it your own. Open source by default with shared infrastructure and data.',
    },
    {
      icon: IconWorld,
      title: 'Auto-Hosting',
      description: 'Every project gets instant deployment at basebase.ai/yourproject. No DevOps, no configuration, just code.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create or Fork',
      description: 'Start fresh or fork an existing project. Inherit all the data and users from day one.',
    },
    {
      number: '2',
      title: 'Code & Extend',
      description: 'Use our web IDE to build with NextJS, BaseBase SDK, and Mantine. Add new fields and collections as needed.',
    },
    {
      number: '3',
      title: 'Deploy Instantly',
      description: 'Your app goes live automatically. Share the link and start growing your community immediately.',
    },
  ];

  return (
    <>
      <Navigation 
        onAuthClick={handleAuthClick}
        isAuthenticated={authState.isAuthenticated}
        userEmail={authState.user?.phone}
      />

      {/* Hero Section */}
      <Box pt={rem(100)} pb={rem(80)}>
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center">
            <Title 
              order={1}
              size={rem(60)}
              fw={900}
              maw={800}
              style={{ 
                lineHeight: 1.1,
                background: 'linear-gradient(45deg, var(--mantine-color-violet-6), var(--mantine-color-blue-6))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Vibe together.
            </Title>
            
            <Text size="xl" c="dimmed" maw={600} style={{ lineHeight: 1.5 }}>
              A powerful new platform where communities can develop real production apps by vibe coding together, in real time.
            </Text>

            <Group gap="md">
              <Button size="xl" radius="xl" rightSection={<IconArrowRight size={20} />}>
                Create Project
              </Button>
              <Button size="xl" variant="outline" radius="xl">
                View Docs
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Why BaseBase Section */}
      <Box py={rem(80)}>
        <Container size="xl">
          <Stack gap="xl">
            <Box ta="center" mb={rem(40)}>
              <Title order={2} size="h1" mb="md">
                Why BaseBase?
              </Title>
            </Box>

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              {features.map((feature, index) => (
                <Card key={index} padding="xl" radius="lg">
                  <Group align="flex-start" gap="lg">
                    <ThemeIcon size={60} radius="lg" variant="light" color="violet">
                      <feature.icon size={30} />
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Group align="center" gap="sm" mb="xs">
                        <Text fw={700} size="lg">
                          {feature.title}
                        </Text>
                      </Group>
                      <Text c="dimmed" style={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Text>
                    </Box>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box py={rem(80)}>
        <Container size="xl">
          <Stack gap="xl">
            <Box ta="center" mb={rem(40)}>
              <Title order={2} size="h1" mb="md">
                How It Works
              </Title>
            </Box>

            <Grid gutter="xl">
              {steps.map((step, index) => (
                <Grid.Col key={index} span={{ base: 12, md: 4 }}>
                  <Card padding="xl" radius="lg" h="100%" ta="center">
                    <Stack align="center" gap="lg">
                      <ThemeIcon 
                        size={80} 
                        radius="50%" 
                        variant="gradient"
                        gradient={{ from: 'violet', to: 'blue', deg: 45 }}
                      >
                        <Text size="xl" fw={900} c="white">
                          {step.number}
                        </Text>
                      </ThemeIcon>
                      
                      <Box>
                        <Title order={3} mb="sm">
                          {step.title}
                        </Title>
                        <Text c="dimmed" style={{ lineHeight: 1.6 }}>
                          {step.description}
                        </Text>
                      </Box>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Projects Explorer */}
      <ProjectsExplorer />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <Modal
        opened={showAuthModal}
        onClose={handleCloseModal}
        title="Sign In with Phone"
        centered
        size="sm"
      >
        <Stack gap="md">
          {authStep === 'phone' ? (
            <>
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                required
                description="Alphanumeric characters and underscores only"
              />
              <TextInput
                label="Phone Number"
                placeholder="+1234567890"
                value={phone}
                onChange={(event) => setPhone(event.currentTarget.value)}
                required
                description="Include country code (e.g., +1 for US)"
              />
              {error && (
                <Alert color="red" variant="light">
                  {error}
                </Alert>
              )}
              <Group justify="apart">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRequestCode} 
                  loading={loading}
                  disabled={!username.trim() || !phone.trim()}
                >
                  Send Code
                </Button>
              </Group>
            </>
          ) : (
            <>
              <Text size="sm" c="dimmed">
                Enter the verification code sent to {phone}
              </Text>
              <TextInput
                label="Verification Code"
                placeholder="123456"
                value={code}
                onChange={(event) => setCode(event.currentTarget.value)}
                required
              />
              {error && (
                <Alert color="red" variant="light">
                  {error}
                </Alert>
              )}
              <Group justify="apart">
                <Button variant="outline" onClick={() => setAuthStep('phone')}>
                  Back
                </Button>
                <Button 
                  onClick={handleVerifyCode} 
                  loading={loading}
                  disabled={!code.trim()}
                >
                  Verify
                </Button>
              </Group>
            </>
          )}
          
          {loading && (
            <Center>
              <Loader size="sm" />
            </Center>
          )}
        </Stack>
      </Modal>
    </>
  );
}
