import { pb, PBReport } from '../lib/pocketbase';
import { DOZ3Report } from '../types';

const COLLECTION_NAME = 'doz3_reports';

// Конвертация из DOZ3Report в PBReport
function toPBReport(report: DOZ3Report): Omit<PBReport, 'id' | 'created' | 'updated'> {
  return {
    organizationName: report.organization.name,
    organizationAddress: report.organization.address,
    organizationOKPO: report.organization.OKPO,

    responsibleName: report.responsible.name,
    responsiblePosition: report.responsible.position,
    responsiblePhone: report.responsible.phone,

    periodYear: report.period.year,
    periodQuarter: report.period.quarter,

    procedures: report.procedures,
    totalDose_personmGy: report.totalDose_personmGy,
    status: report.status,
  };
}

// Конвертация из PBReport в DOZ3Report
function fromPBReport(pbReport: PBReport): DOZ3Report {
  return {
    id: pbReport.id || '',
    organization: {
      name: pbReport.organizationName,
      address: pbReport.organizationAddress,
      OKPO: pbReport.organizationOKPO,
    },
    responsible: {
      name: pbReport.responsibleName,
      position: pbReport.responsiblePosition,
      phone: pbReport.responsiblePhone,
    },
    period: {
      year: pbReport.periodYear,
      quarter: pbReport.periodQuarter as 1 | 2 | 3 | 4 | undefined,
    },
    procedures: pbReport.procedures,
    totalDose_personmGy: pbReport.totalDose_personmGy,
    status: pbReport.status,
  };
}

export const reportApi = {
  // Получить все отчеты
  async getAll(): Promise<DOZ3Report[]> {
    try {
      const records = await pb.collection(COLLECTION_NAME).getFullList<PBReport>({
        sort: '-created',
      });
      return records.map(fromPBReport);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  },

  // Получить отчет по ID
  async getById(id: string): Promise<DOZ3Report> {
    try {
      const record = await pb.collection(COLLECTION_NAME).getOne<PBReport>(id);
      return fromPBReport(record);
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  },

  // Создать новый отчет
  async create(report: DOZ3Report): Promise<DOZ3Report> {
    try {
      const pbData = toPBReport(report);
      const record = await pb.collection(COLLECTION_NAME).create<PBReport>(pbData);
      return fromPBReport(record);
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  },

  // Обновить отчет
  async update(id: string, report: DOZ3Report): Promise<DOZ3Report> {
    try {
      const pbData = toPBReport(report);
      const record = await pb.collection(COLLECTION_NAME).update<PBReport>(id, pbData);
      return fromPBReport(record);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  },

  // Удалить отчет
  async delete(id: string): Promise<void> {
    try {
      await pb.collection(COLLECTION_NAME).delete(id);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  },

  // Получить отчеты за период
  async getByPeriod(year: number, quarter?: number): Promise<DOZ3Report[]> {
    try {
      let filter = `periodYear = ${year}`;
      if (quarter) {
        filter += ` && periodQuarter = ${quarter}`;
      }

      const records = await pb.collection(COLLECTION_NAME).getFullList<PBReport>({
        filter,
        sort: '-created',
      });
      return records.map(fromPBReport);
    } catch (error) {
      console.error('Error fetching reports by period:', error);
      throw error;
    }
  },
};
