/**
 * Theme constants for the Yoga Booking App
 */

export const COLORS = {
  // Primary colors
  primary: '#4CAF50',  // Green
  primaryLight: '#E8F5E9',
  primaryDark: '#388E3C',
  
  // Secondary colors
  secondary: '#FF9800',  // Orange
  secondaryLight: '#FFF3E0',
  secondaryDark: '#F57C00',
  
  // Accent colors
  accent: '#9C27B0',  // Purple
  accentLight: '#F3E5F5',
  accentDark: '#7B1FA2',
  
  // Status colors
  success: '#4CAF50',  // Green
  warning: '#FFC107',  // Amber
  error: '#F44336',    // Red
  info: '#2196F3',     // Blue
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray scale
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Text colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#9E9E9E',
  textHint: '#9E9E9E',
  
  // Background colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  divider: '#E0E0E0',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 32,
  
  // Spacing
  spacing: 8,
  spacingSm: 4,
  spacingMd: 12,
  spacingLg: 16,
  spacingXl: 24,
  spacingXxl: 32,
  
  // Border radius
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusXxl: 24,
  radiusRound: 999,
  
  // Shadows
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const FONTS = {
  regular: {
    fontFamily: 'System',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500',
  },
  bold: {
    fontFamily: 'System',
    fontWeight: 'bold',
  },
  light: {
    fontFamily: 'System',
    fontWeight: '300',
  },
};

export default {
  COLORS,
  SIZES,
  FONTS,
};