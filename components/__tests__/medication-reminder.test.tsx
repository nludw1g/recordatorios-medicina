import { useRemindersStore } from "@/store/reminders";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { AuthContext } from "../../contexts/AuthContext";
import MedicationReminder from "../medication-reminder";

const originalStoreFunctions = useRemindersStore.getState();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('MedicationReminder component', () => {
  afterEach(() => {
    useRemindersStore.setState(originalStoreFunctions);
  });

  it('renders and responds to remove press', async () => {
    const mockRemove = jest.fn(async () => {});
    useRemindersStore.setState({ removeReminder: mockRemove });

    const reminder = { name: 'Aspirin', time: '08:00' };

    await render(
      <AuthContext.Provider value={{ user: 'testuser', setUser: jest.fn() } as any}>
        <MedicationReminder reminder={reminder} />
      </AuthContext.Provider>
    );

    expect(screen.getByText('Aspirin')).toBeTruthy();
    expect(screen.getByText('08:00')).toBeTruthy();

    fireEvent.press(screen.getByTestId('remove-button'));

    expect(mockRemove).toHaveBeenCalledWith('testuser', 'Aspirin');
  });
});
