import { useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scaleTypography, typographyScale, exerciseUi } from '../theme';

const TABLET_MIN_SHORT_SIDE = 600;
const CONTENT_MAX_TABLET = 960;
/** Tope landscape móvil (referencia Progreso / Home CTAs). */
const PHONE_LANDSCAPE_MAX = 760;
const PHONE_LANDSCAPE_BUTTON_MAX = 400;
const TABLET_BUTTON_MAX = 420;
/** Evita parpadeo de columnas al girar cerca de 1:1. */
const LANDSCAPE_RATIO = 1.08;

function scaleSize(base, factor) {
  return Math.round(base * factor);
}

function buildScaledFonts(scale) {
  const keys = Object.keys(typographyScale);
  const fonts = {};
  keys.forEach((key) => {
    fonts[key] = scaleTypography(scale, key);
  });
  fonts.hero = fonts.hero;
  fonts.title = fonts.title;
  fonts.subtitle = fonts.subtitle;
  fonts.body = fonts.body;
  fonts.bodyLarge = fonts.bodyLarge;
  fonts.caption = fonts.caption;
  fonts.button = fonts.buttonMd;
  fonts.letterLarge = fonts.letterLarge;
  fonts.letterSmall = fonts.letterSmall;
  return fonts;
}

/**
 * Ancho de card de grid que SIEMPRE cabe en N columnas (sin wrap fantasma al rotar).
 */
function gridCardWidth(innerWidth, columns, gap) {
  if (columns < 1) return innerWidth;
  const raw = (innerWidth - gap * (columns - 1)) / columns;
  return Math.max(1, Math.floor(raw));
}

export function useResponsive(exerciseProfile = null) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const shortSide = Math.min(width, height);
    const longSide = Math.max(width, height);
    const aspect = longSide / Math.max(1, shortSide);
    // Landscape estable: ratio claro; si casi cuadrado, usa width>height.
    const isLandscape =
      aspect >= LANDSCAPE_RATIO ? width > height : width > height;
    const isTablet = shortSide >= TABLET_MIN_SHORT_SIDE;
    const isPhone = !isTablet;
    const isCompact = isPhone && isLandscape && height < 400;
    const isPortraitPhone = isPhone && !isLandscape;

    const usableHeight = Math.max(0, height - insets.top - insets.bottom);

    const horizontalPadding = isTablet ? 36 : isLandscape && isPhone ? 16 : 20;

    // Restar insets laterales (cutout / gesture) para que el grid no desborde.
    const safeWidth = Math.max(0, width - insets.left - insets.right);
    const contentMaxWidth = isTablet
      ? CONTENT_MAX_TABLET
      : isLandscape && isPhone
        ? Math.min(safeWidth, PHONE_LANDSCAPE_MAX)
        : safeWidth;

    const usableWidth = Math.min(safeWidth, contentMaxWidth);
    const innerWidth = Math.max(0, usableWidth - horizontalPadding * 2);

    const fontFactor = isTablet ? 1.18 : isCompact ? 0.9 : isLandscape && isPhone ? 0.94 : 1;
    const scale = (size) => scaleSize(size, fontFactor);
    const fonts = buildScaledFonts(scale);

    // phone P/L: 2/3 · tablet P/L: 3/4
    let levelColumns = 2;
    if (isTablet && isLandscape) levelColumns = 4;
    else if (isTablet) levelColumns = 3;
    else if (isLandscape && isPhone) levelColumns = 3;

    const levelGap = isTablet ? 14 : isLandscape && isPhone ? 12 : 10;
    const levelCardWidth = gridCardWidth(innerWidth, levelColumns, levelGap);

    const interactionPadH = 8;
    const optionsInnerWidth = Math.max(0, innerWidth - interactionPadH * 2);

    // Letras: 3 columnas, tope por hueco real (fold / cutout).
    const letterGap = isTablet ? 20 : isPortraitPhone ? 10 : 14;
    const letterCols = 3;
    const letterTargetW = isTablet
      ? exerciseUi.letterCardWidthTablet
      : exerciseUi.letterCardWidth;
    const letterTargetH = isTablet
      ? exerciseUi.letterCardHeightTablet
      : exerciseUi.letterCardHeight;
    const letterMaxByRow = gridCardWidth(optionsInnerWidth, letterCols, letterGap);
    const letterCardWidth = Math.max(1, Math.min(letterTargetW, letterMaxByRow));
    const letterAspect = isPortraitPhone ? 1.28 : isCompact ? 1.16 : isLandscape ? 1.22 : 1.25;
    const letterCardHeight = Math.min(
      letterTargetH,
      Math.max(Math.round(letterCardWidth * letterAspect), isPortraitPhone ? 112 : 120)
    );

    // Visuales: portrait 2×2 / landscape 4 en fila.
    const visualGridGap = isTablet ? 16 : isPortraitPhone ? 10 : isCompact ? 8 : 12;
    const visualTargetW = isTablet
      ? exerciseUi.visualCardWidthTablet
      : exerciseUi.visualCardWidth;
    const visualTargetH = isTablet
      ? exerciseUi.visualCardHeightTablet
      : exerciseUi.visualCardHeight;
    const visualCols = isLandscape ? 4 : 2;
    const visualMaxByRow = gridCardWidth(optionsInnerWidth, visualCols, visualGridGap);
    const visualGridCardWidth = Math.max(1, Math.min(visualTargetW, visualMaxByRow));
    const visualAspect = isLandscape ? (isCompact ? 0.95 : isTablet ? 1.05 : 1.0) : 1.02;
    let visualGridCardHeight = Math.min(
      visualTargetH,
      Math.max(isPortraitPhone ? 110 : 96, Math.round(visualGridCardWidth * visualAspect))
    );
    if (isPortraitPhone) {
      const chromeReserve = 420;
      const companionReserve = 86;
      const maxByHeight = Math.floor(
        (usableHeight - chromeReserve - companionReserve - visualGridGap) / 2
      );
      visualGridCardHeight = Math.min(visualGridCardHeight, Math.max(110, maxByHeight));
    }

    const optionCardWidth = letterCardWidth;
    const optionCardHeight = letterCardHeight;

    const useWideLayout = isTablet || (isLandscape && width >= 640);
    const buttonMaxWidth = isTablet
      ? TABLET_BUTTON_MAX
      : isLandscape && isPhone
        ? PHONE_LANDSCAPE_BUTTON_MAX
        : undefined;
    const useScrollLayout = isLandscape;

    const portraitScrollFloor = Platform.OS === 'android' ? 720 : 700;
    const needsPortraitScroll = isPortraitPhone && usableHeight < portraitScrollFloor;

    const mascotSize = isTablet ? 164 : isCompact ? 96 : 132;
    const touchMinHeight = isTablet ? 76 : 58;

    const splashLogoSize = isTablet
      ? 280
      : Math.round(Math.min(shortSide * 0.44, 260));

    const modalMaxWidth = isTablet
      ? isLandscape
        ? 620
        : 540
      : isLandscape && isPhone
        ? 420
        : 340;

    let progressColumns = 4;
    if (isTablet && isLandscape) progressColumns = 6;
    else if (isTablet) progressColumns = 5;
    else if (isLandscape && isPhone) progressColumns = 5;

    return {
      width,
      height,
      usableHeight,
      isLandscape,
      isTablet,
      isPhone,
      isCompact,
      isPortraitPhone,
      horizontalPadding,
      innerWidth,
      contentMaxWidth,
      levelColumns,
      levelGap,
      levelCardWidth,
      letterGap,
      letterCols,
      letterCardWidth,
      letterCardHeight,
      visualGridGap,
      visualCols,
      visualGridCardWidth,
      visualGridCardHeight,
      optionCardWidth,
      optionCardHeight,
      useWideLayout,
      useScrollLayout,
      buttonMaxWidth,
      needsPortraitScroll,
      mascotSize,
      touchMinHeight,
      splashLogoSize,
      modalMaxWidth,
      progressColumns,
      fonts,
      scale,
      exerciseProfile,
      insets: {
        top: insets.top,
        right: insets.right,
        bottom: insets.bottom,
        left: insets.left,
      },
    };
  }, [width, height, insets.top, insets.right, insets.bottom, insets.left]);
}
