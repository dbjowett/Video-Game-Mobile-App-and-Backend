'use client';

import { Box, Card, Container, Flex, Grid, Stack, Text } from '@mantine/core';
import {
  IconHeart,
  IconSearch,
  IconStar,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { ReactNode, RefObject } from 'react';
import { JumboTitle } from '../JumboTitle';
import classes from './Features.module.css';

type Feature = {
  icon: ReactNode;
  title: string;
  description: ReactNode;
};

const FEATURES: Feature[] = [
  {
    icon: <IconSearch />,
    title: 'Search Games',
    description: 'Quickly search our extensive library using advanced filters and categories.',
  },
  {
    icon: <IconHeart />,
    title: 'Favourite Games',
    description: 'Mark your favourite titles and build a personalized game collection.',
  },
  {
    icon: <IconStar />,
    title: 'Review Games',
    description: 'Write detailed reviews and read community feedback to find your next adventure.',
  },
  {
    icon: <IconTrendingUp />,
    title: 'Trending Titles',
    description: 'Discover the most popular and buzz-worthy games in real time.',
  },
  {
    icon: <IconUsers />,
    title: 'Community Interaction',
    description: 'Engage with fellow gamers through discussions, forums, and live events.',
  },
  {
    icon: <IconTrophy />,
    title: 'Personalized Recommendations',
    description: 'Receive game suggestions tailored to your tastes and play history.',
  },
] as const;

export const FeaturesCell = ({
  icon,
  title,
  description,
  index = 1,
  iconSize,
}: Feature & {
  index?: number;
  iconSize?: number;
}) => (
  <motion.div
    initial={{ opacity: 0.0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 * index, ease: 'easeInOut' }}
    viewport={{ once: true }}
    style={{ height: '100%' }}
  >
    <motion.div
      whileHover={{ boxShadow: 'var(--mantine-shadow-xs)' }}
      style={{
        borderRadius: 'var(--mantine-radius-lg)',
        height: '100%',
      }}
    >
      <Card radius="lg" p="xl" className={classes.cell} h="100%">
        <Stack gap="xs">
          <Flex w={iconSize} h={iconSize} justify="center" align="center">
            {icon}
          </Flex>
          <Box>
            <Text fz="xl">{title}</Text>
            <Text fz="md" c="dimmed">
              {description}
            </Text>
          </Box>
        </Stack>
      </Card>
    </motion.div>
  </motion.div>
);

type FeatureProps = {
  title?: string;
  features?: Feature[];
  iconSize?: number;
  ref?: RefObject<HTMLDivElement | null>;
};

export const Features = ({
  ref,
  title = 'Features',
  features = FEATURES,
  iconSize = 20,
}: FeatureProps) => (
  <Container
    style={{ alignContent: 'center' }}
    ref={ref}
    bg="var(--mantine-color-body)"
    py={{
      base: 'calc(var(--mantine-spacing-lg) * 4)',
      xs: 'calc(var(--mantine-spacing-lg) * 5)',
      lg: 'calc(var(--mantine-spacing-lg) * 6)',
    }}
    h="100svh"
    fluid
  >
    <Container size="lg" px={0}>
      <JumboTitle order={2} fz="md" style={{ textWrap: 'balance' }}>
        {title}
      </JumboTitle>
    </Container>
    <Container size="lg" p={0} mt="xl">
      <Grid gutter="xl">
        {features.map((feature, index) => (
          <Grid.Col key={feature.title} span={{ base: 12, xs: 6, md: 4 }} mih="100%">
            <FeaturesCell
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              iconSize={iconSize}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  </Container>
);
