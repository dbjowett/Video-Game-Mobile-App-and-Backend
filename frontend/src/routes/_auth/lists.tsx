import { Card, Container, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'motion/react';

import { useGetLists } from '../../hooks/useGetLists';
import { imageLoader } from '../../utils/imageLoader';

export const Route = createFileRoute('/_auth/lists')({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: lists } = useGetLists();

  return (
    <Container size="xl" py="lg">
      <Stack gap="lg">
        <Title order={3}>Game Lists</Title>

        {lists?.length === 0 ? (
          <Text c="dimmed">No game lists yet</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="lg">
            {lists?.map((list) => (
              <motion.div key={list.id} whileHover={{ y: -4 }} transition={{ duration: 0.15 }}>
                <Card radius="lg" p={0} withBorder style={{ overflow: 'hidden' }}>
                  <Card.Section>
                    <SimpleGrid cols={2} spacing={2}>
                      {list.items.slice(0, 4).map((item) => (
                        <Image
                          key={item.gameId}
                          src={imageLoader({ imgSrc: item.gameCoverUrl, quality: 3 })}
                          h={100}
                          fit="cover"
                        />
                      ))}
                    </SimpleGrid>
                  </Card.Section>
                  <Stack gap={4} p="md">
                    <Text fw={600} lineClamp={1}>
                      {list.title}
                    </Text>
                    {list.description ? (
                      <Text fz="sm" c="dimmed" lineClamp={2}>
                        {list.description}
                      </Text>
                    ) : null}
                  </Stack>
                </Card>
              </motion.div>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
