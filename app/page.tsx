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
  Textarea,
  Badge,
} from '@mantine/core';
import {
  IconRocket,
  IconBolt,
  IconRefresh,
  IconWorld,
  IconArrowRight,
  IconCheck,
  IconBrandGithub,
  IconExternalLink,
  IconLoader,
} from '@tabler/icons-react';
import {
  getAuthState,
  onAuthStateChanged,
  requestCode,
  verifyCode,
  signOut,
  type AuthState,
  db,
  collection,
  doc,
  setDoc,
  createProject,
  createRepository,
  createService,
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

  // Create app modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string>('');
  const [createProgress, setCreateProgress] = useState<string>('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createdProjectUrls, setCreatedProjectUrls] = useState<{
    editorUrl: string;
    githubUrl: string;
    deploymentUrl: string;
  } | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategories, setProjectCategories] = useState('');
  const [refreshProjects, setRefreshProjects] = useState(0);
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);

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

  // Auto-generate project ID when name changes
  useEffect(() => {
    if (projectName) {
      const generatedId = projectName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setProjectId(generatedId);
    } else {
      setProjectId('');
    }
  }, [projectName]);

  const resetForm = () => {
    setUsername('');
    setPhone('');
    setCode('');
    setAuthStep('phone');
    setError('');
    setLoading(false);
  };

  const resetCreateForm = () => {
    setProjectName('');
    setProjectId('');
    setProjectDescription('');
    setProjectCategories('');
    setCreateError('');
    setCreateLoading(false);
    setCreateProgress('');
    setCreateSuccess(false);
    setCreatedProjectUrls(null);
    setIsEditMode(false);
    setEditingProject(null);
  };

  const handleAuthClick = () => {
    if (authState.isAuthenticated) {
      handleSignOut();
    } else {
      setShowAuthModal(true);
      setError('');
    }
  };

  const handleCreateAppClick = () => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      setError('');
    } else {
      setShowCreateModal(true);
      setCreateError('');
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

  const handleEditProject = (project: any) => {
    setIsEditMode(true);
    setEditingProject(project.id);
    setProjectName(project.name || '');
    setProjectId(project.id || '');
    setProjectDescription(project.description || '');
    setProjectCategories(
      project.categories 
        ? project.categories.join(', ') 
        : project.category || ''
    );
    setShowCreateModal(true);
    setCreateError('');
  };

  const handleCreateProject = async () => {
    if (!projectName.trim() || !projectId.trim() || !projectDescription.trim()) {
      setCreateError('Please fill in all fields');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(projectId)) {
      setCreateError('Project ID must contain only lowercase letters, numbers, and hyphens');
      return;
    }

    setCreateLoading(true);
    setCreateError('');
    setCreateProgress('');

    try {
      // Parse categories from comma-separated string to array
      const categoriesArray = projectCategories
        .split(',')
        .map(cat => cat.trim())
        .filter(cat => cat.length > 0);

      if (isEditMode && editingProject) {
        // Handle edit mode - just update the existing project document
        setCreateProgress('Updating project information...');
        
        const projectData = {
          name: projectName.trim(),
          description: projectDescription.trim(),
          categories: categoriesArray,
          updatedAt: new Date(),
        };

        const docRef = doc(db, `basebase/projects/${editingProject}`);
        await setDoc(docRef, projectData);
        
        setShowCreateModal(false);
        resetCreateForm();
        setRefreshProjects(prev => prev + 1);
        return;
      }

      // Create new project using the three-step process
      setCreateProgress('Creating project document...');
      
      const projectResult = await createProject({
        projectId: projectId.trim(),
        name: projectName.trim(),
        description: projectDescription.trim(),
        categories: categoriesArray,
      });

      if (!projectResult.success) {
        throw new Error('Failed to create project document');
      }

      setCreateProgress('Setting up GitHub repository...');
      
      const repositoryResult = await createRepository({
        projectId: projectId.trim(),
      });

      if (!repositoryResult.success) {
        throw new Error('Failed to create repository');
      }

      setCreateProgress('Deploying service...');
      
      const serviceResult = await createService({
        projectId: projectId.trim(),
      });

      if (!serviceResult.success) {
        throw new Error('Failed to deploy service');
      }

      setCreateProgress('Project created successfully!');
      
      // Set success state and URLs
      setCreateSuccess(true);
      setCreatedProjectUrls({
        editorUrl: `https://editor.basebase.ai/${projectId.trim()}`,
        githubUrl: repositoryResult.repository.url,
        deploymentUrl: serviceResult.service.deploymentUrl,
      });
      
      setCreateLoading(false);
      
    } catch (err: any) {
      console.error('Project creation error:', err);
      if (err.message?.includes('already exists') || err.message?.includes('duplicate')) {
        setCreateError('The ID you selected is already taken, please try again with a different ID');
      } else {
        setCreateError(err.message || 'Failed to create project');
      }
    } finally {
      setCreateLoading(false);
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

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetCreateForm();
  };

  const features = [
    {
      icon: IconWorld,
      title: 'Build It Together',
      description: 'Every user is a developer. Radical collaboration where communities design, build, and evolve apps together in real time.',
    },
    {
      icon: IconBolt,
      title: 'No Experience Needed',
      description: 'Jump right in with our AI coding assistant. No prior programming knowledge required - just bring your ideas and creativity.',
    },
    {
      icon: IconRocket,
      title: 'One Shared Database',
      description: 'Build your app on a live database shared by other apps from day one. Start with an existing community instead of building from zero.',
    },
    {
      icon: IconRefresh,
      title: "It's Fun!",
      description: 'Building apps should be joyful! Experience the thrill of creating something real with friends, seeing instant results, and growing together.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create or Edit',
      description: 'Start fresh or just contribute to an existing project. Inherit all the data and users from day one.',
    },
    {
      number: '2',
      title: 'Vibe Code Together',
      description: 'Use our AI coding assistant to turn your ideas into real, interactive features. Add new fields and collections as needed.',
    },
    {
      number: '3',
      title: 'Deploy Instantly',
      description: 'Your app goes live automatically - for you and for everyone! Share the link and start growing your community immediately.',
    },
  ];

  return (
    <>
      <Navigation 
        onAuthClick={handleAuthClick}
        isAuthenticated={authState.isAuthenticated}
        userName={authState.user?.name}
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
            
            <Text size="xl" maw={600} style={{ lineHeight: 1.5 }}>
              Everyone updating the source code at the same time.<br />What could go right?
            </Text>

            <Group gap="md" justify="center">
              <Button size="xl" radius="xl" rightSection={<IconArrowRight size={20} />} onClick={handleCreateAppClick}>
                Create App
              </Button>
              <Button 
                size="xl" 
                radius="xl" 
                variant="outline" 
                onClick={() => window.open('https://github.com/basebase-ai/basebase-js', '_blank')}
              >
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
      <ProjectsExplorer 
        onCreateAppClick={handleCreateAppClick}
        onEditProject={handleEditProject}
        authState={authState}
        refreshTrigger={refreshProjects}
      />

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

      {/* Create App Modal */}
      <Modal
        opened={showCreateModal}
        onClose={handleCloseCreateModal}
        title={isEditMode ? "Edit App" : "Create New App"}
        centered
        size="md"
      >
        {createSuccess && createdProjectUrls ? (
          <Stack gap="lg">
            <Alert color="green" variant="light" icon={<IconCheck size={16} />}>
              <Text fw={600} size="lg">Your new app is ready!</Text>
            </Alert>
            
            <Card padding="lg" radius="lg" style={{ 
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}>
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <Title order={4} size="h3">
                    {projectName}
                  </Title>
                  <Badge color="green" variant="light" size="sm">
                    Ready
                  </Badge>
                </Group>
                
                <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                  {projectDescription}
                </Text>
                
                <Button 
                  size="lg"
                  radius="md"
                  rightSection={<IconExternalLink size={16} />}
                  onClick={() => {
                    if (authState?.token && createdProjectUrls?.githubUrl) {
                      const editorUrl = `https://editor.basebase.ai/${projectId.trim()}?repo=${encodeURIComponent(createdProjectUrls.githubUrl)}&token=${authState.token}`;
                      window.open(editorUrl, '_blank');
                    }
                  }}
                  disabled={!authState?.token || !createdProjectUrls?.githubUrl}
                  style={{ width: '100%' }}
                >
                  Start Editing
                </Button>
                
                <Stack gap="xs">
                  <Group gap="xs" align="center">
                    <IconBrandGithub size={16} />
                    <Text size="sm" c="dimmed">GitHub repository:</Text>
                  </Group>
                  <Text 
                    size="xs" 
                    c="violet.6" 
                    style={{ 
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Droid Sans Mono", "Liberation Mono", Consolas, "Courier New", monospace',
                      opacity: 0.8,
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                    component="a"
                    href={createdProjectUrls.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {createdProjectUrls.githubUrl.replace('https://', '').replace('http://', '')}
                  </Text>
                </Stack>
                
                <Stack gap="xs">
                  <Group gap="xs" align="center">
                    <IconLoader size={16} />
                    <Text size="sm" c="dimmed">Deployment (in progress):</Text>
                  </Group>
                  <Text 
                    size="xs" 
                    c="violet.6" 
                    style={{ 
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Droid Sans Mono", "Liberation Mono", Consolas, "Courier New", monospace',
                      opacity: 0.8,
                      cursor: 'pointer',
                      textDecoration: 'none'
                    }}
                    component="a"
                    href={createdProjectUrls.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {createdProjectUrls.deploymentUrl.replace('https://', '').replace('http://', '')}
                  </Text>
                  <Text size="xs" c="dimmed">May take up to 3 minutes to deploy</Text>
                </Stack>
              </Stack>
            </Card>
            
            <Group justify="center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateModal(false);
                  resetCreateForm();
                  setRefreshProjects(prev => prev + 1);
                }}
              >
                Close
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap="md">
            <TextInput
              label="Name"
              placeholder="My Awesome App"
              value={projectName}
              onChange={(event) => setProjectName(event.currentTarget.value)}
              required
              description="The display name for your app"
            />
            <TextInput
              label="ID"
              placeholder="my-awesome-app"
              value={projectId}
              onChange={(event) => setProjectId(event.currentTarget.value)}
              required
              disabled={isEditMode}
              description={isEditMode ? "Project ID cannot be changed" : "Auto-generated from name. Lowercase letters, numbers, and hyphens only"}
            />
            <Textarea
              label="Description"
              placeholder="Describe what your app does..."
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.currentTarget.value)}
              required
              minRows={3}
              description="A brief description of your app's purpose"
            />
            <TextInput
              label="Categories"
              placeholder="social, productivity, games"
              value={projectCategories}
              onChange={(event) => setProjectCategories(event.currentTarget.value)}
              description="Comma-separated list of categories (e.g. social, productivity, games)"
            />
            {createError && (
              <Alert color="red" variant="light">
                {createError}
              </Alert>
            )}
            {createLoading && createProgress && (
              <Alert color="blue" variant="light">
                <Center>
                  <Stack gap="xs" align="center">
                    <Loader size="sm" />
                    <Text size="sm">{createProgress}</Text>
                  </Stack>
                </Center>
              </Alert>
            )}
            <Group justify="apart">
              <Button variant="outline" onClick={handleCloseCreateModal} disabled={createLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProject} 
                loading={createLoading}
                disabled={!projectName.trim() || !projectId.trim() || !projectDescription.trim()}
              >
                {isEditMode ? "Save" : "Create"}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
