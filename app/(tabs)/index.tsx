import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import MedicationReminder from '@/components/medication-reminder';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useReminders } from '@/contexts/RemindersContext';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { reminders } = useReminders();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ThemedText type='title'>💊 Recordatorios de medicación</ThemedText>
      <View style={styles.container}>
        {reminders.length === 0 ? (
          <ThemedText>No tienes recordatorios. Agrega uno para empezar.</ThemedText>
        ): (
          <FlatList
          style={{ width: '100%' }}
          data={reminders}
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
