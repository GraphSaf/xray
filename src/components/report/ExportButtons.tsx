import React from 'react';
import { useDOZ3Store } from '../../store/useDOZ3Store';
import { Button, Alert } from '../common';
import { exportToExcel } from '../../utils/exportExcel';
import { exportToDoc } from '../../utils/exportDoc';
import { exportToPDF } from '../../utils/exportPdf';

export const ExportButtons: React.FC = () => {
  const currentReport = useDOZ3Store((state) => state.currentReport);

  if (!currentReport) {
    return null;
  }

  const handleExportExcel = () => {
    exportToExcel(currentReport);
  };

  const handleExportDoc = async () => {
    await exportToDoc(currentReport);
  };

  const handleExportPDF = () => {
    exportToPDF(currentReport);
  };

  const hasData = currentReport.procedures.length > 0;

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Экспорт отчёта
        </h2>
        <p className="text-gray-600 text-sm">
          Скачайте готовый отчёт в удобном формате: Excel, Word или PDF
        </p>
      </div>

      {!hasData && (
        <Alert type="warning">
          Добавьте хотя бы одну процедуру перед экспортом отчёта
        </Alert>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleExportExcel}
          variant="success"
          disabled={!hasData}
          size="lg"
        >
          📥 Скачать Excel
        </Button>
        <Button
          onClick={handleExportDoc}
          variant="primary"
          disabled={!hasData}
          size="lg"
        >
          📄 Скачать Word
        </Button>
        <Button
          onClick={handleExportPDF}
          variant="secondary"
          disabled={!hasData}
          size="lg"
        >
          📑 Скачать PDF
        </Button>
      </div>

      {hasData && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">Информация о отчёте:</p>
          <ul className="space-y-1">
            <li>• Организация: {currentReport.organization.name}</li>
            <li>• Год: {currentReport.period.year}</li>
            <li>• Всего процедур: {currentReport.procedures.reduce((sum, p) => sum + p.count, 0)}</li>
            <li>• Коллективная доза: {currentReport.totalDose_personmGy.toFixed(2)} чел·мГр</li>
          </ul>
        </div>
      )}
    </div>
  );
};
