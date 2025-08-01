'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  TextInput,
  Grid,
  Card,
  Group,
  Badge,
  Button,
  Stack,
  Box,
  rem,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import { IconSearch, IconUsers, IconFileText, IconStar, IconBrandGithub, IconEdit, IconUsersGroup, IconGitFork, IconAlertCircle, IconSettings } from '@tabler/icons-react';
import { getProjects } from 'basebase-js';

interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl?: string;
  productionUrl?: string;
  users?: number;
  posts?: number;
  polls?: number;
  photos?: number;
  jobs?: number;
  events?: number;
  reviews?: number;
  forks?: number;
  category?: string;
  categories?: string[];
  ownerId?: string;
  // Add flexibility for any additional fields that might come from basebase
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; [key: string]: any } | null;
  project: any;
  token: string | null;
}

interface ProjectsExplorerProps {
  onCreateAppClick?: () => void;
  onEditProject?: (project: Project) => void;
  authState?: AuthState;
  refreshTrigger?: number;
}

export function ProjectsExplorer({ onCreateAppClick, onEditProject, authState, refreshTrigger }: ProjectsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refresh projects when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchProjects();
    }
  }, [refreshTrigger]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch projects using the new unauthenticated endpoint
      const projectsData = await getProjects();
      
      // Debug logging - see what we get from the API
      console.log('Raw projects data from API:', projectsData);
      console.log('Number of projects:', projectsData?.length);
      if (projectsData?.length > 0) {
        console.log('First project raw data:', projectsData[0]);
        console.log('Available keys in first project:', Object.keys(projectsData[0]));
      }
      
      // Transform the data to match our Project interface
      const transformedProjects: Project[] = projectsData.map((project: any) => {
        const transformed = {
          id: project.id,
          name: project.name || project.id,
          description: project.description || 'No description available',
          githubUrl: project.githubUrl || project.github_url,
          productionUrl: project.productionUrl,
          users: project.users || 0,
          posts: project.posts,
          polls: project.polls,
          photos: project.photos,
          jobs: project.jobs,
          events: project.events,
          reviews: project.reviews,
          forks: project.forks || 0,
          category: project.category || 'Uncategorized',
          categories: project.categories || [],
          ownerId: project.ownerId,
          ...project // Include any additional fields
        };
        
        // Debug logging for each transformed project
        console.log(`Project ${project.id} transformation:`, {
          original: project,
          transformed: transformed,
          hasId: !!transformed.id,
          hasGithubUrl: !!transformed.githubUrl,
          hasProductionUrl: !!transformed.productionUrl,
          hasCategories: !!transformed.categories && transformed.categories.length > 0,
          categoriesValue: transformed.categories
        });
        
        return transformed;
      });
      
      console.log('Final transformed projects:', transformedProjects);
      setProjects(transformedProjects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (project.categories && project.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getStatIcon = (project: Project) => {
    if (project.posts) return IconFileText;
    if (project.polls) return IconFileText;
    if (project.photos) return IconFileText;
    if (project.jobs) return IconFileText;
    if (project.events) return IconFileText;
    if (project.reviews) return IconFileText;
    return IconFileText;
  };

  const getStatLabel = (project: Project) => {
    if (project.posts) return `${project.posts} posts`;
    if (project.polls) return `${project.polls} polls`;
    if (project.photos) return `${project.photos} photos`;
    if (project.jobs) return `${project.jobs} jobs`;
    if (project.events) return `${project.events} events`;
    if (project.reviews) return `${project.reviews} reviews`;
    return '0 items';
  };

  return (
    <Box py={rem(80)}>
      <Container size="xl">
        <Stack gap="xl">
          <Box ta="center">
            <Title order={2} size="h1" mb="md">
              Explore Apps
            </Title>
            <Text size="lg" c="dimmed" maw={600} mx="auto">
              Discover apps built by the Basebase community. Try any app and then click the &quot;edit this app&quot; button to start improving it.
            </Text>
          </Box>

          <Box maw={500} mx="auto">
            <Group gap="md" align="end">
              <TextInput
                size="lg"
                placeholder="Search apps..."
                leftSection={<IconSearch style={{ width: rem(20), height: rem(20) }} />}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                radius="xl"
                style={{ flex: 1 }}
              />
              <Button size="lg" radius="xl" onClick={onCreateAppClick}>
                Create App
              </Button>
            </Group>
          </Box>

          {loading && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader size="lg" />
                <Text c="dimmed">Loading projects...</Text>
              </Stack>
            </Center>
          )}

          {error && (
            <Alert variant="light" color="red" icon={<IconAlertCircle size={16} />}>
              {error}
              <Button variant="subtle" size="xs" onClick={fetchProjects} ml="auto">
                Retry
              </Button>
            </Alert>
          )}

          {!loading && !error && (
            <Grid>
              {filteredProjects.length === 0 && (
                <Grid.Col span={12}>
                  <Center py="xl">
                    <Text c="dimmed" ta="center">
                      {searchQuery ? 'No projects found matching your search.' : 'No projects available.'}
                    </Text>
                  </Center>
                </Grid.Col>
              )}
              
              {filteredProjects.map((project) => {
                const StatIcon = getStatIcon(project);
                
                return (
                  <Grid.Col key={project.id} span={{ base: 12, md: 6, lg: 4 }}>
                    <Card 
                      padding="lg" 
                      radius="lg" 
                      h="100%"
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Stack justify="space-between" h="100%">
                        <Box>
                          <Group justify="space-between" mb="xs" align="flex-start">
                            <Group gap="xs" align="center" style={{ flex: 1, minWidth: 0 }}>
                              <Title order={4} size="h3" style={{ wordBreak: 'break-word' }}>
                                {project.name}
                              </Title>
                              {authState?.isAuthenticated && 
                               authState.user?.id === project.ownerId && 
                               onEditProject && (
                                <Button
                                  variant="subtle"
                                  size="xs"
                                  p={0}
                                  style={{ width: rem(20), height: rem(20), flexShrink: 0 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditProject(project);
                                  }}
                                >
                                  <IconSettings size={14} />
                                </Button>
                              )}
                            </Group>
                            <Group gap="xs" style={{ flexShrink: 0 }}>
                              {project.categories && project.categories.length > 0 ? (
                                project.categories
                                  .filter(category => category.toLowerCase() !== 'uncategorized')
                                  .map((category, index) => (
                                    <Badge key={index} color="violet" variant="light" size="sm">
                                      {category}
                                    </Badge>
                                  ))
                              ) : project.category && project.category.toLowerCase() !== 'uncategorized' && (
                                <Badge color="violet" variant="light" size="sm">
                                  {project.category}
                                </Badge>
                              )}
                            </Group>
                          </Group>
                          
                          {project.productionUrl && (
                            <Text 
                              size="xs" 
                              c="violet.6" 
                              mb="sm" 
                              style={{ 
                                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Droid Sans Mono", "Liberation Mono", Consolas, "Courier New", monospace',
                                opacity: 0.8,
                                cursor: 'pointer',
                                textDecoration: 'none'
                              }}
                              component="a"
                              href={project.productionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {project.productionUrl.replace('https://', '').replace('http://', '')}
                            </Text>
                          )}
                          
                          <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.5 }}>
                            {project.description}
                          </Text>
                        </Box>

                        <Box>
                          <Group justify="space-between" gap="md" mb="md">
                            <Stack align="center" gap="xs" style={{ flex: 1 }}>
                              <Text size="lg" fw={700} lh={1}>
                                {(project.users || 0).toLocaleString()}
                              </Text>
                              <Group gap={4} align="center">
                                <IconUsers style={{ width: rem(12), height: rem(12) }} />
                                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                                  users
                                </Text>
                              </Group>
                            </Stack>
                            <Stack align="center" gap="xs" style={{ flex: 1 }}>
                              <Text size="lg" fw={700} lh={1}>
                                {Math.floor((project.users || 0) * 0.15)}
                              </Text>
                              <Group gap={4} align="center">
                                <IconUsersGroup style={{ width: rem(12), height: rem(12) }} />
                                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                                  vibe-coders
                                </Text>
                              </Group>
                            </Stack>
                            <Stack align="center" gap="xs" style={{ flex: 1 }}>
                              <Text size="lg" fw={700} lh={1}>
                                {project.forks || 0}
                              </Text>
                              <Group gap={4} align="center">
                                <IconGitFork style={{ width: rem(12), height: rem(12) }} />
                                <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                                  forks
                                </Text>
                              </Group>
                            </Stack>
                          </Group>

                          <Group gap="xs" style={{ display: 'flex', width: '100%' }}>
                            <Button 
                              variant="filled" 
                              radius="md"
                              size="sm"
                              style={{ flex: 1 }}
                              onClick={() => {
                                if (project.productionUrl) {
                                  window.open(project.productionUrl, '_blank');
                                }
                              }}
                              disabled={!project.productionUrl}
                            >
                              Go To App
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              radius="md"
                              style={{ width: rem(40), height: rem(32), padding: 0, flexShrink: 0 }}
                              onClick={() => {
                                if (project.githubUrl) {
                                  window.open(project.githubUrl, '_blank');
                                }
                              }}
                              disabled={!project.githubUrl}
                            >
                              <IconBrandGithub size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              radius="md"
                              style={{ width: rem(40), height: rem(32), padding: 0, flexShrink: 0 }}
                              onClick={() => {
                                if (authState?.token && project.githubUrl) {
                                  const editorUrl = `https://editor.basebase.ai/${project.id}?repo=${encodeURIComponent(project.githubUrl)}&token=${authState.token}`;
                                  window.open(editorUrl, '_blank');
                                }
                              }}
                              disabled={!authState?.token || !project.githubUrl}
                            >
                              <IconEdit size={16} />
                            </Button>
                          </Group>
                        </Box>
                      </Stack>
                    </Card>
                  </Grid.Col>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Container>

      <style jsx global>{`
        [data-mantine-color-scheme="dark"] {
          background-color: var(--mantine-color-dark-8) !important;
        }
      `}</style>
    </Box>
  );
} 