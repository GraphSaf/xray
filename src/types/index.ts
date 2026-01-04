/**
 * Типы данных для приложения ДОЗ-3
 */

export interface DOZ3Report {
  id: string;
  organization: Organization;
  responsible: Responsible;
  period: Period;
  procedures: Procedure[];
  totalDose_personmGy: number;
  status: 'draft' | 'completed' | 'archived';
}

export interface Organization {
  name: string;
  address: string;
  OKPO: string;
}

export interface Responsible {
  name: string;
  position: string;
  phone: string;
}

export interface Period {
  year: number;
  quarter?: 1 | 2 | 3 | 4;
}

export interface Procedure {
  id: string;
  procedureId: string;
  name: string;
  count: number;
  dosePerProc_mGy: number;
  totalDose_personmGy: number;
}

export interface ProcedureDefinition {
  id: string;
  name: string;
  category: 'dental' | 'xray' | 'ct' | 'fluorography';
  defaultDose_mGy?: number;
  defaultDose_mGy_cm?: number;
  referenceLevel_mGy?: number;
  referenceLevel_mGy_cm?: number;
  metric: 'входная_доза' | 'эффективная_доза' | 'DLP';
  description?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}
