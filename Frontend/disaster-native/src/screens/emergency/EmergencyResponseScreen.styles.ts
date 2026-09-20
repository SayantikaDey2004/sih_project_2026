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
  loadingText: {
    color: Colors.textMuted,
    fontSize: Typography.fontSize.base,
    marginTop: Spacing.md,
  },
  errorCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(80,0,0,0.3)',
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
  },
  pageHeader: {
    marginBottom: Spacing.xl,
  },
  pageLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.gold,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
    marginBottom: Spacing.xs + 2,
  },
  pageTitle: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
    marginBottom: Spacing.xs + 2,
  },
  pageSubtitle: {
    fontSize: Typography.fontSize.base - 1,
    color: Colors.textMuted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: 'rgba(16,36,25,0.9)',
    borderRadius: Radius.lg + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: Spacing.lg,
    marginBottom: Spacing.base,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  sortBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.sm + 2,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 1,
  },
  sortBtnText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  incidentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  incidentSev: {
    borderWidth: 1,
    borderRadius: Radius.sm + 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  incidentSevText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.extraBold,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentTitle: {
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  incidentLocation: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xxs,
  },
  incidentStatus: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  incidentStatusText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semiBold,
  },
  helpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  helpAvail: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpAvailText: {
    fontSize: Typography.fontSize.xl,
  },
  helpInfo: {
    flex: 1,
  },
  helpName: {
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  helpMeta: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing.xxs / 2,
  },
  helpContact: {
    fontSize: Typography.fontSize.sm,
    color: Colors.gold,
    fontWeight: Typography.fontWeight.bold,
  },
  resourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  resourceName: {
    fontSize: Typography.fontSize.base - 1,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  resourceQty: {
    fontSize: Typography.fontSize.base - 1,
    color: Colors.gold,
    fontWeight: Typography.fontWeight.bold,
  },
  villageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  villageName: {
    flex: 1,
    fontSize: Typography.fontSize.base - 1,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textPrimary,
  },
  villagePop: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  villageRiskBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  villageRiskText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  feedRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
  },
  feedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
    marginTop: 5,
  },
  feedInfo: {
    flex: 1,
  },
  feedMessage: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  feedTime: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textMuted,
    marginTop: Spacing.xxs,
  },
});
