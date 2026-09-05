import { Badge, Card, Flex, Image, Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';

import { GameCardModel, GameCardVariant } from '../../utils/gameCard';
import { imageLoader } from '../../utils/imageLoader';

interface GameCardProps {
  game: GameCardModel;
  variant?: GameCardVariant;
  onClick?: () => void;
  rightAccessory?: ReactNode;
  footer?: ReactNode;
}

export const GameCard = ({ game, variant = 'default', onClick, rightAccessory }: GameCardProps) => {
  const isFeature = variant === 'feature';
  const isCompact = variant === 'compact';
  const cover = imageLoader({ imgSrc: game.imageUrl ?? '', quality: isCompact ? 2 : 6 });

  if (isFeature) {
    return (
      <Card
        radius="lg"
        p="xs"
        w={200}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : undefined }}
      >
        <Card.Section>
          <Image src={cover} alt={game.title} h={280} fit="cover" radius="md" />
        </Card.Section>
        <Stack gap={2} mt="xs">
          <Flex justify="space-between" align="flex-start" gap="xs">
            <Text fz="md" fw={600} lineClamp={2} style={{ flex: 1 }}>
              {game.title}
            </Text>
            {game.badge ? (
              <Badge size="sm" radius="xl">
                {game.badge}
              </Badge>
            ) : null}
          </Flex>
          {game.subtitle ? (
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {game.subtitle}
            </Text>
          ) : null}
          {game.meta ? (
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {game.meta}
            </Text>
          ) : null}
        </Stack>
      </Card>
    );
  }

  return (
    <Card radius="lg" p="sm" onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <Flex gap="md" align="center">
        <Image
          src={cover}
          alt={game.title}
          w={isCompact ? 52 : 88}
          h={isCompact ? 52 : 120}
          fit="cover"
          radius={isCompact ? 'xl' : 'md'}
        />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Flex justify="space-between" align="flex-start" gap="xs">
            <Text fz={isCompact ? 'sm' : 'md'} fw={600} lineClamp={1} style={{ flex: 1 }}>
              {game.title}
            </Text>
            {game.badge ? (
              <Badge size="sm" radius="xl">
                {game.badge}
              </Badge>
            ) : null}
            {game.badge ? null : rightAccessory}
          </Flex>
          {game.subtitle ? (
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {game.subtitle}
            </Text>
          ) : null}
          {game.meta ? (
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {game.meta}
            </Text>
          ) : null}
        </Stack>
      </Flex>
    </Card>
  );
};

export default GameCard;
