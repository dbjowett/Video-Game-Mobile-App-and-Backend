import { spacing } from '@/theme/constants/spacing';
import { StyleProp, ViewStyle } from 'react-native';

const pad = spacing.xs / 2;

type LayoutKey = 1 | 2 | 3 | 4;

const layouts: Record<LayoutKey, Array<ViewStyle>> = {
  // [0]
  1: [{ width: '100%', aspectRatio: 1 }],

  // [0, 1]
  2: [
    { paddingRight: pad, width: '50%', aspectRatio: 1 },
    { paddingLeft: pad, width: '50%', aspectRatio: 1 },
  ],
  // [ 0 ]
  // [1, 2]
  3: [
    { paddingBottom: pad, width: '100%', aspectRatio: 2 },
    { paddingRight: pad, width: '50%', aspectRatio: 1 },
    { paddingLeft: pad, width: '50%', aspectRatio: 1 },
  ],
  // [0, 1]
  // [2, 3]
  4: [
    { paddingBottom: pad, paddingRight: pad, width: '50%', aspectRatio: 1 },
    { paddingBottom: pad, paddingLeft: pad, width: '50%', aspectRatio: 1 },
    { paddingTop: pad, paddingRight: pad, width: '50%', aspectRatio: 1 },
    { paddingTop: pad, paddingLeft: pad, width: '50%', aspectRatio: 1 },
  ],
};

export const getImageWrapStyle = (
  count: number,
  index: number,
): StyleProp<ViewStyle> => {
  const layoutKey: LayoutKey = count <= 4 ? (count as LayoutKey) : 4;
  return layouts[layoutKey][index] ?? {};
};
