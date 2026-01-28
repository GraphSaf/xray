import { useState } from 'react';
import { useDOZ3Store } from '../store/useDOZ3Store';
import { ReportForm } from '../components/report/ReportForm';
import { ProcedureTable } from '../components/report/ProcedureTable';
import { ExportButtons } from '../components/report/ExportButtons';
import { Button } from '../components/common';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { DoseSettings } from '../components/DoseSettings';

export function DOZ3Page() {
  const currentReport = useDOZ3Store((state) => state.currentReport);
  const setCurrentReport = useDOZ3Store((state) => state.setCurrentReport);
  const [activeTab, setActiveTab] = useState<'journal' | 'settings'>('journal');

  const handleNewReport = () => {
    setCurrentReport(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="bg-gray-50 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
            Журнал доз (ДОЗ-3)
          </h1>
          <p className="text-base sm:text-xl text-gray-700">
            Учет коллективных доз облучения пациентов при рентгенологических исследованиях
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 mt-6">
        <div className="bg-gray-100 rounded-2xl p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('journal')}
              className={`py-4 px-6 text-center font-bold text-base sm:text-lg rounded-2xl transition-all ${
                activeTab === 'journal' ? 'bg-black text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Журнал учета
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-6 text-center font-bold text-base sm:text-lg rounded-2xl transition-all ${
                activeTab === 'settings' ? 'bg-black text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚙️ Настройки доз
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-12">
          {activeTab === 'journal' ? (
            <div className="space-y-6">
              {!currentReport ? (
                <div>
                  <ReportForm />
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-black">
                          {currentReport.organization.name}
                        </h3>
                        <p className="text-base text-gray-600 mt-1">
                          Отчётный период: {currentReport.period.year} год
                        </p>
                      </div>
                      <Button onClick={handleNewReport} variant="secondary">
                        + Новый отчёт
                      </Button>
                    </div>
                  </div>
                  <ProcedureTable />
                  <ExportButtons />
                </>
              )}
            </div>
          ) : (
            <DoseSettings />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
