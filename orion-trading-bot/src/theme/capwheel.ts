// CapWheel Enterprise Theme Configuration
// Premium institutional trading platform design system

export const capwheelColors = {
  // Primary brand colors
  navy: '#0A1628',
  gold: '#D4AF37',
  electric: '#00D4FF',
  
  // Semantic colors
  profit: '#00FF88',
  loss: '#FF3366',
  
  // Surface colors
  surface: '#111827',
  surfaceLight: '#1F2937',
  surfaceDark: '#0D1117',
  
  // Border colors
  border: 'rgba(212, 175, 55, 0.2)',
  borderLight: 'rgba(212, 175, 55, 0.3)',
  borderGlow: 'rgba(212, 175, 55, 0.5)',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  textGold: '#D4AF37',
  
  // Glass morphism
  glassLight: 'rgba(255, 255, 255, 0.05)',
  glassMedium: 'rgba(255, 255, 255, 0.1)',
  glassDark: 'rgba(10, 22, 40, 0.8)',
} as const;

export const capwheelTypography = {
  fontFamily: {
    sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
    display: ['Inter', 'sans-serif'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const capwheelSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export const capwheelShadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
  md: '0 4px 6px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.3)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.4)',
  gold: '0 0 20px rgba(212, 175, 55, 0.3)',
  goldIntense: '0 0 30px rgba(212, 175, 55, 0.5)',
  electric: '0 0 20px rgba(0, 212, 255, 0.3)',
  profit: '0 0 15px rgba(0, 255, 136, 0.3)',
  loss: '0 0 15px rgba(255, 51, 102, 0.3)',
} as const;

export const capwheelAnimations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

export const capwheelGradients = {
  // Brand gradients
  gold: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%)',
  goldSubtle: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
  electric: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
  
  // Background gradients
  navy: 'linear-gradient(135deg, #0A1628 0%, #111827 50%, #0A1628 100%)',
  surface: 'linear-gradient(180deg, #111827 0%, #0D1117 100%)',
  
  // Semantic gradients
  profit: 'linear-gradient(135deg, #00FF88 0%, #00CC6A 100%)',
  loss: 'linear-gradient(135deg, #FF3366 0%, #CC2952 100%)',
  
  // Card gradients
  card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
  cardGold: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)',
} as const;

export const capwheelBorderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

// Export combined theme
export const capwheelTheme = {
  colors: capwheelColors,
  typography: capwheelTypography,
  spacing: capwheelSpacing,
  shadows: capwheelShadows,
  animations: capwheelAnimations,
  gradients: capwheelGradients,
  borderRadius: capwheelBorderRadius,
} as const;

export type CapWheelTheme = typeof capwheelTheme;
