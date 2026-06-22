import { setupRemindersStore, useRemindersStore } from "@/store/reminders";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

describe('Reminders store', () => {
  beforeEach(() => {
    useRemindersStore.setState({ reminders: {} });
    jest.clearAllMocks();
  });

  it('adds and removes reminders and schedules/cancels notifications', async () => {
    const scheduleMock = Notifications.scheduleNotificationAsync;
    const cancelMock = Notifications.cancelScheduledNotificationAsync;

    const username = 'user1';
    const reminder = { name: 'Vitamin', time: '09:30' };

    await useRemindersStore.getState().addReminder(username, reminder);

    const stateAfter = useRemindersStore.getState().reminders;
    expect(stateAfter[username]).toHaveLength(1);
    expect(scheduleMock).toHaveBeenCalled();

    await useRemindersStore.getState().removeReminder(username, 'Vitamin');
    expect(useRemindersStore.getState().reminders[username]).toHaveLength(0);
    expect(cancelMock).toHaveBeenCalledWith('Vitamin');
  });
});

describe('Business logic', () => {
  it('setupRemindersStore loads data from AsyncStorage', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({ user1: [{ name: 'X', time: '10:00' }] })
    );

    await setupRemindersStore();

    expect(useRemindersStore.getState().reminders.user1).toHaveLength(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('reminders');
  });
});