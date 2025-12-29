import * as XLSX from 'xlsx';
import { DOZ3Report } from '../types';

/**
 * Экспортирует отчёт в формат Excel
 */
export function exportToExcel(report: DOZ3Report): void {
  const wb = XLSX.utils.book_new();

  // Подготовка данных для листа
  const wsData: any[][] = [
    ['ФОРМА №3-ДОЗ'],
    ['Сведения о коллективных дозах облучения пациентов при рентгенологических исследованиях'],
    [],
    [`Организация: ${report.organization.name}`],
    [`Адрес: ${report.organization.address}`],
    [`Лицензия: ${report.organization.license}`],
    [`Отчетный период: ${report.period.quarter ? `${report.period.quarter} квартал` : ''} ${report.period.year} ${report.period.quarter ? 'года' : 'год'}`],
    [],
    ['№ п/п', 'Наименование рентгенологического исследования', 'Возрастная группа', 'Количество процедур', 'Доза на процедуру, мГр', 'Коллективная доза, чел·мГр']
  ];

  // Добавляем процедуры
  report.procedures.forEach((proc, index) => {
    wsData.push([
      index + 1,
      proc.name,
      proc.ageGroup === 'adult' ? 'Взрослые' : 'Дети',
      proc.count,
      proc.dosePerProc_mGy,
      proc.totalDose_personmGy
    ]);
  });

  // Итоговая строка
  wsData.push(
    [],
    ['', 'ИТОГО:', '', report.totalProcedures, '', report.totalDose_personmGy],
    [],
    [`Руководитель: ______________ (${report.responsible.chiefDoctor}, ${report.responsible.chiefDoctorPosition})`],
    [`Ответственный за радиационную безопасность: ______________ (${report.responsible.radiationOfficer}, ${report.responsible.radiationOfficerPosition})`],
    [`Дата составления: ${new Date().toLocaleDateString('ru-RU')}`]
  );

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Настройка ширины столбцов
  ws['!cols'] = [
    { wch: 5 },   // №
    { wch: 50 },  // Наименование
    { wch: 15 },  // Возраст
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
