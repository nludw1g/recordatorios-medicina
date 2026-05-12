import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { IconSymbol } from '@/components/ui/icon-symbol'
import { Reminder, useReminders } from '@/contexts/RemindersContext'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

function MedicationReminder({ reminder }: { reminder: Reminder }) {
    const { removeReminder } = useReminders();

  return (
      <ThemedView style={styles.container}>
          <View>
              <ThemedText>{reminder.name}</ThemedText>
              <ThemedText>{reminder.time}</ThemedText>
          </View>
          <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => removeReminder(reminder.name)}>
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