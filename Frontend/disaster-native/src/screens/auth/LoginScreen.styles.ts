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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  brandText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.wide,
  },
  card: {
    backgroundColor: 'rgba(11,33,23,0.92)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: Spacing.xxl,
  },
  cardBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + 2,
    marginBottom: Spacing.xl,
  },
  cardBrandText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textMuted,
    letterSpacing: Typography.letterSpacing.widest,
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  eyeBtn: {
    padding: Spacing.sm + 2,
  },
  eyeIcon: {
    fontSize: Typography.fontSize.xl,
  },
  forgotLink: {
    marginBottom: Spacing.xl,
  },
  forgotText: {
    color: Colors.gold,
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.medium,
  },
  btnPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md + 3,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  btnPrimaryText: {
    color: '#102419',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
  footerNote: {
    textAlign: 'center',
    fontSize: Typography.fontSize.xs,
    color: 'rgba(143,169,140,0.8)',
    marginTop: Spacing.xl,
  },
});
