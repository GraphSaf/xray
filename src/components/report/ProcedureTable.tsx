import React, { useState } from 'react';
import { useDOZ3Store } from '../../store/useDOZ3Store';
import { DENTAL_PROCEDURES } from '../../constants/procedures';
import { Button, Select, Input, Alert } from '../common';
import { validateProcedureDose } from '../../utils/validation';
import { formatCollectiveDose } from '../../utils/formatters';

export const ProcedureTable: React.FC = () => {
  const currentReport = useDOZ3Store((state) => state.currentReport);
  const addProcedure = useDOZ3Store((state) => state.addProcedure);
  const removeProcedure = useDOZ3Store((state) => state.removeProcedure);

  const [newProcedure, setNewProcedure] = useState({
    procedureId: '',
    count: 0,
    ageGroup: 'adult' as 'adult' | 'child'
  });

  const [warning, setWarning] = useState<string | null>(null);

  if (!currentReport) {
    return null;
  }

  const handleProcedureSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const procedureId = e.target.value;
    setNewProcedure(prev => ({ ...prev, procedureId }));
  };

  const handleAddProcedure = () => {
    if (!newProcedure.procedureId || newProcedure.count <= 0) {
      return;
    }

    const procedureDef = DENTAL_PROCEDURES.find(p => p.id === newProcedure.procedureId);
    if (!procedureDef) return;

    const dosePerProc = procedureDef.defaultDose_mGy || 0;

    // Проверка дозы
    const validation = validateProcedureDose({
      id: '',
      procedureId: newProcedure.procedureId,
      name: procedureDef.name,
      count: newProcedure.count,
      dosePerProc_mGy: dosePerProc,
      ageGroup: newProcedure.ageGroup,
      totalDose_personmGy: 0
    });

    if (!validation.isValid) {
      setWarning(validation.error!);
      return;
    }

    if (validation.warning) {
      setWarning(validation.warning);
    } else {
      setWarning(null);
    }

    addProcedure({
      procedureId: newProcedure.procedureId,
      name: procedureDef.name,
      count: newProcedure.count,
      dosePerProc_mGy: dosePerProc,
      ageGroup: newProcedure.ageGroup
    });

    // Сброс формы
    setNewProcedure({
      procedureId: '',
      count: 0,
      ageGroup: 'adult'
    });
  };

  const procedureOptions = DENTAL_PROCEDURES.map(p => ({
    value: p.id,
    label: p.name
  }));

  const ageGroupOptions = [
    { value: 'adult', label: 'Взрослые' },
    { value: 'child', label: 'Дети' }
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Процедуры
        </h2>
        <p className="text-gray-600 text-sm">
          Добавьте выполненные процедуры и количество пациентов
        </p>
      </div>

      {/* Форма добавления процедуры */}
      <div className="bg-gray-50 rounded-md p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Добавить процедуру</h3>
        {warning && (
          <div className="mb-4">
            <Alert type="warning" onClose={() => setWarning(null)}>
              {warning}
            </Alert>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Select
              label="Тип процедуры"
              value={newProcedure.procedureId}
              onChange={handleProcedureSelect}
              options={procedureOptions}
              placeholder="Выберите процедуру"
            />
          </div>
          <Input
            label="Количество процедур"
            type="number"
            min="1"
            value={newProcedure.count || ''}
            onChange={(e) => setNewProcedure(prev => ({
              ...prev,
              count: parseInt(e.target.value) || 0
            }))}
            placeholder="0"
          />
          <Select
            label="Возрастная группа"
            value={newProcedure.ageGroup}
            onChange={(e) => setNewProcedure(prev => ({
              ...prev,
              ageGroup: e.target.value as 'adult' | 'child'
            }))}
            options={ageGroupOptions}
          />
        </div>
        <div className="mt-4">
          <Button
            onClick={handleAddProcedure}
            disabled={!newProcedure.procedureId || newProcedure.count <= 0}
          >
            + Добавить процедуру
          </Button>
        </div>
      </div>

      {/* Таблица процедур */}
      {currentReport.procedures.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Наименование</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Возраст</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Количество</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Доза, мГр</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Коллективная доза</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentReport.procedures.map((proc, index) => (
                <tr key={proc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{proc.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {proc.ageGroup === 'adult' ? 'Взрослые' : 'Дети'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{proc.count}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {proc.dosePerProc_mGy.toFixed(3)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    {formatCollectiveDose(proc.totalDose_personmGy)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeProcedure(proc.id)}
                    >
                      Удалить
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">
                  ИТОГО:
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  {currentReport.totalProcedures}
                </td>
                <td></td>
                <td className="px-4 py-3 text-sm font-bold text-primary text-right">
                  {formatCollectiveDose(currentReport.totalDose_personmGy)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>Процедуры ещё не добавлены</p>
          <p className="text-sm mt-2">Используйте форму выше для добавления процедур</p>
        </div>
      )}
    </div>
  );
};
