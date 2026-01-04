import { create } from 'zustand';
import { DOZ3Report, Procedure } from '../types';
import { calculateProcedureTotalDose, calculateReportTotalDose } from '../utils/calculations';
import { reportApi } from '../services/reportApi';

interface DOZ3State {
  currentReport: DOZ3Report | null;
  reports: DOZ3Report[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReports: () => Promise<void>;
  fetchReport: (id: string) => Promise<void>;
  createReport: (data: {
    organization: DOZ3Report['organization'];
    responsible: DOZ3Report['responsible'];
    period: DOZ3Report['period'];
  }) => Promise<void>;
  saveCurrentReport: () => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  setCurrentReport: (report: DOZ3Report | null) => void;

  addProcedure: (procedure: Omit<Procedure, 'id' | 'totalDose_personmGy'>) => void;
  updateProcedure: (procedureId: string, data: Partial<Procedure>) => void;
  removeProcedure: (procedureId: string) => void;

  clearError: () => void;
}

export const useDOZ3Store = create<DOZ3State>((set, get) => ({
  currentReport: null,
  reports: [],
  isLoading: false,
  error: null,

  // Получить все отчеты
  fetchReports: async () => {
    set({ isLoading: true, error: null });
    try {
      const reports = await reportApi.getAll();
      set({ reports, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка загрузки отчетов',
        isLoading: false
      });
    }
  },

  // Получить отчет по ID
  fetchReport: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const report = await reportApi.getById(id);
      set({ currentReport: report, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка загрузки отчета',
        isLoading: false
      });
    }
  },

  // Создать новый отчет
  createReport: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newReport: DOZ3Report = {
        id: crypto.randomUUID(),
        organization: data.organization,
        responsible: data.responsible,
        period: data.period,
        procedures: [],
        totalDose_personmGy: 0,
        status: 'draft',
      };

      const createdReport = await reportApi.create(newReport);
      set((state) => ({
        currentReport: createdReport,
        reports: [...state.reports, createdReport],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка создания отчета',
        isLoading: false
      });
    }
  },

  // Сохранить текущий отчет
  saveCurrentReport: async () => {
    const { currentReport } = get();
    if (!currentReport) return;

    set({ isLoading: true, error: null });
    try {
      const updatedReport = await reportApi.update(currentReport.id, currentReport);
      set((state) => ({
        currentReport: updatedReport,
        reports: state.reports.map((r) => r.id === updatedReport.id ? updatedReport : r),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка сохранения отчета',
        isLoading: false
      });
    }
  },

  // Удалить отчет
  deleteReport: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await reportApi.delete(id);
      set((state) => ({
        reports: state.reports.filter((r) => r.id !== id),
        currentReport: state.currentReport?.id === id ? null : state.currentReport,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Ошибка удаления отчета',
        isLoading: false
      });
    }
  },

  // Установить текущий отчет
  setCurrentReport: (report) => {
    set({ currentReport: report });
  },

  // Добавить процедуру (локально, без сохранения в БД)
  addProcedure: (procedureData) => {
    const { currentReport } = get();
    if (!currentReport) return;

    const totalDose = calculateProcedureTotalDose(
      procedureData.count,
      procedureData.dosePerProc_mGy
    );

    const newProcedure: Procedure = {
      id: crypto.randomUUID(),
      totalDose_personmGy: totalDose,
      ...procedureData
    };

    const updatedProcedures = [...currentReport.procedures, newProcedure];

    set((state) => ({
      currentReport: state.currentReport
        ? {
            ...state.currentReport,
            procedures: updatedProcedures,
            totalDose_personmGy: calculateReportTotalDose(updatedProcedures),
          }
        : null
    }));
  },

  // Обновить процедуру (локально, без сохранения в БД)
  updateProcedure: (procedureId, data) => {
    const { currentReport } = get();
    if (!currentReport) return;

    const updatedProcedures = currentReport.procedures.map((proc) => {
      if (proc.id === procedureId) {
        const updatedProc = { ...proc, ...data };
        // Пересчитать коллективную дозу если изменилось количество или доза
        if (data.count !== undefined || data.dosePerProc_mGy !== undefined) {
          updatedProc.totalDose_personmGy = calculateProcedureTotalDose(
            updatedProc.count,
            updatedProc.dosePerProc_mGy
          );
        }
        return updatedProc;
      }
      return proc;
    });

    set((state) => ({
      currentReport: state.currentReport
        ? {
            ...state.currentReport,
            procedures: updatedProcedures,
            totalDose_personmGy: calculateReportTotalDose(updatedProcedures),
          }
        : null
    }));
  },

  // Удалить процедуру (локально, без сохранения в БД)
  removeProcedure: (procedureId) => {
    const { currentReport } = get();
    if (!currentReport) return;

    const updatedProcedures = currentReport.procedures.filter(
      (proc) => proc.id !== procedureId
    );

    set((state) => ({
      currentReport: state.currentReport
        ? {
            ...state.currentReport,
            procedures: updatedProcedures,
            totalDose_personmGy: calculateReportTotalDose(updatedProcedures),
          }
        : null
    }));
  },

  // Очистить ошибку
  clearError: () => {
    set({ error: null });
  }
}));
