import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { DOZ3Report } from '../types';
import { filterProceduresForExport } from './demoMode';

/**
 * Экспортирует отчёт в формат DOCX
 */
export async function exportToDoc(report: DOZ3Report): Promise<void> {
  // Фильтруем процедуры в зависимости от режима (демо/полный)
  const procedures = filterProceduresForExport(report.procedures);
  const totalProcedures = procedures.reduce((sum, p) => sum + p.count, 0);
  const totalDose = procedures.reduce((sum, p) => sum + p.totalDose_personmGy, 0);

  const doc = new Document({
    sections: [
      {
        children: [
          // Заголовок
          new Paragraph({
            text: 'ФОРМА №3-ДОЗ',
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            style: 'Heading1',
          }),
          new Paragraph({
            text: 'Сведения о коллективных дозах облучения пациентов при рентгенологических исследованиях',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Информация об организации
          new Paragraph({
            children: [
              new TextRun({ text: 'Организация: ', bold: true }),
              new TextRun(report.organization.name),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Адрес: ', bold: true }),
              new TextRun(report.organization.address),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'ОКПО: ', bold: true }),
              new TextRun(report.organization.OKPO),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Отчетный период: ', bold: true }),
              new TextRun(
                `${report.period.quarter ? `${report.period.quarter} квартал` : ''} ${report.period.year} ${report.period.quarter ? 'года' : 'год'}`
              ),
            ],
            spacing: { after: 400 },
          }),

          // Таблица процедур
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Заголовок таблицы
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: '№ п/п', alignment: AlignmentType.CENTER })],
                    width: { size: 10, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Наименование рентгенологического исследования', alignment: AlignmentType.CENTER })],
                    width: { size: 40, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Количество процедур', alignment: AlignmentType.CENTER })],
                    width: { size: 15, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Доза на процедуру, мГр', alignment: AlignmentType.CENTER })],
                    width: { size: 17, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Коллективная доза, чел·мГр', alignment: AlignmentType.CENTER })],
                    width: { size: 18, type: WidthType.PERCENTAGE },
                  }),
                ],
              }),
              // Строки с процедурами
              ...procedures.map(
                (proc, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })],
                      }),
                      new TableCell({
                        children: [new Paragraph(proc.name)],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: proc.count.toString(), alignment: AlignmentType.RIGHT })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: proc.dosePerProc_mGy.toFixed(3), alignment: AlignmentType.RIGHT })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: proc.totalDose_personmGy.toFixed(2), alignment: AlignmentType.RIGHT })],
                      }),
                    ],
                  })
              ),
              // Итоговая строка
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('')],
                    columnSpan: 2,
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: totalProcedures.toString(), bold: true })],
                        alignment: AlignmentType.RIGHT,
                      }),
                    ],
                  }),
                  new TableCell({
                    children: [new Paragraph('')],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [new TextRun({ text: totalDose.toFixed(2), bold: true })],
                        alignment: AlignmentType.RIGHT,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Подпись и дата
          new Paragraph({
            text: '',
            spacing: { before: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Ответственное лицо: ', bold: true }),
              new TextRun('______________ '),
              new TextRun(`(${report.responsible.name}, ${report.responsible.position})`),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Телефон: ', bold: true }),
              new TextRun(report.responsible.phone),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Дата составления: ', bold: true }),
              new TextRun(new Date().toLocaleDateString('ru-RU')),
            ],
          }),
        ],
      },
    ],
  });

  // Генерация и сохранение файла
  const blob = await Packer.toBlob(doc);
  const fileName = `3-DOZ_${report.organization.name.replace(/\s+/g, '_')}_${report.period.year}.docx`;
  saveAs(blob, fileName);
}
