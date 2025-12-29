import { useDOZ3Store } from './store/useDOZ3Store';
import { ReportForm } from './components/report/ReportForm';
import { ProcedureTable } from './components/report/ProcedureTable';
import { ExportButtons } from './components/report/ExportButtons';
import { Button } from './components/common';

function App() {
  const currentReport = useDOZ3Store((state) => state.currentReport);
  const setCurrentReport = useDOZ3Store((state) => state.setCurrentReport);

  const handleNewReport = () => {
    setCurrentReport(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Форма №3-ДОЗ
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Учет коллективных доз облучения пациентов при рентгенологических исследованиях
            </p>
          </div>
          {currentReport && (
            <Button onClick={handleNewReport} variant="secondary">
              + Новый отчёт
            </Button>
          )}
        </div>
      </header>

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

export default App;
