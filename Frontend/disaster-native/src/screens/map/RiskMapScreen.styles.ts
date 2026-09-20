import { StyleSheet } from 'react-native';
import { Colors, Shadows } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: 'rgba(7,20,14,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorOverlay: {
    backgroundColor: 'rgba(50,0,0,0.7)',
  },
  overlayText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.base,
  },
  errorText: {
    color: '#f87171',
    fontSize: Typography.fontSize.base,
  },
  layerBar: {
    position: 'absolute',
    top: Spacing.lg,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
  },
  layerScroll: {
    gap: Spacing.sm,
  },
  layerChip: {
    backgroundColor: 'rgba(15,29,20,0.9)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.sm,
  },
  layerChipActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  layerChipText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  layerChipTextActive: {
    color: '#102419',
  },
  locateBtn: {
    position: 'absolute',
    bottom: 120,
    right: Spacing.lg,
    backgroundColor: 'rgba(15,29,20,0.95)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.sm + 2,
    ...Shadows.card,
  },
  locateBtnText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  legend: {
    position: 'absolute',
    bottom: 120,
    left: Spacing.lg,
    backgroundColor: 'rgba(15,29,20,0.95)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: Spacing.sm + 2,
    gap: Spacing.xs + 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    textTransform: 'capitalize',
  },
  timestampBadge: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    backgroundColor: 'rgba(15,29,20,0.92)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.sm - 1,
  },
  timestampDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.greenBright,
  },
  timestampText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  callout: {
    padding: Spacing.sm,
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.bold,
    color: '#102419',
    marginBottom: Spacing.xxs,
  },
  calloutSub: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: '#333',
    marginBottom: Spacing.xxs,
  },
  calloutDesc: {
    fontSize: Typography.fontSize.xs,
    color: '#555',
    lineHeight: 16,
  },
});
