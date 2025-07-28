'use client';

import { useState } from 'react';
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
} from '@mantine/core';
import { IconSearch, IconUsers, IconFileText, IconStar, IconBrandGithub, IconEdit, IconUsersGroup, IconGitFork } from '@tabler/icons-react';

interface Project {
  id: string;
  name: string;
  description: string;
  users: number;
  posts?: number;
  polls?: number;
  photos?: number;
  jobs?: number;
  events?: number;
  reviews?: number;
  forks: number;
  category: string;
}

const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'NewswithFriends',
    description: 'Social news sharing with real-time discussions and friend recommendations',
    users: 1200,
    posts: 340,
    forks: 45,
    category: 'Social',
  },
  {
    id: '2',
    name: 'QuickPoll',
    description: 'Create and share polls instantly with the existing user community',
    users: 890,
    polls: 156,
    forks: 23,
    category: 'Utilities',
  },
  {
    id: '3',
    name: 'PhotoFeed',
    description: 'Instagram-style photo sharing with BaseBase\'s social graph',
    users: 2100,
    photos: 980,
    forks: 67,
    category: 'Social',
  },
  {
    id: '4',
    name: 'DevJobs',
    description: 'Job board for developers with integrated social networking',
    users: 756,
    jobs: 89,
    forks: 34,
    category: 'Professional',
  },
  {
    id: '5',
    name: 'EventMeet',
    description: 'Local event discovery leveraging BaseBase\'s user connections',
    users: 1500,
    events: 127,
    forks: 56,
    category: 'Events',
  },
  {
    id: '6',
    name: 'CodeReview',
    description: 'Peer code review platform with social features',
    users: 643,
    reviews: 234,
    forks: 29,
    category: 'Developer Tools',
  },
];

export function ProjectsExplorer() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = sampleProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
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
              Discover apps built by the BaseBase community. Try any app and then click the "edit this app" button to start improving it.
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
              <Button size="lg" radius="xl">
                Create App
              </Button>
            </Group>
          </Box>

          <Grid>
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
                        <Group justify="space-between" mb="xs">
                          <Title order={4} size="h3">
                            {project.name}
                          </Title>
                          <Badge color="violet" variant="light" size="sm">
                            {project.category}
                          </Badge>
                        </Group>
                        
                        <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.5 }}>
                          {project.description}
                        </Text>
                      </Box>

                      <Box>
                        <Group justify="space-between" gap="md" mb="md">
                          <Stack align="center" gap="xs" style={{ flex: 1 }}>
                            <Text size="lg" fw={700} lh={1}>
                              {project.users.toLocaleString()}
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
                              {Math.floor(project.users * 0.15)}
                            </Text>
                            <Group gap={4} align="center">
                              <IconUsersGroup style={{ width: rem(12), height: rem(12) }} />
                              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                                contributors
                              </Text>
                            </Group>
                          </Stack>
                          <Stack align="center" gap="xs" style={{ flex: 1 }}>
                            <Text size="lg" fw={700} lh={1}>
                              {project.forks}
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
                          >
                            Try App
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            radius="md"
                            style={{ width: rem(40), height: rem(32), padding: 0, flexShrink: 0 }}
                          >
                            <IconBrandGithub size={16} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            radius="md"
                            style={{ width: rem(40), height: rem(32), padding: 0, flexShrink: 0 }}
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