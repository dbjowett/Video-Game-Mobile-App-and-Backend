// COLLAPSE_DURATION, routeVariants, SIDEBAR_WIDTH

import { Variants } from 'motion/react';

export const SIDEBAR_WIDTH = 260;
export const COLLAPSE_DURATION = 0.3;

const transition = {
  duration: COLLAPSE_DURATION,
  type: 'tween',
  ease: 'easeInOut',
};

export const routeVariants: Variants = {
  hidden: {
    x: -SIDEBAR_WIDTH * 1.2,
    transition,
  },
  visible: {
    x: 0,
    transition,
  },
};
