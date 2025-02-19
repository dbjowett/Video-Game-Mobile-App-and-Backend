import {
  ActionIcon,
  Anchor,
  Button,
  Checkbox,
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
import { IconX } from '@tabler/icons-react';
import { TwitterButton } from '../AuthButtons/AppleButton';
import { GoogleButton } from '../AuthButtons/GoogleButton';

type SocialProvider = 'google' | 'apple';

export const AuthModal = ({
  opened,
  toggleModal,
}: {
  opened: boolean;
  toggleModal: () => void;
}) => {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
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

    // curl -X POST http://localhost:3000/auth/login -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"/
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(form.values),
    });
    const data = await response.json();

    console.log('login', data);
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
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
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

            {type === 'register' && (
              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
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
