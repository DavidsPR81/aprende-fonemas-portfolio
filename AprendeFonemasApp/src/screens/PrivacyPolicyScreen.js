
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenLayout from '../components/ScreenLayout';
import AppHeader from '../components/AppHeader';
import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_UPDATED } from '../data/privacyPolicy';
import { colors, radius, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

export default function PrivacyPolicyScreen({ navigation }) {
  const { fonts } = useResponsive();

  return (
    <ScreenLayout
      scroll
      header={<AppHeader title="Privacidad" onBack={() => navigation.goBack()} compact />}
    >

      <Text style={[styles.updated, fonts.caption, { fontFamily: 'Nunito_500Medium' }]}>
        Actualizado: {PRIVACY_POLICY_UPDATED}
      </Text>

      <View style={styles.card}>
        {PRIVACY_POLICY_SECTIONS.map((section, index) => (
          <View
            key={section.title}
            style={[styles.section, index < PRIVACY_POLICY_SECTIONS.length - 1 && styles.sectionBorder]}
          >
            <Text style={[styles.sectionTitle, fonts.body, { fontFamily: 'Nunito_700Bold' }]}>
              {section.title}
            </Text>
            <Text style={[styles.sectionBody, fonts.body, { fontFamily: 'Nunito_500Medium' }]}>
              {section.body}
            </Text>
          </View>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  updated: {
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxl,
  },
  section: {
    paddingVertical: spacing.sm,
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
