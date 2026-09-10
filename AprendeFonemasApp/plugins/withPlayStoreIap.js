const {
  withAppBuildGradle,
  withAndroidManifest,
  AndroidConfig,
} = require('@expo/config-plugins');

/**
 * Google Play IAP: variante "play" de react-native-iap + permiso BILLING.
 */
function withPlayStoreIap(config) {
  config = withAppBuildGradle(config, (gradleConfig) => {
    const marker = "missingDimensionStrategy 'store', 'play'";
    if (!gradleConfig.modResults.contents.includes(marker)) {
      gradleConfig.modResults.contents = gradleConfig.modResults.contents.replace(
        /defaultConfig\s*\{/,
        `defaultConfig {
        ${marker}`
      );
    }
    return gradleConfig;
  });

  config = withAndroidManifest(config, (manifestConfig) => {
    AndroidConfig.Permissions.ensurePermissions(manifestConfig.modResults, [
      'com.android.vending.BILLING',
    ]);
    return manifestConfig;
  });

  return config;
}

module.exports = withPlayStoreIap;
