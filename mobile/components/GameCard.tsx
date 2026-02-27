import { AppText } from '@/components/Themed';
import { IgdbImage } from '@/components/IgdbImage';
import { radius } from '@/theme/constants/radius';
import { spacing } from '@/theme/constants/spacing';
import { useTheme } from '@/theme/theme-context';
import { GameCardModel, GameCardVariant } from '@/utils/gameCard';
import React, { ReactNode } from 'react';
import {
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface GameCardProps {
  game: GameCardModel;
  variant?: GameCardVariant;
  onPress?: () => void;
  rightAccessory?: ReactNode;
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export default function GameCard({
  game,
  variant = 'default',
  onPress,
  rightAccessory,
  footer,
  style,
  imageStyle,
}: GameCardProps) {
  const { colors, shadows } = useTheme();
  const isFeature = variant === 'feature';
  const isCompact = variant === 'compact';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.baseCard,
        shadows.sm,
        isFeature ? styles.featureCard : styles.rowCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
        style,
      ]}
    >
      <View style={isFeature ? styles.featureMediaWrap : styles.rowMediaWrap}>
        <IgdbImage
          imgSrc={game.imageUrl || ''}
          quality={isCompact ? 2 : 6}
          style={[
            styles.imageBase,
            isFeature
              ? styles.featureImage
              : isCompact
                ? styles.compactImage
                : styles.defaultImage,
            { borderColor: colors.borderStrong },
            imageStyle,
          ]}
        />
      </View>

      <View style={[styles.content, isFeature && styles.featureContent]}>
        <View style={styles.topRow}>
          <AppText
            numberOfLines={isFeature ? 2 : 1}
            style={[
              styles.title,
              isCompact && styles.compactTitle,
              isFeature && styles.featureTitle,
            ]}
          >
            {game.title}
          </AppText>

          {!isFeature && game.badge ? (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
            >
              <AppText style={[styles.badgeText, { color: colors.textOnPrimary }]}>
                {game.badge}
              </AppText>
            </View>
          ) : null}

          {!isFeature && !game.badge ? rightAccessory : null}
        </View>

        {game.subtitle ? (
          <AppText
            numberOfLines={isFeature ? 2 : 1}
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            {game.subtitle}
          </AppText>
        ) : null}

        {(game.meta || game.badge || rightAccessory) && isFeature ? (
          <View style={styles.featureMetaRow}>
            {game.badge ? (
              <View
                style={[
                  styles.featureBadge,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <AppText style={styles.featureBadgeText}>{game.badge}</AppText>
              </View>
            ) : null}

            {game.meta ? (
              <AppText
                numberOfLines={1}
                style={[styles.meta, { color: colors.textSecondary }]}
              >
                {game.meta}
              </AppText>
            ) : null}

            {rightAccessory}
          </View>
        ) : null}

        {game.meta && !isFeature ? (
          <AppText numberOfLines={1} style={[styles.meta, { color: colors.textSecondary }]}>
            {game.meta}
          </AppText>
        ) : null}

        {footer}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseCard: {
    borderWidth: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.sm,
    gap: spacing.md,
  },
  featureCard: {
    width: 200,
    padding: spacing.xs,
    gap: spacing.sm,
  },
  rowMediaWrap: {
    flexShrink: 0,
  },
  featureMediaWrap: {
    width: '100%',
  },
  imageBase: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#00000010',
  },
  defaultImage: {
    width: 88,
    height: 120,
  },
  compactImage: {
    width: 52,
    height: 52,
    borderRadius: radius.round,
  },
  featureImage: {
    width: '100%',
    height: 280,
    borderRadius: radius.md,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  featureContent: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  compactTitle: {
    fontSize: 16,
  },
  featureTitle: {
    fontSize: 17,
  },
  subtitle: {
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
  },
  badge: {
    minWidth: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.round,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  featureMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureBadge: {
    borderWidth: 1,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  featureBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
