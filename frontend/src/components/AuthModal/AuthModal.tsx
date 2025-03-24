import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { TwitterButton } from '../AuthButtons/AppleButton';
import { GoogleButton } from '../AuthButtons/GoogleButton';

type SocialProvider = 'google' | 'apple';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

export const AuthModal = ({
  opened,
  toggleModal,
}: {
  opened: boolean;
  toggleModal: () => void;
}) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const navigate = useNavigate({ from: '/' });

  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const toCapitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    console.log('provider', provider);
  };

  const handleLogin = async () => {
    // POST to /auth/login

    // TODO: Call signup if user
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.values),
    });
    const data = await response.json();

    if (data?.access_token) {
      localStorage.setItem('token', data.access_token);
      toggleModal();
      notifications.show({
        title: 'Successfully logged in!',
        message: '',
      });

      await sleep(1000);
      navigate({ to: '/about' });
    } else {
      notifications.show({
        title: 'Error',
        message: 'Invalid credentials',
        color: 'red',
      });
    }
  };

  const handleRegister = () => {
    console.log('register');
  };

  return (
    <Modal opened={opened} onClose={toggleModal} withCloseButton={false} centered>
      <Paper p="md">
        <Flex justify="space-between">
          <Flex direction="column" gap="xs">
            <Text size="xl" fw={500}>
              Ready to find your next game?
            </Text>
            <Text size="md" fw={500}>
              {toCapitalize(type)} with:
            </Text>
          </Flex>
          <ActionIcon variant="transparent" onClick={toggleModal}>
            <IconX size={24} />
          </ActionIcon>
        </Flex>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl" onClick={() => handleSocialLogin('google')}>
            Google
          </GoogleButton>
          <TwitterButton radius="xl" onClick={() => handleSocialLogin('apple')}>
            Apple
          </TwitterButton>
        </Group>

        <Divider label="Or continue with email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(type === 'register' ? handleRegister : handleLogin)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Username"
                placeholder="Your username"
                value={form.values.username}
                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@email.com"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Invalid email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password && 'Password should include at least 6 characters'}
              radius="md"
            />

            {/* {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )} */}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
              {type === 'register'
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Modal>
  );
};
