import { Badge, Container, Group, Image, Loader, Stack, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

import { useGameDetails } from '../../../hooks/useGameDetails';
import { imageLoader } from '../../../utils/imageLoader';

export const Route = createFileRoute('/_auth/games/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: game, isPending, isError } = useGameDetails(id);

  if (isPending) {
    return (
      <Container size="sm" py="xl">
        <Group justify="center">
          <Loader />
        </Group>
      </Container>
    );
  }

  if (isError || !game) {
    return (
      <Container size="sm" py="xl">
        <Text c="dimmed">Could not load this game.</Text>
      </Container>
    );
  }

  return (
    <Container size="sm" py="lg">
      <Stack gap="md">
        <Image
          src={imageLoader({ imgSrc: game.cover?.url ?? '', quality: 6 })}
          radius="lg"
          h={360}
          fit="cover"
        />
        <Group justify="space-between" align="flex-start">
          <Title order={2}>{game.name}</Title>
          {game.total_rating ? <Badge size="lg">{Math.trunc(game.total_rating)}%</Badge> : null}
        </Group>
        <Text>{game.summary}</Text>

        {game.completionTimes ? (
          <Group gap="lg">
            {game.completionTimes.mainStory ? (
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Main Story
                </Text>
                <Text fw={600}>{game.completionTimes.mainStory}h</Text>
              </Stack>
            ) : null}
            {game.completionTimes.mainExtra ? (
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Main + Extra
                </Text>
                <Text fw={600}>{game.completionTimes.mainExtra}h</Text>
              </Stack>
            ) : null}
            {game.completionTimes.completionist ? (
              <Stack gap={0}>
                <Text fz="xs" c="dimmed">
                  Completionist
                </Text>
                <Text fw={600}>{game.completionTimes.completionist}h</Text>
              </Stack>
            ) : null}
          </Group>
        ) : null}
      </Stack>
    </Container>
  );
}
