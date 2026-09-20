import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 60,
    paddingBottom: Spacing.huge,
  },
  backBtn: {
    marginBottom: Spacing.xxl,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  card: {
    backgroundColor: 'rgba(11,33,23,0.95)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: Spacing.xxl,
  },
  govtBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.4)',
    backgroundColor: 'rgba(74,222,128,0.08)',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm - 1,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg + 2,
  },
  govtDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  govtBadgeText: {
    color: '#4ade80',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  cardTitle: {
    fontSize: Typography.fontSize.h3,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardSubtitle: {
    fontSize: Typography.fontSize.base - 1,
    color: Colors.textMuted,
    marginBottom: Spacing.xxl,
    lineHeight: 20,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
  },
  input: {
    backgroundColor: 'rgba(23,49,35,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 1,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  submitBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md + 3,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  submitBtnText: {
    color: '#102419',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: Typography.fontSize.base - 1,
    color: '#8FA98C',
  },
  switchLink: {
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.gold,
  },
});
