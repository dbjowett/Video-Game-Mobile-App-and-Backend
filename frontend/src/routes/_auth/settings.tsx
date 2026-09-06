import { Button, Container, Loader, Stack, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { DEFAULT_PLATFORM_IDS } from '@vg/types';
import { useEffect, useState } from 'react';

import { PlatformPicker } from '../../components/PlatformPicker/PlatformPicker';
import { useUpdateUserPlatforms } from '../../hooks/useUpdateUserPlatforms';
import { useUser } from '../../utils/auth';

export const Route = createFileRoute('/_auth/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isPending } = useUser();
  const [platformIds, setPlatformIds] = useState<number[]>([]);
  const { mutate: savePlatforms, isPending: isSaving } = useUpdateUserPlatforms();

  useEffect(() => {
    if (!user) return;
    const initialPlatformIds =
      user.preferredPlatformIds.length > 0 ? user.preferredPlatformIds : DEFAULT_PLATFORM_IDS;
    // oxlint-disable-next-line react/set-state-in-effect -- seeds editable local state once server data loads
    setPlatformIds(initialPlatformIds);
  }, [user]);

  if (isPending) {
    return (
      <Container size="sm" py="xl">
        <Loader />
      </Container>
    );
  }

  return (
    <Container size="sm" py="lg">
      <Stack gap="lg">
        <Title order={3}>Settings</Title>

        <Stack gap="sm">
          <Text fw={600}>Platforms</Text>
          <Text fz="sm" c="dimmed">
            Choose which platforms show up on Explore and Upcoming.
          </Text>
          <PlatformPicker value={platformIds} onChange={setPlatformIds} />
        </Stack>

        <Button
          onClick={() => savePlatforms(platformIds)}
          loading={isSaving}
          style={{ alignSelf: 'flex-start' }}
        >
          Save
        </Button>
      </Stack>
    </Container>
  );
}
