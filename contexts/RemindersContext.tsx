import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type Reminder = {
    name: string;
    time: string;
    image?: string;
    location?: string;
    contact?: string;
};

type RemindersStorageType = {
    [username: string]: Reminder[];
};

type RemindersContextType = {
    reminders: Reminder[];
    addReminder: (reminder: Reminder) => Promise<void>;
    clearReminders: () => Promise<void>;
    removeReminder: (name: string) => Promise<void>;
};

const RemindersContext = createContext<RemindersContextType | null>(null);

async function getRemindersStorage(): Promise<RemindersStorageType> {
    try {
        const remindersStorage = await AsyncStorage.getItem('reminders');
        if (remindersStorage) {
            console.debug("Retrieved reminders storage:", remindersStorage);
            return JSON.parse(remindersStorage) as RemindersStorageType;
        }
    } catch {
        return {};
    }
    return {};
}

async function scheduleReminderNotification(reminder: Reminder) {
    try {
        const [hour, minute] = reminder.time.split(':').map(Number);
        console.log(`Scheduling notification for ${reminder.name} at ${hour}:${minute}`);

        const result = await Notifications.scheduleNotificationAsync({
            identifier: reminder.name,
            content: {
                title: `💊 Recordatorio: ${reminder.name}`,
                body: `Es hora de tomar tu medicamento: ${reminder.name}`,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DAILY,
                hour: hour,
                minute: minute,
            }
        });
        console.log('Notification scheduled successfully:', result);
    } catch (error) {
        console.error('Failed to schedule notification:', error);
    }
}

async function cancelReminderNotification(name: string) { 
    try {
        console.log(`Cancelling notification for ${name}`);
        await Notifications.cancelScheduledNotificationAsync(name);
        console.log('Notification cancelled successfully');
    } catch (error) {
        console.error('Failed to cancel notification:', error);
    }
}

export function RemindersProvider({ children }: { children: React.ReactNode }) {
    const authContext = useContext(AuthContext);
    const username = authContext?.user;
    const [reminders, setReminders] = useState<Reminder[]>([]);

    useEffect(() => {
        Notifications.requestPermissionsAsync().then((status) => {
            console.log('Notification permissions:', status);
        });
    }, []);

    useEffect(() => {
        console.log('Username changed to:', username);
        const loadReminders = async () => {
            if (username) {
                console.log('Loading reminders for user:', username);
                const storage = await getRemindersStorage();
                const userReminders = storage[username] || [];
                console.log('Loaded reminders:', userReminders);
                setReminders(userReminders);
            } else {
                console.log('Clearing reminders (user logged out)');
                setReminders([]);
                const allNotifications = await Notifications.getAllScheduledNotificationsAsync();
                console.log('Cancelling notifications:', allNotifications.length);
                for (const notification of allNotifications) {
                    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
                }
            }
        };
        loadReminders();
    }, [username]);

    async function addReminder(reminder: Reminder) {
        if (!username) return;
        console.log('Adding reminder:', reminder);
        const newReminders = [...reminders, reminder];
        setReminders(newReminders);
        const storage = await getRemindersStorage();
        await AsyncStorage.setItem('reminders', JSON.stringify({ ...storage, [username]: newReminders }));
        await scheduleReminderNotification(reminder);
    }

    async function clearReminders() {
        if (!username) return;
        setReminders([]);
        const storage = await getRemindersStorage();
        await AsyncStorage.setItem('reminders', JSON.stringify({ ...storage, [username]: [] }));
    }

    async function removeReminder(name: string) {
        if (!username) return;
        console.log('Removing reminder:', name);
        await cancelReminderNotification(name);
        const newReminders = reminders.filter((r) => r.name !== name);
        setReminders(newReminders);
        const storage = await getRemindersStorage();
        await AsyncStorage.setItem('reminders', JSON.stringify({ ...storage, [username]: newReminders }));
    }

    return (
        <RemindersContext.Provider value={{ reminders, addReminder, clearReminders, removeReminder }}>
            {children}
        </RemindersContext.Provider>
    );
}

export function useReminders() {
    const context = useContext(RemindersContext);
    if (!context) {
        throw new Error("useReminders must be used within a RemindersProvider");
    }
    return context;
}