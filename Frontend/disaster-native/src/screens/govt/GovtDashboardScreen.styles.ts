import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, Radius } from '../../theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07140E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 54,
    paddingBottom: Spacing.md + 2,
    backgroundColor: '#0B1A12',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
  headerBrand: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#F4F1E8',
  },
  headerBadge: {
    backgroundColor: 'rgba(26,58,42,1)',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  headerBadgeText: {
    color: '#4ade80',
    fontSize: Typography.fontSize.xs - 1,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
  },
  logoutBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.sm + 2,
  },
  logoutText: {
    color: '#f87171',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  welcomeTitle: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.extraBold,
    color: '#F4F1E8',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  welcomeSub: {
    fontSize: Typography.fontSize.base - 1,
    color: '#A9B9A8',
    marginBottom: Spacing.xl,
  },
  infoCards: {
    gap: Spacing.sm + 2,
    marginBottom: Spacing.xxl,
  },
  infoCard: {
    backgroundColor: 'rgba(11,33,23,0.7)',
    borderRadius: Radius.base || Radius.md,
    borderWidth: 1,
    borderColor: '#223B29',
    padding: Spacing.lg,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs + 2,
  },
  infoCardIcon: {
    fontSize: Typography.fontSize.xl,
  },
  infoCardLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wider,
  },
  infoCardValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: '#F4F1E8',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#F4F1E8',
    marginBottom: Spacing.base,
  },
  actionCards: {
    gap: Spacing.md,
    marginBottom: Spacing.xxl + 4,
  },
  actionCard: {
    backgroundColor: 'rgba(11,33,23,0.5)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#223B29',
    padding: Spacing.xl,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  actionIcon: {
    fontSize: Typography.fontSize.xxl,
  },
  actionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#F4F1E8',
    marginBottom: Spacing.xs,
  },
  actionDesc: {
    fontSize: Typography.fontSize.base - 1,
    color: '#A9B9A8',
  },
  loadingBox: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  emptyBox: {
    padding: Spacing.xxl,
    alignItems: 'center',
    backgroundColor: 'rgba(11,33,23,0.5)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#223B29',
  },
  emptyText: {
    color: '#A9B9A8',
    fontSize: Typography.fontSize.base - 1,
  },
  reportCard: {
    backgroundColor: 'rgba(11,33,23,0.7)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#223B29',
    padding: Spacing.lg,
    marginBottom: Spacing.sm + 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  reportType: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: '#F4F1E8',
  },
  reportDate: {
    fontSize: Typography.fontSize.xs,
    color: '#A9B9A8',
  },
  reportLocation: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  reportDesc: {
    fontSize: Typography.fontSize.sm,
    color: '#A9B9A8',
    lineHeight: 18,
  },
});
