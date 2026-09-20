import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPanel,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: Typography.fontSize.h2 - 2,
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  locationRow: {
    marginTop: Spacing.xs + 2,
    gap: Spacing.xs,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4CAF6D',
  },
  syncText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  aiBtn: {
    backgroundColor: 'rgba(56,224,123,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56,224,123,0.4)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: Spacing.sm,
  },
  aiBtnText: {
    color: Colors.greenBright,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  spacer: {
    height: Spacing.lg,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.md,
  },
  errorCard: {
    margin: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(231,76,60,0.3)',
    backgroundColor: 'rgba(127,0,0,0.2)',
    padding: Spacing.xxl,
  },
  errorTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: '#f87171',
    marginBottom: Spacing.sm,
  },
  errorBody: {
    fontSize: Typography.fontSize.base - 1,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  retryBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.sm + 2,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  retryText: {
    color: '#102419',
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.base,
  },
});
