import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';
import { Typography } from './typography';
import { Spacing, Radius } from './spacing';

export const GlobalStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  contentScroll: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bg,
  },

  // Layout primitives
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },

  // Headers
  screenHeader: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.bgGovt,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  screenTitle: {
    fontSize: Typography.fontSize.h2,
    fontWeight: Typography.fontWeight.extraBold,
    color: Colors.textPrimary,
    letterSpacing: Typography.letterSpacing.tight,
  },
  screenSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Cards
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },
  cardTranslucent: {
    backgroundColor: 'rgba(11,33,23,0.7)',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
  },

  // Buttons
  btnPrimary: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#102419',
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
  },
  btnSecondary: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },

  // Badges
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    alignSelf: 'flex-start',
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs + 2,
  },

  // Form Inputs
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs + 2,
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.wide,
  },
  input: {
    backgroundColor: Colors.bgInner,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  // Utility
  spacerSm: { height: Spacing.sm },
  spacerMd: { height: Spacing.md },
  spacerLg: { height: Spacing.lg },
});
