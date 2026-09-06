import { Card, Flex, Skeleton, Stack } from '@mantine/core';

import { GameCardVariant } from '../../utils/gameCard';

interface GameCardSkeletonProps {
  variant?: GameCardVariant;
}

export const GameCardSkeleton = ({ variant = 'default' }: GameCardSkeletonProps) => {
  const isFeature = variant === 'feature';
  const isCompact = variant === 'compact';

  if (isFeature) {
    return (
      <Card radius="lg" p="xs" w={200}>
        <Card.Section>
          <Skeleton height={280} radius="md" />
        </Card.Section>
        <Stack gap={6} mt="xs">
          <Skeleton height={14} width="70%" />
          <Skeleton height={10} width="40%" />
        </Stack>
      </Card>
    );
  }

  return (
    <Card radius="lg" p="sm">
      <Flex gap="md" align="center">
        <Skeleton
          height={isCompact ? 52 : 120}
          width={isCompact ? 52 : 88}
          radius={isCompact ? 'xl' : 'md'}
        />
        <Stack gap={6} style={{ flex: 1 }}>
          <Skeleton height={14} width="60%" />
          <Skeleton height={10} width="40%" />
          <Skeleton height={10} width="50%" />
        </Stack>
      </Flex>
    </Card>
  );
};
