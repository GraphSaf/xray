import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DoseSettings, defaultDoseSettings } from '../types/doseSettings';

interface DoseSettingsState {
  settings: DoseSettings;
  updateIntraoralDose: (key: keyof DoseSettings['intraoral'], value: number) => void;
  updatePanoramicDose: (key: keyof DoseSettings['panoramic'], value: number) => void;
  updateCBCTDose: (
    patientType: keyof DoseSettings['cbct'],
    segment: keyof DoseSettings['cbct']['average'],
    value: number
  ) => void;
  resetToDefaults: () => void;
}

export const useDoseSettingsStore = create<DoseSettingsState>()(
  persist(
    (set) => ({
      settings: defaultDoseSettings,

      updateIntraoralDose: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            intraoral: {
              ...state.settings.intraoral,
              [key]: value,
            },
          },
        })),

      updatePanoramicDose: (key, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            panoramic: {
              ...state.settings.panoramic,
              [key]: value,
            },
          },
        })),

      updateCBCTDose: (patientType, segment, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            cbct: {
              ...state.settings.cbct,
              [patientType]: {
                ...state.settings.cbct[patientType],
                [segment]: value,
              },
            },
          },
        })),

      resetToDefaults: () =>
        set({ settings: defaultDoseSettings }),
    }),
    {
      name: 'dose-settings-storage',
    }
  )
);
