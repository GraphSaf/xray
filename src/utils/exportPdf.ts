import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DOZ3Report } from '../types';
import { filterProceduresForExport } from './demoMode';

// Добавляем русский шрифт (необходимо для корректного отображения кириллицы)
// В production можно использовать кастомные шрифты

/**
 * Экспортирует отчёт в формат PDF
 */
export function exportToPDF(report: DOZ3Report): void {
  // Фильтруем процедуры в зависимости от режима (демо/полный)
  const procedures = filterProceduresForExport(report.procedures);
  const totalProcedures = procedures.reduce((sum, p) => sum + p.count, 0);
  const totalDose = procedures.reduce((sum, p) => sum + p.totalDose_personmGy, 0);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Заголовок
  doc.setFontSize(16);
  doc.text('ФОРМА №3-ДОЗ', doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(
    'Сведения о коллективных дозах облучения пациентов',
    doc.internal.pageSize.getWidth() / 2,
    28,
    { align: 'center' }
  );
  doc.text(
    'при рентгенологических исследованиях',
    doc.internal.pageSize.getWidth() / 2,
    34,
    { align: 'center' }
  );

  // Информация об организации
  doc.setFontSize(10);
  let yPos = 45;
  doc.text(`Организация: ${report.organization.name}`, 15, yPos);
  yPos += 6;
  doc.text(`Адрес: ${report.organization.address}`, 15, yPos);
  yPos += 6;
  doc.text(`ОКПО: ${report.organization.OKPO}`, 15, yPos);
  yPos += 6;
  doc.text(
    `Отчетный период: ${report.period.quarter ? `${report.period.quarter} квартал` : ''} ${report.period.year} ${report.period.quarter ? 'года' : 'год'}`,
    15,
    yPos
  );

  yPos += 10;

  // Таблица процедур
  autoTable(doc, {
    startY: yPos,
    head: [
      [
        '№ п/п',
        'Наименование рентгенологического исследования',
        'Количество процедур',
        'Доза на процедуру, мГр',
        'Коллективная доза, чел·мГр',
      ],
    ],
    body: [
      ...procedures.map((proc, index) => [
        (index + 1).toString(),
        proc.name,
        proc.count.toString(),
        proc.dosePerProc_mGy.toFixed(3),
        proc.totalDose_personmGy.toFixed(2),
      ]),
      ['', 'ИТОГО:', totalProcedures.toString(), '', totalDose.toFixed(2)],
    ],
    foot: [],
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [220, 220, 220],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    footStyles: {
      fillColor: [240, 240, 240],
      fontStyle: 'bold',
    },
  });

  // Подпись и дата
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.text(
    `Ответственное лицо: ______________ (${report.responsible.name}, ${report.responsible.position})`,
    15,
    finalY
  );
  doc.text(`Телефон: ${report.responsible.phone}`, 15, finalY + 6);
  doc.text(`Дата составления: ${new Date().toLocaleDateString('ru-RU')}`, 15, finalY + 12);

  // Генерация имени файла
  const fileName = `3-DOZ_${report.organization.name.replace(/\s+/g, '_')}_${report.period.year}.pdf`;

  // Сохранение файла
  doc.save(fileName);
}
