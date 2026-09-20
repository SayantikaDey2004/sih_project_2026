// Geo Rakshak Design System — Color Tokens
// Matches the original web app color palette exactly

export const Colors = {
  // Background hierarchy
  bg: '#07140E',
  bgCard: '#0B2117',
  bgPanel: '#102419',
  bgInner: '#173123',
  bgDeep: '#0E1F17',
  bgGovt: '#0B1A12',

  // Border colors
  border: 'rgba(34,59,41,1)',      // #223B29
  borderLight: 'rgba(255,255,255,0.08)',
  borderMid: 'rgba(255,255,255,0.10)',
  borderGold: 'rgba(201,138,60,0.5)',

  // Text
  textPrimary: '#F4EFE4',
  textSecondary: '#B7CBB2',
  textMuted: '#8AA68F',
  textDim: '#6C7D6A',
  textGovt: '#A9B9A8',

  // Brand accent
  gold: '#E3A63F',
  goldDark: '#C98A3C',
  goldLight: '#F2C14E',

  // Status colors
  green: '#4CAF6D',
  greenBright: '#38E07B',
  greenNeon: '#34D399',
  red: '#E14B3C',
  redBright: '#EF5757',
  orange: '#EF8A3D',
  amber: '#F59E0B',
  blue: '#3b82f6',

  // Risk level colors
  riskLow: '#4CAF6D',
  riskModerate: '#F2C14E',
  riskHigh: '#EF8A3D',
  riskCritical: '#E14B3C',

  // Govt portal
  govtAccent: '#4ade80',
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  gold: {
    shadowColor: '#E3A63F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  sos: {
    shadowColor: '#E14B3C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 12,
  },
};
