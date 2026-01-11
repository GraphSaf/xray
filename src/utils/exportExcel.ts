import * as XLSX from 'xlsx';
import { DOZ3Report } from '../types';
import { filterProceduresForExport } from './demoMode';

/**
 * Экспортирует отчёт в формат Excel
 */
export function exportToExcel(report: DOZ3Report): void {
  const wb = XLSX.utils.book_new();

  // Фильтруем процедуры в зависимости от режима (демо/полный)
  const procedures = filterProceduresForExport(report.procedures);
  const totalProcedures = procedures.reduce((sum, p) => sum + p.count, 0);
  const totalDose = procedures.reduce((sum, p) => sum + p.totalDose_personmGy, 0);

  // Подготовка данных для листа
  const wsData: any[][] = [
    ['ФОРМА №3-ДОЗ'],
    ['Сведения о коллективных дозах облучения пациентов при рентгенологических исследованиях'],
    [],
    [`Организация: ${report.organization.name}`],
    [`Адрес: ${report.organization.address}`],
    [`ОКПО: ${report.organization.OKPO}`],
    [`Отчетный период: ${report.period.quarter ? `${report.period.quarter} квартал` : ''} ${report.period.year} ${report.period.quarter ? 'года' : 'год'}`],
    [],
    ['№ п/п', 'Наименование рентгенологического исследования', 'Количество процедур', 'Доза на процедуру, мГр', 'Коллективная доза, чел·мГр']
  ];

  // Добавляем процедуры
  procedures.forEach((proc, index) => {
    wsData.push([
      index + 1,
      proc.name,
      proc.count,
      proc.dosePerProc_mGy,
      proc.totalDose_personmGy
    ]);
  });

  // Итоговая строка
  wsData.push(
    [],
    ['', 'ИТОГО:', totalProcedures, '', totalDose],
    [],
    [`Ответственное лицо: ______________ (${report.responsible.name}, ${report.responsible.position})`],
    [`Телефон: ${report.responsible.phone}`],
    [`Дата составления: ${new Date().toLocaleDateString('ru-RU')}`]
  );

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Настройка ширины столбцов
  ws['!cols'] = [
    { wch: 5 },   // №
    { wch: 50 },  // Наименование
    { wch: 15 },  // Количество
    { wch: 20 },  // Доза
    { wch: 25 }   // Коллективная доза
  ];

  XLSX.utils.book_append_sheet(wb, ws, '3-ДОЗ');

  // Генерация имени файла
  const fileName = `3-DOZ_${report.organization.name.replace(/\s+/g, '_')}_${report.period.year}.xlsx`;

  // Сохранение файла
  XLSX.writeFile(wb, fileName);
}
