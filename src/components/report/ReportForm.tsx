import React, { useState } from 'react';
import { useDOZ3Store } from '../../store/useDOZ3Store';
import { Input, Select, Button } from '../common';

export const ReportForm: React.FC = () => {
  const createReport = useDOZ3Store((state) => state.createReport);
  const currentReport = useDOZ3Store((state) => state.currentReport);
  const isLoading = useDOZ3Store((state) => state.isLoading);
  const error = useDOZ3Store((state) => state.error);

  const [formData, setFormData] = useState({
    orgName: '',
    orgAddress: '',
    orgOKPO: '',
    responsibleName: '',
    responsiblePosition: 'Главный врач',
    responsiblePhone: '',
    year: new Date().getFullYear(),
    quarter: '' as '' | '1' | '2' | '3' | '4',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createReport({
      organization: {
        name: formData.orgName,
        address: formData.orgAddress,
        OKPO: formData.orgOKPO
      },
      responsible: {
        name: formData.responsibleName,
        position: formData.responsiblePosition,
        phone: formData.responsiblePhone
      },
      period: {
        year: Number(formData.year),
        quarter: formData.quarter ? (Number(formData.quarter) as 1 | 2 | 3 | 4) : undefined
      }
    });
  };

  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: year.toString() };
  });

  if (currentReport) {
    return null; // Форма скрывается после создания отчёта
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Создать новый отчёт №3-ДОЗ
        </h2>
        <p className="text-gray-600 text-sm">
          Заполните данные для отчёта по стоматологической клинике
        </p>
      </div>

      {/* Информация об организации */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Информация об организации
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Название организации"
              name="orgName"
              value={formData.orgName}
              onChange={handleInputChange}
              placeholder="ООО 'Стоматологическая клиника'"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Адрес"
              name="orgAddress"
              value={formData.orgAddress}
              onChange={handleInputChange}
              placeholder="г. Москва, ул. Примерная, д. 1"
              required
            />
          </div>
          <Input
            label="ОКПО"
            name="orgOKPO"
            value={formData.orgOKPO}
            onChange={handleInputChange}
            placeholder="12345678"
            required
            maxLength={10}
          />
        </div>
      </div>

      {/* Ответственное лицо */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ответственное лицо
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ФИО"
            name="responsibleName"
            value={formData.responsibleName}
            onChange={handleInputChange}
            placeholder="Иванов И.И."
            required
          />
          <Input
            label="Должность"
            name="responsiblePosition"
            value={formData.responsiblePosition}
            onChange={handleInputChange}
            placeholder="Главный врач"
            required
          />
          <Input
            label="Телефон"
            name="responsiblePhone"
            value={formData.responsiblePhone}
            onChange={handleInputChange}
            placeholder="+7 (999) 123-45-67"
            required
          />
        </div>
      </div>

      {/* Отчётный период */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Отчётный период
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
          <Select
            label="Год"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            options={yearOptions}
            required
          />
          <Select
            label="Квартал (опционально)"
            name="quarter"
            value={formData.quarter}
            onChange={handleInputChange}
            options={[
              { value: '', label: 'Год (не указан)' },
              { value: '1', label: 'I квартал' },
              { value: '2', label: 'II квартал' },
              { value: '3', label: 'III квартал' },
              { value: '4', label: 'IV квартал' },
            ]}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="border-t pt-6 flex justify-end gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать отчёт'}
        </Button>
      </div>
    </form>
  );
};
