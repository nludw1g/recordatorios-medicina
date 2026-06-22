import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { AuthContext } from '@/contexts/AuthContext'
import { Reminder, useRemindersStore } from '@/store/reminders'
import React, { useContext } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

function MedicationReminder({ reminder }: { reminder: Reminder }) {
    const authContext = useContext(AuthContext)!;
    const { removeReminder } = useRemindersStore();

  return (
      <ThemedView style={styles.container}>
          <View>
              <ThemedText>{reminder.name}</ThemedText>
              <ThemedText>{reminder.time}</ThemedText>
              {reminder.location && <ThemedText>Ubicación: {reminder.location}</ThemedText>}
              {reminder.contact && <ThemedText>Contacto: {reminder.contact}</ThemedText>}
          </View>
          <View style={styles.buttonsContainer}>
              {reminder.image && <Image source={{ uri: reminder.image }} style={{ width: 50, height: 50, borderRadius: 25 }} />}
              <TouchableOpacity testID="remove-button" onPress={() => removeReminder(authContext.user!, reminder.name)}>
                  <IconSymbol name='trash' color="black" />
              </TouchableOpacity>
          </View>
      </ThemedView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        width: '100%',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 10,
        alignContent: 'center',
        justifyContent: 'center',
    }
})

export default MedicationReminder