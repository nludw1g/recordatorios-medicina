import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { RemindersProvider } from '@/contexts/RemindersContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RemindersProvider>
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "none" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="add-reminder" options={{ title: 'Agregar recordatorio' }} />
          </Stack>
          <StatusBar style="auto" />
        </RemindersProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
