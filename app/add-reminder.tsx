import { ThemedText } from '@/components/themed-text';

import { useReminders } from '@/contexts/RemindersContext';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AddReminder() {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const { addReminder } = useReminders();
    const router = useRouter();

    function openTimePicker() {
        DateTimePickerAndroid.open({
            value: date,
            onChange(event, date) {
                if (date) setDate(date);
            },
            mode: "time",
            is24Hour: true,
        });
    }

    function onAddReminder() {
        if (!name) return;
        addReminder({ name, time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }) });
        router.back();
    }

  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.form}>
              <TextInput placeholder='Nombre del medicamento' style={styles.input} value={name} onChangeText={setName} />
              <TouchableOpacity onPress={openTimePicker} style={styles.input}>
                    <ThemedText>Seleccionar hora: {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={onAddReminder} style={styles.addReminderBtn}>
                    <ThemedText>Agregar recordatorio</ThemedText>
              </TouchableOpacity>
          </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 5,
        padding: 5,
    },
    form: {
        padding: 20,
        flexDirection: 'column',
    },
    input: {
        borderRadius: 5,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
    },
    addReminderBtn: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    }
})

export default AddReminder