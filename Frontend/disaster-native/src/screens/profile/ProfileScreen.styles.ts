import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPanel,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  profileHero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl + 4,
    borderRadius: Radius.xl,
    backgroundColor: 'rgba(11,33,23,0.9)',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56,224,123,0.2)',
    borderWidth: 2,
    borderColor: Colors.greenBright,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.greenBright,
  },
  profileName: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  citizenBadge: {
    backgroundColor: 'rgba(56,224,123,0.12)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(56,224,123,0.3)',
    paddingHorizontal: Spacing.lg - 2,
    paddingVertical: Spacing.xs + 1,
  },
  citizenBadgeText: {
    color: Colors.greenBright,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  card: {
    backgroundColor: 'rgba(11,33,23,0.9)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg + 2,
    marginBottom: Spacing.base,
  },
  cardLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingBottom: Spacing.base,
    marginBottom: Spacing.base,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  infoIcon: {
    fontSize: Typography.fontSize.xl,
    marginTop: Spacing.xxs,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.xxs,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.base,
    marginBottom: Spacing.base,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  callIcon: {
    fontSize: Typography.fontSize.xxl,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    fontSize: Typography.fontSize.base - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  callNum: {
    fontSize: Typography.fontSize.xl,
    color: Colors.gold,
    fontWeight: Typography.fontWeight.extraBold,
  },
  callArrow: {
    color: Colors.gold,
    fontSize: Typography.fontSize.xl,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.base || Radius.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: Spacing.xs,
  },
  logoutText: {
    color: '#f87171',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semiBold,
  },
});
