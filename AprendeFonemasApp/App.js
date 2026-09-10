
import React, { useEffect, useRef, useState } from 'react';
import { Animated, LogBox, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Andika_400Regular, Andika_700Bold } from '@expo-google-fonts/andika';
import {
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import * as SplashScreen from 'expo-splash-screen';
import AppSplash from './src/components/AppSplash';
import { SettingsProvider, syncRuntimeSettings, useSettings } from './src/context/SettingsContext';
import HomeScreen from './src/screens/HomeScreen';
import LevelsScreen from './src/screens/LevelsScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import CelebrationScreen from './src/screens/CelebrationScreen';
import FinalCelebrationScreen from './src/screens/FinalCelebrationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AdultGateScreen from './src/screens/AdultGateScreen';
import PremiumScreen from './src/screens/PremiumScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import { colors } from './src/theme';
import { useReduceMotion } from './src/hooks/useReduceMotion';

SplashScreen.preventAutoHideAsync().catch(() => { });

// expo-av sigue siendo el reproductor de audio; el aviso de deprecación no afecta la app.
LogBox.ignoreLogs(['Expo AV has been deprecated', 'expo-av']);

// Splash JS encima del nativo; mínimo 2 s para que no parpadee
const MIN_SPLASH_MS = 2000;
const SPLASH_FADE_MS = 450;

const Stack = createNativeStackNavigator();

// audioPlayer lee volumen/tts fuera del árbol React
function RuntimeSettingsSync() {
  const settings = useSettings();

  useEffect(() => {
    syncRuntimeSettings(settings);
  }, [settings]);

  return null;
}

function AppNavigator() {
  const reduceMotion = useReduceMotion();

  const screenOptions = {
    headerShown: false,
    animation: reduceMotion ? 'none' : 'slide_from_right',
    contentStyle: { backgroundColor: colors.background },
  };

  return (
    <>
      <RuntimeSettingsSync />
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ animation: reduceMotion ? 'none' : 'fade' }}
          />
          <Stack.Screen
            name="Levels"
            component={LevelsScreen}
            options={{ animation: reduceMotion ? 'none' : 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="Exercise"
            component={ExerciseScreen}
            options={{
              animation: reduceMotion ? 'none' : 'slide_from_right',
              // Evita desync native/JS con beforeRemove en native-stack (gesto iOS).
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Celebration"
            component={CelebrationScreen}
            options={{ animation: reduceMotion ? 'none' : 'fade' }}
          />
          <Stack.Screen
            name="FinalCelebration"
            component={FinalCelebrationScreen}
            options={{ animation: reduceMotion ? 'none' : 'fade' }}
          />
          <Stack.Screen
            name="Progress"
            component={ProgressScreen}
            options={{ animation: reduceMotion ? 'none' : 'fade_from_bottom' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: reduceMotion ? 'none' : 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="AdultGate"
            component={AdultGateScreen}
            options={{ animation: reduceMotion ? 'none' : 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="Premium"
            component={PremiumScreen}
            options={{ animation: reduceMotion ? 'none' : 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ animation: reduceMotion ? 'none' : 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Andika_400Regular,
    Andika_700Bold,
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  const fontsReady = fontsLoaded || Boolean(fontError);
  const [splashMounted, setSplashMounted] = useState(true);
  const [splashPainted, setSplashPainted] = useState(false);
  const splashShownAt = useRef(null);
  const fadeStarted = useRef(false);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  const handleSplashLayout = () => {
    if (splashShownAt.current != null) return;
    splashShownAt.current = Date.now();
    setSplashPainted(true);
    SplashScreen.hideAsync().catch(() => { });
  };

  const fadeOutSplash = () => {
    if (fadeStarted.current) return;
    fadeStarted.current = true;

    Animated.timing(splashOpacity, {
      toValue: 0,
      duration: SPLASH_FADE_MS,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setSplashMounted(false);
    });
  };

  useEffect(() => {
    const fallback = setTimeout(() => {
      if (splashShownAt.current != null) return;
      splashShownAt.current = Date.now();
      setSplashPainted(true);
      SplashScreen.hideAsync().catch(() => { });
    }, 400);
    return () => clearTimeout(fallback);
  }, []);

  useEffect(() => {
    if (!fontsReady || !splashPainted || splashShownAt.current == null) return undefined;

    const elapsed = Date.now() - splashShownAt.current;
    const remaining = Math.max(0, MIN_SPLASH_MS - elapsed);
    const timer = setTimeout(fadeOutSplash, remaining);
    return () => clearTimeout(timer);
  }, [fontsReady, splashPainted]);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        {fontsReady ? <AppNavigator /> : null}
      </SettingsProvider>
      {splashMounted ? (
        <Animated.View
          style={[styles.splashOverlay, { opacity: splashOpacity }]}
          pointerEvents="auto"
        >
          <AppSplash onReady={handleSplashLayout} />
        </Animated.View>
      ) : null}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
});
