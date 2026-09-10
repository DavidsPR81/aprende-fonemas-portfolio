export const colors = {
  background: '#E8F4FC',
  backgroundBottom: '#F7FBFE',
  sky: '#D6ECF8',
  skyBright: '#42B4F0',
  skyTop: '#3A9FE0',
  skyMid: '#6BB8EA',
  skyLight: '#C5E6FA',

  surface: '#FFFFFF',
  surfaceMuted: '#F0F6FA',
  surfaceGlass: 'rgba(255, 255, 255, 0.88)',
  /** Thumb del switch en Android (apagado) */
  surfaceSubtle: '#F7FAFC',

  primary: '#42B4F0',
  primaryDark: '#2E9AD9',
  primaryLight: '#E3F2FA',
  primaryDeep: '#1565C0',
  /** Títulos de pantalla (Fonemas, Niveles…) */
  titleSky: '#2E9AD9',

  accent: '#F5A962',
  accentLight: '#FEF3E8',
  accentDark: '#E09040',
  accentBorder: '#C56A1E',
  accentShadow: '#8B4510',

  success: '#6BCB9A',
  successLight: '#E8F8F0',
  successBorder: 'rgba(107, 203, 154, 0.5)',
  error: '#E07A7A',
  errorLight: '#FDECEC',

  premium: '#9B8FD9',
  premiumDark: '#7B6FC0',
  premiumLight: '#F0EDFA',
  premiumBorder: '#D4CBEF',
  premiumBorderStrong: 'rgba(155, 143, 217, 0.5)',
  premiumSoft: '#C4B5F0',
  premiumMist: '#B8A9E8',

  free: '#6BCB9A',
  freeLight: '#E8F8F0',

  navy: '#2B5F8A',
  navySoft: '#3D7AAD',
  navyFade: 'rgba(43, 95, 138, 0.22)',

  text: '#2D3748',
  textSecondary: '#5A6A7A',
  textMuted: '#8FA0B0',
  onPrimary: '#FFFFFF',
  onAccent: '#FFFFFF',
  onPremium: '#FFFFFF',

  border: '#D8E4EE',
  borderSky: 'rgba(66, 180, 240, 0.35)',
  borderSkySoft: 'rgba(66, 180, 240, 0.28)',
  borderSkyStrong: 'rgba(66, 180, 240, 0.4)',
  switchTrackOff: '#CBD5E0',
  shadow: '#2D4A5E',
  star: '#FFD166',
  starDark: '#E8A317',
  /** Estrella vacía (contraste sobre cielo) */
  starEmpty: '#546E7A',
  starGlow: 'rgba(232, 163, 23, 0.55)',
  sparkPink: '#FF8FAB',
  sparkGold: '#F4D35E',
  confettiCoral: '#FF8A65',
  confettiSky: '#4FC3F7',
  confettiLilac: '#CE93D8',
  confettiMint: '#81C784',
  confettiRose: '#F48FB1',
  confettiLemon: '#FFF59D',
  championGoldLight: '#FFE9A8',
  championGold: '#FFD166',
  championGoldWarm: '#F5A962',

  overlay: 'rgba(45, 74, 94, 0.36)',
  overlayHeavy: 'rgba(45, 74, 94, 0.55)',
  feedbackBorder: 'rgba(66, 180, 240, 0.45)',
  feedbackHalo: 'rgba(255, 255, 255, 0.72)',
  feedbackSuccessBorder: 'rgba(107, 203, 154, 0.5)',
  feedbackSkyBorder: 'rgba(66, 180, 240, 0.4)',

  cloudFill: 'rgba(255, 255, 255, 0.9)',
  cloudHighlight: 'rgba(255, 255, 255, 0.98)',
  cloudDepth: 'rgba(255, 255, 255, 0.58)',

  shadowBrandTitle: 'rgba(45, 74, 94, 0.45)',
  shadowStatHighlight: 'rgba(255, 255, 255, 0.9)',
  textShadowSoft: 'rgba(0,0,0,0.18)',
};

export const gradients = {
  sky: {
    colors: [colors.skyTop, colors.skyMid, colors.skyLight, colors.backgroundBottom],
    locations: [0, 0.32, 0.72, 1],
  },
  championBanner: {
    colors: [colors.championGoldLight, colors.championGold, colors.championGoldWarm],
  },
};

export const LETTER_PALETTE = [
  '#E53935', // rojo
  '#1E88E5', // azul
  '#43A047', // verde
  '#FB8C00', // naranja
  '#8E24AA', // morado
  '#F9A825', // amarillo
  '#00897B', // teal
  '#5E35B1', // índigo
  '#D81B60', // rosa
  '#6D4C41', // marrón
];

const LETTER_FIXED = {
  a: '#E53935',
  e: '#1E88E5',
  i: '#43A047',
  o: '#FB8C00',
  u: '#8E24AA',
  enie: '#6A1B9A',
  ñ: '#6A1B9A',
  rr: '#00838F',
};

function hexToHue(hex) {
  const raw = hex.replace('#', '');
  const n = parseInt(raw.length === 3 ? raw.replace(/(.)/g, '$1$1') : raw, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d < 0.0001) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

function colorsTooSimilar(a, b, minHueDist = 38) {
  if (!a || !b) return false;
  if (a.toLowerCase() === b.toLowerCase()) return true;
  const ha = hexToHue(a);
  const hb = hexToHue(b);
  const dist = Math.min(Math.abs(ha - hb), 360 - Math.abs(ha - hb));
  return dist < minHueDist;
}

export function getLetterColor(letterIdOrChar) {
  const raw = String(letterIdOrChar ?? '')
    .toLowerCase()
    .replace(/^letter_/, '');
  if (LETTER_FIXED[raw]) return LETTER_FIXED[raw];
  if (!raw) return colors.primaryDark;
  // Sílabas (PA, TOR…) y dígrafos: reparto por hash, no solo la 1.ª letra
  if (raw.length > 1) {
    const hash = [...raw].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return LETTER_PALETTE[hash % LETTER_PALETTE.length];
  }
  const idx = raw.charCodeAt(0) % LETTER_PALETTE.length;
  return LETTER_PALETTE[idx];
}

/** En un ejercicio, ninguna letra/sílaba repite color parecido */
export function assignDistinctLetterColors(letters = []) {
  const assigned = {};
  const used = [];

  const letterKey = (letter) =>
    String(letter?.id ?? letter?.uppercase ?? letter ?? '')
      .toLowerCase()
      .replace(/^letter_/, '');

  const canUse = (color) => !used.some((c) => colorsTooSimilar(c, color));

  // Primero el color preferido de cada letra
  letters.forEach((letter) => {
    const key = letterKey(letter);
    if (!key || assigned[key]) return;
    const preferred = getLetterColor(key);
    if (canUse(preferred)) {
      assigned[key] = preferred;
      used.push(preferred);
    }
  });

  // Si choca, el siguiente de la paleta que no se parezca
  letters.forEach((letter) => {
    const key = letterKey(letter);
    if (!key || assigned[key]) return;
    const next = LETTER_PALETTE.find((c) => canUse(c)) ?? LETTER_PALETTE[used.length % LETTER_PALETTE.length];
    assigned[key] = next;
    used.push(next);
  });

  return assigned;
}

/** Un color por nivel; separados para que la rejilla no se vea monótona */
export const LEVEL_CIRCLE_COLORS = [
  '#1E88E5', // 1  azul
  '#FB8C00', // 2  naranja
  '#43A047', // 3  verde
  '#E53935', // 4  rojo
  '#8E24AA', // 5  morado
  '#00897B', // 6  verdeazulado
  '#F9A825', // 7  ámbar
  '#3949AB', // 8  índigo
  '#00ACC1', // 9  cian
  '#6D4C41', // 10 marrón
  '#D81B60', // 11 rosa
  '#546E7A', // 12 azul gris
];

export function getLevelCircleColor(levelId) {
  const idx = Math.max(0, (Number(levelId) || 1) - 1) % LEVEL_CIRCLE_COLORS.length;
  return LEVEL_CIRCLE_COLORS[idx];
}

export const textShadows = {
  brandTitle: {
    textShadowColor: colors.shadowBrandTitle,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  /** Como el número grande de Progreso */
  screenTitle: {
    textShadowColor: colors.shadowStatHighlight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statNumber: {
    textShadowColor: colors.shadowStatHighlight,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
};

export const textColors = {
  brandLight: colors.surface,
  /** «Fonemas» en Home */
  brandAccent: colors.titleSky,
  /** Títulos de Niveles / Progreso / Premium / Ajustes */
  screenTitle: colors.primaryDeep,
  heading: colors.navy,
  subheading: colors.navySoft,
  /** Subtítulo Home (azul, no gris) */
  subtitle: colors.navySoft,
  body: colors.navy,
  muted: colors.textMuted,
  onPrimary: colors.surface,
  onAccent: colors.surface,
  onPremium: colors.surface,
  accentStat: colors.primaryDeep,
  footer: colors.navy,
};

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/** Layout Home */
export const homeLayout = {
  subtitleMaxWidth: 340,
  subtitleText: 'Sonidos y letras para niños 3–7',
  sectionGap: spacing.sm,
  /** Portrait: menos hueco mascota→marca */
  portraitMascotToBrandGap: 0,
  brandBlockGap: 0,
  /** Evita recorte de «Fonemas» en Android */
  brandLineHeightRatio: 1.2,
  subtitleTop: spacing.xs,
  actionsTop: spacing.sm,
  buttonStackGap: spacing.md + 4,
  footerTop: spacing.md,
  footerOpacity: 0.75,
  secondaryButtonGap: spacing.sm,
  landscapeSectionGap: spacing.xs,
  landscapeTitleKey: 'hero',
  portraitTitleKey: 'display',
  settingsIconVariant: 'sky',
  settingsIconSize: 'icon',
  scrollInLandscape: true,
  /** Landscape: textos/CTAs | mascota */
  useWideLandscapeLayout: true,
  wideBodyGap: spacing.md,
  wideSideGap: spacing.sm,
  tabletPortraitSectionGap: spacing.sm,
  tabletPortraitMascotGap: 4,
  mascotVariant: 'normal',
  premiumCrownSize: 40,
  premiumCrownTop: -14,
  premiumCrownRight: 10,
};

/** Layout Progreso (sin scroll en portrait) */
export const progressLayout = {
  heroGap: spacing.xs,
  cheerToStats: spacing.sm,
  statsToGrid: spacing.md,
  /** Opacos: evita artefactos de elevation con fondos translúcidos. */
  statsPanelBg: '#FFFFFF',
  statsPanelBorder: 'rgba(66, 180, 240, 0.35)',
  statsDivider: 'rgba(21, 101, 192, 0.14)',
  mascotPortrait: 112,
  mascotLandscape: 100,
  mascotTablet: 188,
  cellGapPortrait: 8,
  cellGapLandscape: 14,
  cellGapTablet: 16,
  cellHeightPortrait: 88,
  cellHeightLandscapePhone: 98,
  cellHeightTablet: 104,
  columnsPortraitPhone: 4,
  columnsLandscapePhone: 5,
  columnsTabletPortrait: 5,
  columnsTabletLandscape: 6,
  cellBg: '#FFFFFF',
  cellBorder: '#B3D4F0',
  cellDoneBg: '#E3F2FD',
  cellPremiumBg: '#F0EDFA',
  cellPremiumDoneBg: '#E8E4F8',
  heroCheerSize: 18,
  heroCheerSizeTablet: 22,
  grandFinaleTitleSize: 18,
  grandFinaleTitleSizeTablet: 22,
  grandFinaleSubtitleSize: 13,
  grandFinaleSubtitleSizeTablet: 15,
  statNumberSize: 48,
  statPercentSize: 44,
  upgradeBtnTop: spacing.lg,
  cellLockMarkSize: 22,
  upgradeCrownSize: 40,
  upgradeCrownTop: -14,
  upgradeCrownRight: 10,
  championCrownTop: -26,
  championCrownRight: 10,
};

/** Layout Premium */
export const premiumLayout = {
  panelBg: '#FFFFFF',
  panelBorder: 'rgba(155, 143, 217, 0.4)',
  pricePanelBorder: 'rgba(255, 209, 102, 0.55)',
  activeStatusText: colors.premiumDark,
  mascotPhone: 148,
  mascotPhoneLandscape: 112,
  mascotTablet: 168,
  /** Landscape: más pequeña para que quepa hero+panel sin recortar. */
  mascotTabletLandscape: 128,
  buyCrownSize: 40,
  buyCrownTop: -14,
  buyCrownRight: 10,
  priceCrownSize: 48,
  priceCrownTop: -22,
  titleSize: 26,
  titleSizeTablet: 30,
  subtitleSize: 15,
  subtitleSizeTablet: 17,
  priceSize: 40,
  stackGap: spacing.md,
  wideSideGap: spacing.lg,
  wideSideGapTablet: spacing.xl,
  wideColumnGap: spacing.md,
};

/** Layout gran final (sin scroll) */
export const finalCelebrationLayout = {
  mascotPortrait: 168,
  mascotLandscape: 140,
  mascotTablet: 220,
  crownPortrait: 72,
  crownLandscape: 64,
  crownTablet: 88,
  /** Corona cerca de la mascota, sin solaparse (separación corta y limpia) */
  crownToMascotGap: 4,
  bodyGap: spacing.sm,
  bodyPaddingH: spacing.md,
  bodyPaddingBottom: spacing.md,
  /** Panel dorado (misma familia que el banner campeón) */
  panelGradient: gradients.championBanner.colors,
  panelBorder: colors.starDark,
  panelBorderWidth: 3,
  panelPaddingV: spacing.lg,
  panelPaddingH: spacing.lg,
  panelMaxWidth: 440,
  panelMaxWidthLandscape: 480,
  /** Landscape: mascota+corona | panel+botones (mismo patrón que Celebration) */
  wideGap: spacing.xl,
  wideSidePad: spacing.md,
  wideMaxWidth: 980,
  panelInnerGap: spacing.md,
  badgeBg: colors.surface,
  badgeBorder: colors.starDark,
  badgeText: colors.navy,
  badgePaddingH: spacing.md,
  badgePaddingV: spacing.sm,
  titleKey: 'titleScreen',
  titleColor: colors.navy,
  subtitleKey: 'subtitle',
  subtitleColor: colors.accentShadow,
  /** Chips sobre fondo dorado: contraste claro */
  statChipBg: 'rgba(255, 255, 255, 0.88)',
  statChipBorder: colors.starDark,
  statChipText: colors.navy,
  /** Chip de estrellas */
  statChipGoldBg: colors.surface,
  statChipGoldBorder: colors.starDark,
  statChipGoldText: colors.starDark,
  statChipPaddingV: spacing.md,
  statNumberSize: 34,
  statOfSize: 16,
  statLabelKey: 'caption',
  actionsGap: spacing.md,
  actionsTop: spacing.lg,
  buttonSize: 'md',
  primaryVariant: 'sky',
  secondaryVariant: 'soft',
  enterOffsetY: 14,
  crownEnterOffsetY: -16,
};

/** Layout nivel completado */
export const celebrationLayout = {
  bodyGap: spacing.md,
  bodyPaddingH: spacing.md,
  bodyPaddingBottom: spacing.md,
  panelToActions: spacing.lg,
  actionsGap: spacing.md,
  buttonSize: 'md',
  primaryVariant: 'sky',
  secondaryVariant: 'soft',
  panelBg: colors.surfaceGlass,
  panelBorder: colors.borderSkyStrong,
  panelBorderWidth: 2.5,
  panelPaddingV: spacing.lg,
  panelPaddingH: spacing.lg,
  panelMaxWidth: 440,
  panelMaxWidthLandscape: 420,
  /** Landscape: mascota | panel+botones (como Home) */
  wideGap: spacing.xl,
  wideSidePad: spacing.md,
};

/** Colores confeti / fuegos */
export const confettiPalette = [
  colors.star,
  colors.starDark,
  colors.accent,
  colors.skyBright,
  colors.sparkPink,
  colors.sparkGold,
  colors.confettiCoral,
  colors.confettiSky,
  colors.confettiLilac,
  colors.confettiMint,
  colors.confettiRose,
  colors.confettiLemon,
];

/** UI ejercicio (mascota en esquina; sin scroll en portrait) */
export const exerciseUi = {
  listenMaxWidth: 300,
  listenMinHeight: 68,
  listenFontSize: 22,
  listenIconSize: 26,
  companionSize: 92,
  companionSizeLandscape: 80,
  companionSizeTablet: 112,
  letterCardWidth: 112,
  letterCardHeight: 156,
  letterCardWidthTablet: 136,
  letterCardHeightTablet: 188,
  visualCardWidth: 152,
  visualCardHeight: 168,
  visualCardWidthTablet: 180,
  visualCardHeightTablet: 196,
  letterUpperSize: 48,
  letterLowerSize: 26,
  /**
   * Tamaño ÚNICO de dibujo en cards de opción y de pregunta (todos los niveles).
   * contain: nunca se recorta. Un poco más grande para 3–7 años.
   */
  illustrationSize: 112,
  illustrationOnly: 112,
  illustrationWithLabel: 100,
  optionLabelSize: 15,
  syllableDot: 16,
  syllableDotDense: 13,
  stimulusIllustration: 112,
  feedbackBorder: colors.feedbackBorder,
  feedbackHalo: colors.feedbackHalo,
  instructionPanelBg: 'rgba(255, 252, 245, 0.96)',
  instructionPanelBorder: 'rgba(255, 168, 74, 0.42)',
  instructionEyebrow: colors.primaryDark,
  instructionAccent: 'rgba(255, 168, 74, 0.55)',
  optionBorder: colors.borderSkyStrong,
  optionBorderWidth: 2.5,
  promptPadH: 18,
  promptPadTop: 8,
  promptPadBottom: 12,
  promptAccentWidth: 5,
  eyebrowSize: 12,
  visualContentGap: 10,
  overlayScrim: colors.overlay,
};

/** Fondo de card/opción: mismo color en card y detrás del dibujo */
export function getOptionCardSurface(isSelected, isCorrect, isHint = false) {
  if (isHint || (isSelected && isCorrect)) return colors.successLight;
  if (isSelected && !isCorrect) return colors.errorLight;
  return colors.surface;
}

/** Layout Niveles */
export const levelsLayout = {
  heroPanelBg: '#FFFFFF',
  heroPanelBorder: 'rgba(66, 180, 240, 0.35)',
  mascotPhone: 118,
  mascotTablet: 140,
  mascotLandscape: 110,
  ringSizePhone: 86,
  ringSizeTablet: 100,
  ringSizeLandscape: 80,
  ringFill: colors.skyBright,
  ringTrack: 'rgba(66, 180, 240, 0.22)',
  ringText: colors.navy,
  ringPanelBg: '#FFFFFF',
  ringPanelBorder: colors.borderSky,
  sparklesFree: [
    { top: 0, left: 6, size: 9, color: colors.sparkPink },
    { top: 4, right: 4, size: 10, color: colors.sparkGold },
    { bottom: 2, left: 10, size: 8, color: colors.skyBright },
  ],
  sparklesPremium: [
    { top: 0, left: 4, size: 9, color: colors.premiumSoft },
    { top: 6, right: 2, size: 10, color: colors.premium },
    { bottom: 0, left: 10, size: 8, color: colors.premiumMist },
  ],
  cardBorder: colors.borderSkySoft,
  cardBorderPremium: colors.premiumBorderStrong,
  onCircle: colors.onPrimary,
  unlockCrownSize: 40,
  unlockCrownTop: -14,
  unlockCrownRight: 10,
  /** Corona en esquina de LevelCard (premium bloqueado) */
  cardCrownSize: 28,
  cardCrownTop: 6,
  cardCrownRight: 6,
  heroTitleSize: 24,
  heroTitleSizeTablet: 30,
  heroSubSize: 15,
  heroSubSizeTablet: 18,
  heroToGridGap: spacing.lg,
  /** Altura FIJA suficiente para: círculo + título 2 líneas + banner Gratis/Premium. */
  cardFixedHeight: 216,
  cardFixedHeightTablet: 232,
  cardNameMinHeight: 40,
  cardNameSize: 12,
  cardNameLineHeight: 16,
  cardNameSizeTablet: 15,
  cardNameLineHeightTablet: 19,
  cardBannerHeight: 34,
  cardBannerHeightTablet: 36,
  bannerTextSize: 13,
  bannerTextSizeTablet: 15,
  circleSizePhone: 64,
  circleSizeTablet: 72,
  circleNumberSize: 30,
  circleNumberSizeTablet: 32,
  lockInCircle: 34,
  lockInCircleLocked: 30,
  smallNumberSize: 19,
  smallNumberSizeTablet: 20,
};

/** Gradiente SVG nubes (una capa; no doblar fondo) */
export const cloudRender = {
  gradientTop: colors.cloudHighlight,
  gradientMid: colors.cloudFill,
  gradientBottom: colors.cloudDepth,
  path:
    'M165 78 C188 78 198 62 190 48 C198 32 178 24 162 30 C154 14 132 12 118 24 C106 10 84 10 70 22 C54 14 34 22 28 40 C10 40 2 56 12 70 C4 80 12 96 32 96 C38 106 58 110 76 104 C98 112 128 108 144 96 C160 100 176 92 165 78 Z',
};

const skyCloudShared = {
  aspect: 0.55,
  topLeftOpacity: 0.92,
  topRightOpacity: 0.9,
  bottomLeftOpacity: 0.88,
  bottomRightOpacity: 0.86,
  bottomRowOffset: 0,
  bottomRowStagger: spacing.sm,
  belowSettingsGap: spacing.sm,
  contentTopPadding: spacing.sm,
};

/** Nubes por orientación / tamaño */
export const skyCloudProfiles = {
  portrait: {
    topLeftWidth: 0.44,
    topRightWidth: 0.38,
    bottomLeftWidth: 0.5,
    bottomRightWidth: 0.44,
    topLeftInset: -0.1,
    topRightInset: -0.06,
    bottomLeftInset: -0.24,
    bottomRightInset: -0.2,
    topLeftDrop: spacing.sm,
    topRightDrop: spacing.sm,
    bottomBandRatio: 0.42,
    bottomRowLift: -spacing.md,
    bottomLeftExtraLift: -spacing.lg,
  },
  landscape: {
    topLeftWidth: 0.34,
    topRightWidth: 0.3,
    bottomLeftWidth: 0.38,
    bottomRightWidth: 0.34,
    topLeftInset: -0.08,
    topRightInset: -0.05,
    bottomLeftInset: -0.16,
    bottomRightInset: -0.14,
    topLeftDrop: spacing.xs,
    topRightDrop: 0,
    bottomBandRatio: 0.54,
    bottomRowLift: -spacing.xs,
    bottomLeftExtraLift: -spacing.sm,
  },
  compact: {
    topLeftWidth: 0.3,
    topRightWidth: 0.26,
    bottomLeftWidth: 0.34,
    bottomRightWidth: 0.3,
    topLeftInset: -0.07,
    topRightInset: -0.04,
    bottomLeftInset: -0.14,
    bottomRightInset: -0.12,
    topLeftDrop: 0,
    topRightDrop: 0,
    bottomBandRatio: 0.58,
    bottomRowLift: 0,
    bottomLeftExtraLift: -spacing.xs,
  },
  /** Tablet vertical = mismos valores que portrait móvil */
  tabletPortrait: {
    topLeftWidth: 0.44,
    topRightWidth: 0.38,
    bottomLeftWidth: 0.5,
    bottomRightWidth: 0.44,
    topLeftInset: -0.1,
    topRightInset: -0.06,
    bottomLeftInset: -0.24,
    bottomRightInset: -0.2,
    topLeftDrop: spacing.sm,
    topRightDrop: spacing.sm,
    bottomBandRatio: 0.42,
    bottomRowLift: -spacing.md,
    bottomLeftExtraLift: -spacing.lg,
  },
  tabletLandscape: {
    topLeftWidth: 0.36,
    topRightWidth: 0.32,
    bottomLeftWidth: 0.42,
    bottomRightWidth: 0.38,
    topLeftInset: -0.09,
    topRightInset: -0.05,
    bottomLeftInset: -0.18,
    bottomRightInset: -0.16,
    topLeftDrop: spacing.xs,
    topRightDrop: 0,
    bottomBandRatio: 0.5,
    bottomRowLift: -spacing.xs,
    bottomLeftExtraLift: -spacing.md,
  },
};

export function getSkyCloudProfile(isLandscape, isCompact, isTablet = false) {
  if (isTablet) {
    const key = isLandscape ? 'tabletLandscape' : 'tabletPortrait';
    return { ...skyCloudShared, ...skyCloudProfiles[key] };
  }
  const key = !isLandscape ? 'portrait' : isCompact ? 'compact' : 'landscape';
  return { ...skyCloudShared, ...skyCloudProfiles[key] };
}

export const radius = {
  sm: 14,
  md: 22,
  lg: 28,
  xl: 36,
  full: 999,
};

/** Layout Ajustes */
export const settingsLayout = {
  contentMaxWidth: 520,
  contentMaxWidthTablet: 720,
  introSurface: colors.surfaceGlass,
  panelSurface: colors.surface,
  panelBorder: colors.primaryLight,
  devBannerBg: colors.accentLight,
  devBannerBorder: colors.accentBorder,
  devBannerText: colors.accentDark,
  sectionGap: spacing.lg,
  panelRadius: radius.xl,
  panelPadding: spacing.md,
  rowMinHeight: 52,
};

export const fonts = {
  kids: 'Fredoka_700Bold',
  kidsSemi: 'Fredoka_600SemiBold',
  kidsMed: 'Fredoka_500Medium',
  kidsReg: 'Fredoka_400Regular',
  body: 'Nunito_500Medium',
  bodyBold: 'Nunito_700Bold',
  bodyExtra: 'Nunito_800ExtraBold',
};

/** Tipografía base; useResponsive la escala */
export const typographyScale = {
  display: { fontSize: 60, lineHeight: 68, fontFamily: fonts.kids },
  hero: { fontSize: 38, lineHeight: 44, fontFamily: fonts.kids },
  title: { fontSize: 28, lineHeight: 34, fontFamily: fonts.kids },
  titleScreen: { fontSize: 36, lineHeight: 40, fontFamily: fonts.kids },
  subtitle: { fontSize: 18, lineHeight: 24, fontFamily: fonts.kidsSemi },
  body: { fontSize: 16, lineHeight: 24, fontFamily: fonts.kidsMed },
  bodyLarge: { fontSize: 20, lineHeight: 28, fontFamily: fonts.kidsSemi },
  caption: { fontSize: 13, lineHeight: 18, fontFamily: fonts.kidsMed },
  footer: { fontSize: 12, lineHeight: 16, fontFamily: fonts.kidsMed },
  letterLarge: { fontSize: 58, lineHeight: 64, fontFamily: fonts.kids },
  letterSmall: { fontSize: 32, lineHeight: 38, fontFamily: fonts.kids },
  buttonLg: { fontSize: 28, lineHeight: 34, fontFamily: fonts.kids },
  buttonMd: { fontSize: 18, lineHeight: 24, fontFamily: fonts.kids },
  buttonSm: { fontSize: 15, lineHeight: 20, fontFamily: fonts.kids },
  instruction: { fontSize: 24, lineHeight: 30, fontFamily: fonts.kids },
};

export function scaleTypography(scale, key) {
  const base = typographyScale[key];
  if (!base) return typographyScale.body;
  return {
    fontFamily: base.fontFamily,
    fontSize: scale(base.fontSize),
    lineHeight: scale(base.lineHeight),
  };
}

/** Tamaños de botón */
export const buttonSizes = {
  lg: {
    minHeight: 72,
    paddingVertical: 16,
    paddingHorizontal: spacing.xl,
    borderWidth: 3,
    fontKey: 'buttonLg',
  },
  md: {
    minHeight: 58,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    borderWidth: 3,
    fontKey: 'buttonMd',
  },
  homeWide: {
    minHeight: 58,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    borderWidth: 3,
    fontKey: 'buttonMd',
  },
  /** Mitad de fila en Home landscape móvil: menos padding, texto legible */
  homeHalf: {
    minHeight: 52,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderWidth: 3,
    fontKey: 'buttonMd',
  },
  sm: {
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    fontKey: 'buttonSm',
  },
  icon: {
    minHeight: 50,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 3,
    fontKey: 'buttonSm',
  },
};

/** primary naranja · secondary celeste · tertiary glass · premium morado */
export const buttonTiers = {
  primary: {
    backgroundColor: colors.accent,
    textColor: colors.surface,
    borderColor: colors.accentBorder,
    shadowColor: colors.accentShadow,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffsetY: 6,
    elevation: 7,
  },
  secondary: {
    backgroundColor: colors.skyBright,
    textColor: colors.surface,
    borderColor: colors.primaryDark,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffsetY: 5,
    elevation: 6,
  },
  tertiary: {
    backgroundColor: colors.surfaceGlass,
    textColor: colors.primaryDark,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffsetY: 4,
    elevation: 3,
  },
  premium: {
    backgroundColor: colors.premium,
    textColor: colors.surface,
    borderColor: colors.premiumDark,
    shadowColor: colors.premiumDark,
    shadowOpacity: 0.32,
    shadowRadius: 8,
    shadowOffsetY: 5,
    elevation: 6,
  },
  premiumSoft: {
    backgroundColor: colors.premiumLight,
    textColor: colors.premiumDark,
    borderColor: colors.premiumBorder,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffsetY: 4,
    elevation: 3,
  },
};

/** variant antigua → tier */
export const buttonVariantMap = {
  accent: 'primary',
  sky: 'secondary',
  primary: 'secondary',
  soft: 'tertiary',
  premium: 'premium',
  premiumSoft: 'premiumSoft',
};

export function getButtonTokens(variant = 'secondary', size = 'md') {
  const tierKey = buttonVariantMap[variant] ?? variant;
  const tier = buttonTiers[tierKey] ?? buttonTiers.secondary;
  const sizeTokens = buttonSizes[size] ?? buttonSizes.md;
  return {
    ...tier,
    ...sizeTokens,
    borderRadius: radius.full,
    shadow: {
      shadowColor: tier.shadowColor,
      shadowOffset: { width: 0, height: tier.shadowOffsetY },
      shadowOpacity: tier.shadowOpacity,
      shadowRadius: tier.shadowRadius,
      elevation: tier.elevation,
    },
  };
}

export function getIconButtonTokens(variant = 'sky', size = 'icon') {
  const tokens = getButtonTokens(variant, size);
  return {
    ...tokens,
    backgroundColor: colors.surface,
    textColor: colors.primaryDark,
  };
}

/** Botón circular (mismo borde/sombra que sky) */
export const iconButton = (() => {
  const tokens = getIconButtonTokens('sky', 'icon');
  return {
    size: tokens.minHeight,
    backgroundColor: tokens.backgroundColor,
    borderColor: tokens.borderColor,
    borderWidth: tokens.borderWidth,
    textColor: tokens.textColor,
    shadowColor: tokens.shadow.shadowColor,
    shadowOffset: tokens.shadow.shadowOffset,
    shadowOpacity: tokens.shadow.shadowOpacity,
    shadowRadius: tokens.shadow.shadowRadius,
    elevation: tokens.shadow.elevation,
    shadow: tokens.shadow,
  };
})();

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  button: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  soft: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
};

export const touch = {
  minHeight: 56,
  letterCard: 120,
};

/** Timings. Con reduce motion: sin loops / tope reduceMotionMaxMs. */
export const motionLayout = {
  pressScale: 0.96,
  cardPressScale: 0.985,
  pressSpring: { friction: 6, tension: 160 },
  cardPressSpring: { friction: 10, tension: 110 },
  releaseSpring: { friction: 7, tension: 140 },
  celebrateSpring: { friction: 4, tension: 130 },
  starStaggerMs: 120,
  badgePopMs: 300,
  // Confeti premium: cada pieza cae en ~confettiDurationMs y las salidas se
  // escalonan confettiStaggerMs → lluvia suave y continua, no un bloque rápido.
  confettiDurationMs: 6500,
  confettiStaggerMs: 2800,
  confettiReducedMs: 2400,
  confettiPieceMin: 13,
  confettiPieceMax: 22,
  confettiFallRatio: 0.82,
  fireworksDurationMs: 2600,
  fireworksBurstCount: 3,
  fireworksPiecesPerBurst: 12,
  fireworksBurstStaggerMs: 380,
  fireworksSpreadMin: 90,
  fireworksSpreadMax: 160,
  hintPulseMs: 420,
  reduceMotionMaxMs: 100,
  cloudDriftMs: 16000,
  crownBobMs: 1600,
  crownBobPx: 4,
  sparkleTwinkleMs: 1000,
  sparkleMinOpacity: 0.22,
  sparkleMaxOpacity: 1,
  sparkleScaleMin: 0.75,
  sparkleScaleMax: 1.2,
  mascotIdleMs: 2800,
  mascotIdleScale: 1.025,
  mascotIdleBobPx: 3,
  lockMorphMs: 360,
  shimmerMs: 1400,
  successFlashMs: 240,
  successPopScale: 1.05,
  errorShakeMs: 48,
  errorShakePx: 6,
  errorShakeCount: 3,
  speakerWaveMs: 380,
};

export const typography = typographyScale;
