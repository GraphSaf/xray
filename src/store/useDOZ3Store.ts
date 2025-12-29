import { create } from 'zustand';
import { DOZ3Report, Procedure } from '../types';
import { calculateProcedureTotalDose, calculateReportTotalDose, calculateReportTotalProcedures } from '../utils/calculations';

interface DOZ3State {
  currentReport: DOZ3Report | null;
  reports: DOZ3Report[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createReport: (data: Partial<DOZ3Report>) => void;
  updateReport: (id: string, data: Partial<DOZ3Report>) => void;
  deleteReport: (id: string) => void;
  setCurrentReport: (report: DOZ3Report | null) => void;

  addProcedure: (procedure: Omit<Procedure, 'id' | 'totalDose_personmGy'>) => void;
  updateProcedure: (procedureId: string, data: Partial<Procedure>) => void;
  removeProcedure: (procedureId: string) => void;

  recalculateTotals: () => void;
}

export const useDOZ3Store = create<DOZ3State>((set, get) => ({
  currentReport: null,
  reports: [],
  isLoading: false,
  error: null,

  createReport: (data) => {
    const newReport: DOZ3Report = {
      id: crypto.randomUUID(),
      version: '1.0',
      organization: data.organization || {
        name: '',
        address: '',
        license: '',
        inn: ''
      },
      responsible: data.responsible || {
        chiefDoctor: '',
        chiefDoctorPosition: '',
        radiationOfficer: '',
        radiationOfficerPosition: ''
      },
      period: data.period || {
        year: new Date().getFullYear()
      },
      clinicType: data.clinicType || 'dental',
      procedures: data.procedures || [],
      equipment: data.equipment || [],
      totalProcedures: 0,
      totalDose_personmGy: 0,
      createdAt: new Date(),
      modifiedAt: new Date(),
      status: 'draft',
      ...data
    };

    set((state) => ({
      currentReport: newReport,
      reports: [...state.reports, newReport]
    }));
  },

  updateReport: (id, data) => {
    set((state) => ({
      reports: state.reports.map((report) =>
        report.id === id
          ? { ...report, ...data, modifiedAt: new Date() }
          : report
      ),
      currentReport:
        state.currentReport?.id === id
          ? { ...state.currentReport, ...data, modifiedAt: new Date() }
          : state.currentReport
    }));
  },

  deleteReport: (id) => {
    set((state) => ({
      reports: state.reports.filter((report) => report.id !== id),
      currentReport: state.currentReport?.id === id ? null : state.currentReport
    }));
  },

  setCurrentReport: (report) => {
    set({ currentReport: report });
  },

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
            totalProcedures: calculateReportTotalProcedures(updatedProcedures),
            totalDose_personmGy: calculateReportTotalDose(updatedProcedures),
            modifiedAt: new Date()
          }
        : null
    }));
  },

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
            totalProcedures: calculateReportTotalProcedures(updatedProcedures),
            totalDose_personmGy: calculateReportTotalDose(updatedProcedures),
            modifiedAt: new Date()
          }
        : null
    }));
  },

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
            totalProcedures: calculateReportTotalProcedures(updatedProcedures),
            totalDose_personmGy: calculateReportTotalDose(updatedProcedures),
            modifiedAt: new Date()
          }
        : null
    }));
  },

  recalculateTotals: () => {
    const { currentReport } = get();
    if (!currentReport) return;

    const procedures = currentReport.procedures.map((proc) => ({
      ...proc,
      totalDose_personmGy: calculateProcedureTotalDose(
        proc.count,
        proc.dosePerProc_mGy
      )
    }));

    set((state) => ({
      currentReport: state.currentReport
        ? {
            ...state.currentReport,
            procedures,
            totalProcedures: calculateReportTotalProcedures(procedures),
            totalDose_personmGy: calculateReportTotalDose(procedures),
            modifiedAt: new Date()
          }
        : null
    }));
  }
}));
