import React, { useState } from 'react';
import { useDOZ3Store } from '../../store/useDOZ3Store';
import { Input, Select, Button } from '../common';

export const ReportForm: React.FC = () => {
  const createReport = useDOZ3Store((state) => state.createReport);
  const currentReport = useDOZ3Store((state) => state.currentReport);

  const [formData, setFormData] = useState({
    orgName: '',
    orgAddress: '',
    orgLicense: '',
    orgINN: '',
    chiefDoctor: '',
    chiefDoctorPosition: 'Главный врач',
    radiationOfficer: '',
    radiationOfficerPosition: 'Медицинский физик',
    year: new Date().getFullYear(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createReport({
      organization: {
        name: formData.orgName,
        address: formData.orgAddress,
        license: formData.orgLicense,
        inn: formData.orgINN
      },
      responsible: {
        chiefDoctor: formData.chiefDoctor,
        chiefDoctorPosition: formData.chiefDoctorPosition,
        radiationOfficer: formData.radiationOfficer,
        radiationOfficerPosition: formData.radiationOfficerPosition
      },
      period: {
        year: Number(formData.year)
      },
      clinicType: 'dental'
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
            label="Лицензия"
            name="orgLicense"
            value={formData.orgLicense}
            onChange={handleInputChange}
            placeholder="ЛО-77-01-012345"
            required
          />
          <Input
            label="ИНН"
            name="orgINN"
            value={formData.orgINN}
            onChange={handleInputChange}
            placeholder="1234567890"
            required
            maxLength={12}
          />
        </div>
      </div>

      {/* Ответственные лица */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Ответственные лица
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Руководитель (ФИО)"
            name="chiefDoctor"
            value={formData.chiefDoctor}
            onChange={handleInputChange}
            placeholder="Иванов И.И."
            required
          />
          <Input
            label="Должность руководителя"
            name="chiefDoctorPosition"
            value={formData.chiefDoctorPosition}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Ответственный за радиационную безопасность (ФИО)"
            name="radiationOfficer"
            value={formData.radiationOfficer}
            onChange={handleInputChange}
            placeholder="Петров П.П."
            required
          />
          <Input
            label="Должность ответственного"
            name="radiationOfficerPosition"
            value={formData.radiationOfficerPosition}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Отчётный период */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Отчётный период
        </h3>
        <div className="max-w-xs">
          <Select
            label="Год"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            options={yearOptions}
            required
          />
        </div>
      </div>

      <div className="border-t pt-6 flex justify-end gap-3">
        <Button type="submit" variant="primary" size="lg">
          Создать отчёт
        </Button>
      </div>
    </form>
  );
};
