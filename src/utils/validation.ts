import { DOZ3Report, Procedure, ValidationResult } from '../types';
import { getProcedureDefinition } from '../constants/procedures';

/**
 * Проверка дозы процедуры на соответствие референсным уровням
 */
export function validateProcedureDose(procedure: Procedure): ValidationResult {
  const procedureDefinition = getProcedureDefinition(procedure.procedureId);

  if (!procedureDefinition) {
    return { isValid: false, error: 'Процедура не найдена в справочнике' };
  }

  const referenceLevel = procedureDefinition.referenceLevel_mGy ||
    procedureDefinition.referenceLevel_mGy_cm || 0;

  if (procedure.dosePerProc_mGy > referenceLevel * 1.5) {
    return {
      isValid: false,
      error: `Доза ${procedure.dosePerProc_mGy} мГр превышает референсный уровень в 1.5 раза. Недопустимо.`
    };
  }

  if (procedure.dosePerProc_mGy > referenceLevel) {
    return {
      isValid: true,
      warning: `Доза ${procedure.dosePerProc_mGy} мГр превышает референсный уровень ${referenceLevel} мГр. Требуется обоснование.`
    };
  }

  return { isValid: true };
}

/**
 * Проверка заполненности отчёта
 */
export function validateReport(report: DOZ3Report): string[] {
  const errors: string[] = [];

  if (!report.organization.name) errors.push('Не указано название организации');
  if (!report.organization.address) errors.push('Не указан адрес организации');
  if (!report.organization.OKPO) errors.push('Не указан ОКПО');
  if (!report.responsible.name) errors.push('Не указано ответственное лицо');
  if (!report.responsible.position) errors.push('Не указана должность ответственного');
  if (!report.responsible.phone) errors.push('Не указан телефон ответственного');
  if (!report.period.year) errors.push('Не указан отчетный период');
  if (report.procedures.length === 0) errors.push('Не добавлено ни одной процедуры');

  report.procedures.forEach((proc, index) => {
    if (!proc.name) errors.push(`Процедура ${index + 1}: не указано название`);
    if (proc.count <= 0) errors.push(`Процедура ${index + 1}: количество должно быть больше 0`);
    if (proc.dosePerProc_mGy <= 0) errors.push(`Процедура ${index + 1}: доза должна быть больше 0`);
  });

  return errors;
}
