import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { create } from "zustand";

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

type ReminderState = {
    reminders: Record<string, Reminder[]>;
    addReminder: (username: string,reminder: Reminder) => Promise<void>;
    clearReminders: (username: string) => Promise<void>;
    removeReminder: (username: string, name: string) => Promise<void>;
    getRemindersForUser: (username: string) => Promise<Reminder[]>;
}

const REMINDERS_STORAGE_KEY = 'reminders';

async function getRemindersStorage(): Promise<RemindersStorageType> {
    try {
        const remindersStorage = await AsyncStorage.getItem(REMINDERS_STORAGE_KEY);
        if (remindersStorage) {
            console.debug("Retrieved reminders storage:", remindersStorage);
            return JSON.parse(remindersStorage) as RemindersStorageType;
        }
    } catch {
        return {};
    }
    return {};
}

async function saveRemindersForUser(username: string, reminders: Reminder[]) {
    const storage = await getRemindersStorage();
    await AsyncStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify({ ...storage, [username]: reminders }));
    console.debug(`Saved reminders for ${username}:`, reminders);
}

async function cancelReminderNotifications(reminders: Reminder[]) {
    for (const reminder of reminders) {
        await cancelReminderNotification(reminder.name);
    }
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

export const useRemindersStore = create<ReminderState>((set, get) => ({
    reminders: {},
    addReminder: async (username: string, reminder: Reminder) => {
        const currentReminders = get().reminders;
        const newReminders = [...currentReminders[username] || [], reminder];
        set({ reminders: { ...currentReminders, [username]: newReminders } });
        await saveRemindersForUser(username, newReminders);
        await scheduleReminderNotification(reminder);
        console.log(get().reminders);
    },
    clearReminders: async (username: string) => {
        const currentReminders = get().reminders;
        set({ reminders: { ...currentReminders, [username]: [] } });
        await saveRemindersForUser(username, []);
        await cancelReminderNotifications(currentReminders[username] || []);
    },
    removeReminder: async (username: string, name: string) => {
        const currentReminders = get().reminders;
        const newReminders = currentReminders[username]?.filter((r) => r.name !== name) || [];
        set({ reminders: { ...currentReminders, [username]: newReminders } });
        await saveRemindersForUser(username, newReminders);
        await cancelReminderNotification(name);
    },
    getRemindersForUser: async (username: string) => { 
        const userReminders = get().reminders[username] || [];
        return userReminders;
    }
}));

export async function setupRemindersStore() { 
    const storage = await getRemindersStorage();
    useRemindersStore.setState({ reminders: storage });
}