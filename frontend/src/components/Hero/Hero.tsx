import {
  Badge,
  Box,
  Button,
  Container,
  ContainerProps,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';

import { motion } from 'motion/react';

import { IconArrowRight } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { JumboTitle } from '../JumboTitle';
import classes from './Hero.module.css';

type ImageItem = { src: string; alt: string };

type HeroProps = ContainerProps & {
  isLoggedIn: boolean;
  imageGridItems: ImageItem[][];
  imageGridItemSize?: { width: number; height: number };
  badge?: string;
  title?: string;
  onSignUpClick?: () => void;
  scrollToFeatures?: () => void;
  description?: string;
  callToAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
};
export const Hero = ({
  isLoggedIn,
  badge = 'Find your next favourite game',
  scrollToFeatures,
  title = 'Discover the Best Games',
  onSignUpClick,
  description = 'Explore a vast library of the best games, find your next favourite game, and join the community.',
  callToAction = {
    label: 'Sign Up',
    href: '/signup',
  },
  secondaryAction = {
    label: 'Learn More',
    href: '#',
  },
  imageGridItems,
  imageGridItemSize = { width: 200, height: 300 },
  ...containerProps
}: HeroProps) => (
  <Container bg="var(--mantine-color-body)" px={0} style={{ overflow: 'hidden' }} fluid>
    <Container component="section" h="100vh" mah={950} pos="relative" size="xl" {...containerProps}>
      <Box
        pos="absolute"
        top={0}
        left={0}
        h="100%"
        w="100%"
        className={classes['horizontal-backdrop']}
        visibleFrom="md"
      />
      <Box
        pos="absolute"
        top={0}
        left={0}
        h="100%"
        w="100%"
        className={classes['vertical-backdrop']}
      />
      <Box
        pos="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        h="100%"
        w="100%"
        bg="var(--mantine-color-body)"
        style={{ zIndex: 1 }}
        opacity={0.85}
        hiddenFrom="md"
      />
      <Flex h="100%" align="center" pos="relative">
        <Stack maw="var(--mantine-breakpoint-sm)" gap="lg" style={{ zIndex: 10 }}>
          {badge && (
            <motion.div
              initial={{ opacity: 0.0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1 }}
            >
              <Badge variant="light" size="xl" mb="lg">
                {badge}
              </Badge>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            viewport={{ once: true }}
          >
            <JumboTitle order={1} fz="lg" style={{ textWrap: 'balance' }}>
              {title}
            </JumboTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0.0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeInOut' }}
            viewport={{ once: true }}
          >
            <Text fz="xl" c="dimmed" style={{ textWrap: 'balance' }}>
              {description}
            </Text>
          </motion.div>
          <Group mt="lg">
            <motion.div
              initial={{ opacity: 0.0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  component={Link}
                  onClick={onSignUpClick}
                  radius="xl"
                  size="lg"
                  className={classes.cta}
                  rightSection={<IconArrowRight />}
                >
                  {isLoggedIn ? 'Go to Dashboard' : callToAction.label}
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0.0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <Button size="lg" variant="transparent" onClick={scrollToFeatures}>
                {secondaryAction.label}
              </Button>
            </motion.div>
          </Group>
        </Stack>
      </Flex>
      <Grid
        gutter="lg"
        w={imageGridItemSize.width * 3 + 60}
        pos="absolute"
        top={0}
        right={-30}
        style={{ transform: 'rotate(8deg)', flexShrink: 0 }}
      >
        {imageGridItems.map((gridItemsColumn, rowIndex) => (
          <Grid.Col span={Math.floor(12 / imageGridItems.length)} key={rowIndex}>
            <Stack gap="md">
              {gridItemsColumn.map((gridItem, itemIndex) => (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: itemIndex * 0.2, ease: 'easeInOut' }}
                  viewport={{ once: true }}
                  key={itemIndex}
                >
                  <Image
                    width={imageGridItemSize.width}
                    height={imageGridItemSize.height}
                    key={itemIndex}
                    src={gridItem.src}
                    alt={gridItem.alt}
                    radius="lg"
                    style={{ objectFit: 'cover', flexShrink: 0 }}
                  />
                </motion.div>
              ))}
            </Stack>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  </Container>
);
