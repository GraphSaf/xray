/**
 * Типы данных для приложения ДОЗ-3
 */

export interface DOZ3Report {
  id: string;
  version: string;
  organization: Organization;
  responsible: Responsible;
  period: Period;
  clinicType: 'dental' | 'xray' | 'ct' | 'fluorography';
  procedures: Procedure[];
  equipment: Equipment[];
  totalProcedures: number;
  totalDose_personmGy: number;
  createdAt: Date;
  modifiedAt: Date;
  status: 'draft' | 'completed' | 'archived';
}

export interface Organization {
  name: string;
  address: string;
  license: string;
  inn: string;
}

export interface Responsible {
  chiefDoctor: string;
  chiefDoctorPosition: string;
  radiationOfficer: string;
  radiationOfficerPosition: string;
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
  equipmentId?: string;
  ageGroup: 'child' | 'adult';
  totalDose_personmGy: number;
  notes?: string;
}

export interface Equipment {
  id: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  inventoryNumber: string;
  isDigital: boolean;
  typicalDose_mGy: number;
  registrationCertificate: string;
  installationDate: Date;
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
