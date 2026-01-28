import { Procedure } from '../types';

/**
 * Рассчитывает коллективную дозу для процедуры
 * @param count - Количество процедур
 * @param dosePerProc - Доза на одну процедуру в мГр
 * @returns Коллективная доза в чел·мГр
 */
export function calculateProcedureTotalDose(count: number, dosePerProc: number): number {
  return count * dosePerProc;
}

/**
 * Рассчитывает общую коллективную дозу отчёта
 * @param procedures - Список процедур
 * @returns Общая коллективная доза в чел·мГр
 */
export function calculateReportTotalDose(procedures: Procedure[]): number {
  return procedures.reduce((sum, proc) => sum + proc.totalDose_personmGy, 0);
}

/**
 * Рассчитывает общее количество процедур в отчёте
 * @param procedures - Список процедур
 * @returns Общее количество процедур
 */
export function calculateReportTotalProcedures(procedures: Procedure[]): number {
  return procedures.reduce((sum, proc) => sum + proc.count, 0);
}
