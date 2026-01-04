import PocketBase from 'pocketbase';

// PocketBase URL - можно изменить через переменную окружения
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// Включаем автоматическое обновление auth токена
pb.autoCancellation(false);

// Типы для PocketBase коллекций
export interface PBReport {
  id?: string;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;

  // Поля формы
  organizationName: string;
  organizationAddress: string;
  organizationOKPO: string;

  responsibleName: string;
  responsiblePosition: string;
  responsiblePhone: string;

  periodYear: number;
  periodQuarter?: number;

  procedures: PBProcedure[];
  totalDose_personmGy: number;

  status: 'draft' | 'completed' | 'archived';
}

export interface PBProcedure {
  id: string;
  procedureId: string;
  name: string;
  count: number;
  dosePerProc_mGy: number;
  totalDose_personmGy: number;
}

export default pb;
