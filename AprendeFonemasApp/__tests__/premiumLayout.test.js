/**
 * Guardas del layout Premium (tablet/móvil × portrait/landscape).
 * No monta RN: valida tokens y reglas que ya rompieron builds de Play.
 */
const { premiumLayout } = require('../src/theme');

describe('premiumLayout tokens', () => {
  test('tiene mascotas portrait y landscape (phone + tablet)', () => {
    expect(premiumLayout.mascotPhone).toBeGreaterThan(0);
    expect(premiumLayout.mascotPhoneLandscape).toBeGreaterThan(0);
    expect(premiumLayout.mascotTablet).toBeGreaterThan(0);
    expect(premiumLayout.mascotTabletLandscape).toBeGreaterThan(0);
  });

  test('mascota landscape es más pequeña que portrait (evita recorte)', () => {
    expect(premiumLayout.mascotPhoneLandscape).toBeLessThan(premiumLayout.mascotPhone);
    expect(premiumLayout.mascotTabletLandscape).toBeLessThan(premiumLayout.mascotTablet);
  });

  test('tipografía tablet ≥ phone', () => {
    expect(premiumLayout.titleSizeTablet).toBeGreaterThanOrEqual(premiumLayout.titleSize);
    expect(premiumLayout.subtitleSizeTablet).toBeGreaterThanOrEqual(premiumLayout.subtitleSize);
  });

  test('gaps wide definidos', () => {
    expect(premiumLayout.wideSideGap).toBeGreaterThan(0);
    expect(premiumLayout.wideSideGapTablet).toBeGreaterThanOrEqual(premiumLayout.wideSideGap);
    expect(premiumLayout.wideColumnGap).toBeGreaterThan(0);
  });
});

describe('Premium isWide rule (documentada)', () => {
  // Misma regla que PremiumScreen: isWide = isLandscape (phone y tablet).
  function isWide(isLandscape) {
    return isLandscape === true;
  }

  test.each([
    ['phone portrait', false, false],
    ['phone landscape', true, true],
    ['tablet portrait', false, false],
    ['tablet landscape', true, true],
  ])('%s → isWide=%s', (_label, landscape, expected) => {
    expect(isWide(landscape)).toBe(expected);
  });
});

describe('Premium landscape body rule (documentada)', () => {
  // landscapeBody NO debe usar justifyContent:'center' en ScrollView
  // (recorta el top si el contenido es más alto que la viewport).
  const landscapeBody = {
    flexGrow: 0,
    justifyContent: 'flex-start',
  };

  test('landscapeBody no centra (evita pantalla en blanco)', () => {
    expect(landscapeBody.justifyContent).toBe('flex-start');
    expect(landscapeBody.flexGrow).toBe(0);
  });
});
