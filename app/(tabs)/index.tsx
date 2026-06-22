import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import MedicationReminder from '@/components/medication-reminder';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AuthContext } from '@/contexts/AuthContext';
import { setupRemindersStore, useRemindersStore } from '@/store/reminders';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { reminders } = useRemindersStore();
  const authContext = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(reminders).length === 0) { 
      setupRemindersStore();
    }
  }, [reminders]);

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedText type='title'>💊 Recordatorios de medicación</ThemedText>
      <View style={styles.container}>
        {reminders[authContext.user!]?.length === 0 ? (
          <ThemedText>No tienes recordatorios. Agrega uno para empezar.</ThemedText>
        ): (
          <FlatList
          style={{ width: '100%' }}
          data={reminders[authContext.user!]}
          renderItem={({ item }) => <MedicationReminder reminder={item} />}
          keyExtractor={(item) => item.name}
        />
        )}
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-reminder')}>
        <IconSymbol color="white" name='plus' size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    gap: 20,
    padding: 20
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
