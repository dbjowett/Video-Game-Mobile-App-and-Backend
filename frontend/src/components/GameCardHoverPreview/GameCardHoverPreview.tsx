import { Group, HoverCard, Stack, Text } from '@mantine/core';
import { ListGame } from '@vg/types';
import dayjs from 'dayjs';

import { GameCardModel, GameCardVariant } from '../../utils/gameCard';
import { GameCard } from '../GameCard/GameCard';

interface GameCardHoverPreviewProps {
  game: ListGame;
  cardModel: GameCardModel;
  variant?: GameCardVariant;
  onClick?: () => void;
}

export const GameCardHoverPreview = ({
  game,
  cardModel,
  variant,
  onClick,
}: GameCardHoverPreviewProps) => (
  <HoverCard width={260} shadow="md" openDelay={300} position="top" withArrow>
    <HoverCard.Target>
      <div>
        <GameCard game={cardModel} variant={variant} onClick={onClick} />
      </div>
    </HoverCard.Target>
    <HoverCard.Dropdown>
      <Stack gap={4}>
        <Text fw={600}>{game.name}</Text>
        {game.total_rating ? (
          <Text fz="sm" c="dimmed">
            Rating: {Math.trunc(game.total_rating)}%
          </Text>
        ) : null}
        {game.first_release_date ? (
          <Text fz="sm" c="dimmed">
            Releases {dayjs.unix(game.first_release_date).format('MMM D, YYYY')}
          </Text>
        ) : null}
        {game.platforms?.length ? (
          <Group gap={4}>
            {game.platforms.map((platform) => (
              <Text key={platform.id} fz="xs" c="dimmed">
                {platform.name}
              </Text>
            ))}
          </Group>
        ) : null}
      </Stack>
    </HoverCard.Dropdown>
  </HoverCard>
);
