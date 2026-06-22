import { ThemedText } from '@/components/themed-text';
import { AuthContext } from '@/contexts/AuthContext';
import { useRemindersStore } from '@/store/reminders';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as Calendar from 'expo-calendar';
import * as Contact from 'expo-contacts';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function AddReminder() {
    const [name, setName] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState('');
    const [location, setLocation] = useState('');
    const [contact, setContact] = useState('');
    const [contacts, setContacts] = useState<Contact.Contact[]>([]);
    const authContext = useContext(AuthContext)!;
    const { addReminder } = useRemindersStore();
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
        addReminder(authContext.user!, { name, time: date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }), image, location, contact });
        Calendar.getCalendarsAsync().then(calendars => {
            const calendar = calendars.find(cal => cal.isPrimary && cal.allowsModifications);
            if (calendar) {
                Calendar.createReminderAsync(calendar.id, {
                    title: `Tomar medicación: ${name}`,
                    startDate: date,
                    recurrenceRule: {
                        frequency: Calendar.Frequency.DAILY,
                    },
                });
            }
        });
        router.back();
    }

    async function onChangeImage() { 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) { 
            Alert.alert("Es necesario otorgar permisos para seleccionar una imagén.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            console.log("Calendar permissions status:", status);
            if (status !== 'granted') {
                Alert.alert("Es necesario otorgar permisos para acceder al calendario.");
            }

            const { status: contactStatus } = await Contact.requestPermissionsAsync();
            console.log("Contact permissions status:", contactStatus);
            if (contactStatus !== 'granted') { 
                Alert.alert("Es necesario otorgar permisos para acceder a los contactos.");
            } else {
                const {data} = await Contact.getContactsAsync({pageSize: 10, fields: [Contact.Fields.Name, Contact.Fields.PhoneNumbers]});
                setContacts(data);
            }

            let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
            console.log("Location permissions status:", locationStatus);
            if (locationStatus !== 'granted') {
                Alert.alert("Es necesario otorgar permisos para acceder a la ubicación.");
            } else {
                const currentLocation = await Location.getCurrentPositionAsync({});
                console.log("Current location:", currentLocation);
                setLocation(`${currentLocation.coords.latitude.toFixed(4)}, ${currentLocation.coords.longitude.toFixed(4)}`);
            }
            
        })();
    }, [])

  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.form}>
              <TextInput placeholder='Nombre del medicamento' style={styles.input} value={name} onChangeText={setName} />
              <TouchableOpacity onPress={openTimePicker} style={styles.input}>
                    <ThemedText>Seleccionar hora: {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}</ThemedText>
              </TouchableOpacity>
              <ThemedText style={{ marginBottom: 10 }}>Ubicación de la farmacia: {location}</ThemedText>
              <TouchableOpacity onPress={onChangeImage} style={styles.input}>
                    <ThemedText>{image ? 'Cambiar imagén' : 'Seleccionar imagén'}</ThemedText>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={styles.image} />}
              {contacts.length > 0 && (
                  <View style={{ marginVertical: 10 }}>
                      <ThemedText>Seleccione el contacto del médico:</ThemedText>
                      {contacts.map(c => (
                            <TouchableOpacity key={c.name} onPress={() => setContact(c.name)} style={{ padding: 5, backgroundColor: c.name === contact ? 'lightgray' : 'transparent', borderRadius: 5, marginTop: 5 }}>
                                <ThemedText>{c.name} {c.phoneNumbers?.[0]?.number}</ThemedText>
                            </TouchableOpacity>
                      ))}
                  </View>
              )}
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
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    }
})

export default AddReminder