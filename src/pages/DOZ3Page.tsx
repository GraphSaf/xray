import { useDOZ3Store } from '../store/useDOZ3Store';
import { ReportForm } from '../components/report/ReportForm';
import { ProcedureTable } from '../components/report/ProcedureTable';
import { ExportButtons } from '../components/report/ExportButtons';
import { Button } from '../components/common';
import { Navigation } from '../components/Navigation';

export function DOZ3Page() {
  const currentReport = useDOZ3Store((state) => state.currentReport);
  const setCurrentReport = useDOZ3Store((state) => state.setCurrentReport);

  const handleNewReport = () => {
    setCurrentReport(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold text-black mb-2">
            Журнал доз (ДОЗ-3)
          </h1>
          <p className="text-xl text-gray-700 mb-4">
            Учет коллективных доз облучения пациентов при рентгенологических исследованиях
          </p>
          {currentReport && (
            <Button onClick={handleNewReport} variant="secondary">
              + Новый отчёт
            </Button>
          )}
        </div>
      </div>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-6">
            {!currentReport ? (
              <ReportForm />
            ) : (
              <>
                <div className="bg-white shadow rounded-lg p-4 border-l-4 border-primary">
                  <h3 className="font-semibold text-gray-900">
                    Текущий отчёт: {currentReport.organization.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Отчётный период: {currentReport.period.year} год
                  </p>
                </div>
                <ProcedureTable />
                <ExportButtons />
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">
            Данное приложение является вспомогательным инструментом для формирования отчетности.
            Ответственность за корректность вводимых данных и соответствие нормативным требованиям несет пользователь.
            Перед отправкой отчета в надзорные органы рекомендуется проверка данных медицинским физиком или ответственным за радиационную безопасность.
          </p>
        </div>
      </footer>
    </div>
  );
}
