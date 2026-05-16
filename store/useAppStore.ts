import { create } from 'zustand';

type AppState = {
  darkMode: boolean;
  notifications: string[];
  toggleDarkMode: () => void;
  pushNotification: (msg: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  darkMode: true,
  notifications: [
    'Vehicle departing Orlando West at 06:20.',
    'Invoice for May ready for download.'
  ],
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  pushNotification: (msg) =>
    set((state) => ({ notifications: [msg, ...state.notifications].slice(0, 6) }))
}));
