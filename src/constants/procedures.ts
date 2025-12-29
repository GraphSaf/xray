import { ProcedureDefinition } from '../types';

/**
 * Справочник процедур для стоматологии (для MVP)
 * Полный справочник будет добавлен позже
 */
export const DENTAL_PROCEDURES: ProcedureDefinition[] = [
  {
    id: 'dent_intra_tooth',
    name: 'Интраоральный снимок (зуб)',
    category: 'dental',
    defaultDose_mGy: 0.15,
    referenceLevel_mGy: 0.3,
    metric: 'входная_доза',
    description: 'Входная доза на поверхность пациента'
  },
  {
    id: 'dent_intra_segment',
    name: 'Интраоральный снимок (сегмент)',
    category: 'dental',
    defaultDose_mGy: 0.5,
    referenceLevel_mGy: 1.0,
    metric: 'входная_доза'
  },
  {
    id: 'dent_optg',
    name: 'ОПТГ (панорамный снимок)',
    category: 'dental',
    defaultDose_mGy: 0.03,
    referenceLevel_mGy: 0.05,
    metric: 'эффективная_доза'
  },
  {
    id: 'dent_ct_one_jaw',
    name: 'КТ одной челюсти',
    category: 'dental',
    defaultDose_mGy: 0.1,
    referenceLevel_mGy: 0.3,
    metric: 'эффективная_доза'
  },
  {
    id: 'dent_ct_both_jaws',
    name: 'КТ обеих челюстей',
    category: 'dental',
    defaultDose_mGy: 0.15,
    referenceLevel_mGy: 0.5,
    metric: 'эффективная_доза'
  },
  {
    id: 'dent_ceph',
    name: 'Цефалометрия',
    category: 'dental',
    defaultDose_mGy: 0.025,
    referenceLevel_mGy: 0.04,
    metric: 'эффективная_доза'
  }
];

/**
 * Получить процедуру по ID
 */
export function getProcedureDefinition(id: string): ProcedureDefinition | undefined {
  return DENTAL_PROCEDURES.find(p => p.id === id);
}

/**
 * Получить процедуры для определённой категории
 */
export function getProceduresByCategory(category: string): ProcedureDefinition[] {
  return DENTAL_PROCEDURES.filter(p => p.category === category);
}
