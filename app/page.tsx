'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Button,
  TextInput,
  Stack,
  Paper,
  Group,
  Alert,
  Modal,
  Center,
  Loader,
} from '@mantine/core';
import {
  getAuthState,
  onAuthStateChanged,
  requestCode,
  verifyCode,
  signOut,
  type AuthState,
} from 'basebase-js';
import { appConfig } from '../config';

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
    // Get initial auth state
    const initialAuthState = getAuthState();
    setAuthState(initialAuthState);

    // Listen for auth state changes
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

  const handleSignIn = () => {
    setShowAuthModal(true);
    setError('');
  };

  const handleRequestCode = async () => {
    if (!username.trim() || !phone.trim()) {
      setError('Please enter both username and phone number');
      return;
    }

    // Validate username (alphanumeric only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username must contain only letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await requestCode(username.trim(), phone.trim());
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
      console.log('Auth result received:', authResult);
      
      // Manually update auth state since verifyCode() might not trigger onAuthStateChanged immediately
      const newAuthState = {
        isAuthenticated: true,
        user: authResult.user,
        project: authResult.project,
        token: authResult.token
      };
      console.log('Setting auth state to:', newAuthState);
      setAuthState(newAuthState);
      
      // Also manually close modal and reset form
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
    // Manually update auth state since signOut() might not trigger onAuthStateChanged immediately
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

  const handleBackToPhone = () => {
    setAuthStep('phone');
    setCode('');
    setError('');
  };

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Stack align="center" gap="xl">
        <Title order={1} size="h1" ta="center">
          {appConfig.name}
        </Title>
        <Text size="lg" ta="center" c="dimmed">
          {appConfig.description}
        </Text>

        {authState.isAuthenticated ? (
          <Paper p="xl" shadow="sm" radius="md" withBorder>
            <Stack align="center" gap="md">
              <Text size="lg" fw={500}>
                Signed in as {authState.user?.name}
              </Text>
              <Text size="sm" c="dimmed">
                Phone: {authState.user?.phone}
              </Text>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Button onClick={handleSignIn} size="lg">
            Sign In
          </Button>
        )}

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
                <Text size="xs" c="dimmed" ta="center">
                  Using project: {appConfig.defaultProjectId}
                </Text>
                {error && (
                  <Alert color="red" variant="light">
                    {error}
                  </Alert>
                )}
                <Group justify="apart">
                  <Button variant="outline" onClick={handleBackToPhone}>
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
      </Stack>
    </Center>
  );
}
