import { pb } from '../lib/pocketbase';
import { DENTAL_PROCEDURES } from '../constants/procedures';
import { ProcedureDefinition } from '../types';

/**
 * Максимальное количество процедур в демо-режиме
 */
export const DEMO_PROCEDURE_LIMIT = 3;

/**
 * Проверка авторизации пользователя
 */
export function isAuthenticated(): boolean {
  return pb.authStore.isValid;
}

/**
 * Получить доступные процедуры в зависимости от режима (демо/полный)
 */
export function getAvailableProcedures(): ProcedureDefinition[] {
  if (isAuthenticated()) {
    // Авторизованные пользователи имеют доступ ко всем процедурам
    return DENTAL_PROCEDURES;
  }

  // Неавторизованные пользователи - ограниченный набор (демо)
  return DENTAL_PROCEDURES.slice(0, DEMO_PROCEDURE_LIMIT);
}

/**
 * Проверка, является ли процедура доступной в текущем режиме
 */
export function isProcedureAvailable(procedureId: string): boolean {
  const availableProcedures = getAvailableProcedures();
  return availableProcedures.some(p => p.id === procedureId);
}

/**
 * Фильтрация процедур отчета в зависимости от режима (для экспорта)
 */
export function filterProceduresForExport<T extends { procedureId: string }>(
  procedures: T[]
): T[] {
  if (isAuthenticated()) {
    // Авторизованные пользователи экспортируют все процедуры
    return procedures;
  }

  // Неавторизованные пользователи - только демо-процедуры
  const availableProcedureIds = getAvailableProcedures().map(p => p.id);
  return procedures.filter(p => availableProcedureIds.includes(p.procedureId));
}

/**
 * Получить сообщение о демо-режиме
 */
export function getDemoModeMessage(): string | null {
  if (isAuthenticated()) {
    return null;
  }

  return `Демо-режим: доступны только ${DEMO_PROCEDURE_LIMIT} процедуры из справочника. Войдите через VK для доступа ко всем процедурам.`;
}
