import { useState } from 'react';
import { useDoseSettingsStore } from '../store/useDoseSettingsStore';

export function DoseSettings() {
  const { settings, updateIntraoralDose, updatePanoramicDose, updateCBCTDose, resetToDefaults } =
    useDoseSettingsStore();
  const [activeTab, setActiveTab] = useState<'intraoral' | 'panoramic' | 'cbct'>('intraoral');

  const formatDose = (mSv: number) => (mSv * 1000).toFixed(1); // Convert to µSv
  const parseDose = (uSv: string) => parseFloat(uSv) / 1000; // Convert to mSv

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">Настройки доз облучения</h2>
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-2xl hover:bg-gray-200 transition-colors text-sm"
        >
          Сбросить
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-gray-100 rounded-2xl p-1 mb-6">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveTab('intraoral')}
            className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
              activeTab === 'intraoral' ? 'bg-black text-white' : 'bg-transparent text-gray-700'
            }`}
          >
            Интраоральные
          </button>
          <button
            onClick={() => setActiveTab('panoramic')}
            className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
              activeTab === 'panoramic' ? 'bg-black text-white' : 'bg-transparent text-gray-700'
            }`}
          >
            ОПТГ
          </button>
          <button
            onClick={() => setActiveTab('cbct')}
            className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
              activeTab === 'cbct' ? 'bg-black text-white' : 'bg-transparent text-gray-700'
            }`}
          >
            КЛКТ (3D)
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'intraoral' && (
          <div className="space-y-4">
            <p className="text-base text-gray-700">
              Укажите типичные дозы для интраоральных (внутриротовых) снимков в микрозивертах (мкЗв)
            </p>

            <DoseInput
              label="Передние зубы (резцы, клыки)"
              description="11-13, 21-23, 31-33, 41-43"
              value={formatDose(settings.intraoral.anteriorTeeth)}
              onChange={(v) => updateIntraoralDose('anteriorTeeth', parseDose(v))}
            />

            <DoseInput
              label="Премоляры"
              description="14-15, 24-25, 34-35, 44-45"
              value={formatDose(settings.intraoral.premolars)}
              onChange={(v) => updateIntraoralDose('premolars', parseDose(v))}
            />

            <DoseInput
              label="Моляры верхние"
              description="16-18, 26-28"
              value={formatDose(settings.intraoral.upperMolars)}
              onChange={(v) => updateIntraoralDose('upperMolars', parseDose(v))}
            />

            <DoseInput
              label="Моляры нижние"
              description="36-38, 46-48"
              value={formatDose(settings.intraoral.lowerMolars)}
              onChange={(v) => updateIntraoralDose('lowerMolars', parseDose(v))}
            />
          </div>
        )}

        {activeTab === 'panoramic' && (
          <div className="space-y-4">
            <p className="text-base text-gray-700">
              Укажите типичные дозы для панорамных снимков (ОПТГ) в мкЗв в зависимости от конституции пациента
            </p>

            <DoseInput
              label="Дети (до 14 лет)"
              description="Пониженная доза для детей"
              value={formatDose(settings.panoramic.children)}
              onChange={(v) => updatePanoramicDose('children', parseDose(v))}
            />

            <DoseInput
              label="Худощавые"
              description="Астеническое телосложение"
              value={formatDose(settings.panoramic.slim)}
              onChange={(v) => updatePanoramicDose('slim', parseDose(v))}
            />

            <DoseInput
              label="Средние"
              description="Нормостеническое телосложение"
              value={formatDose(settings.panoramic.average)}
              onChange={(v) => updatePanoramicDose('average', parseDose(v))}
            />

            <DoseInput
              label="Тучные"
              description="Гиперстеническое телосложение"
              value={formatDose(settings.panoramic.heavy)}
              onChange={(v) => updatePanoramicDose('heavy', parseDose(v))}
            />
          </div>
        )}

        {activeTab === 'cbct' && (
          <div className="space-y-6">
            <p className="text-base text-gray-700">
              Укажите типичные дозы для конусно-лучевой компьютерной томографии (КЛКТ) в мкЗв
            </p>

            {/* Children */}
            <CBCTPatientGroup
              title="Дети (до 14 лет)"
              patientType="children"
              settings={settings.cbct.children}
              formatDose={formatDose}
              parseDose={parseDose}
              updateCBCTDose={updateCBCTDose}
            />

            {/* Slim */}
            <CBCTPatientGroup
              title="Худощавые"
              patientType="slim"
              settings={settings.cbct.slim}
              formatDose={formatDose}
              parseDose={parseDose}
              updateCBCTDose={updateCBCTDose}
            />

            {/* Average */}
            <CBCTPatientGroup
              title="Средние"
              patientType="average"
              settings={settings.cbct.average}
              formatDose={formatDose}
              parseDose={parseDose}
              updateCBCTDose={updateCBCTDose}
            />

            {/* Heavy */}
            <CBCTPatientGroup
              title="Тучные"
              patientType="heavy"
              settings={settings.cbct.heavy}
              formatDose={formatDose}
              parseDose={parseDose}
              updateCBCTDose={updateCBCTDose}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface DoseInputProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

function DoseInput({ label, description, value, onChange }: DoseInputProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 sm:p-5">
      <label className="block">
        <div className="mb-2">
          <span className="text-base sm:text-lg font-semibold text-black">{label}</span>
          <span className="block text-sm text-gray-600 mt-1">{description}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-3 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none"
          />
          <span className="text-base font-semibold text-gray-700">мкЗв</span>
        </div>
      </label>
    </div>
  );
}

interface CBCTPatientGroupProps {
  title: string;
  patientType: keyof DoseSettings['cbct'];
  settings: DoseSettings['cbct']['average'];
  formatDose: (mSv: number) => string;
  parseDose: (uSv: string) => number;
  updateCBCTDose: (
    patientType: keyof DoseSettings['cbct'],
    segment: keyof DoseSettings['cbct']['average'],
    value: number
  ) => void;
}

function CBCTPatientGroup({
  title,
  patientType,
  settings,
  formatDose,
  parseDose,
  updateCBCTDose,
}: CBCTPatientGroupProps) {
  return (
    <div className="border-2 border-gray-200 rounded-2xl p-4 sm:p-5">
      <h4 className="text-lg sm:text-xl font-bold text-black mb-4">{title}</h4>
      <div className="space-y-3">
        <CBCTSegmentInput
          label="Одна челюсть"
          value={formatDose(settings.singleJaw)}
          onChange={(v) => updateCBCTDose(patientType, 'singleJaw', parseDose(v))}
        />
        <CBCTSegmentInput
          label="Обе челюсти"
          value={formatDose(settings.bothJaws)}
          onChange={(v) => updateCBCTDose(patientType, 'bothJaws', parseDose(v))}
        />
        <CBCTSegmentInput
          label="Полная голова"
          value={formatDose(settings.fullHead)}
          onChange={(v) => updateCBCTDose(patientType, 'fullHead', parseDose(v))}
        />
      </div>
    </div>
  );
}

interface CBCTSegmentInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function CBCTSegmentInput({ label, value, onChange }: CBCTSegmentInputProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-base font-semibold text-gray-800">{label}:</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step="1"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-24 px-3 py-2 text-base font-semibold border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none"
        />
        <span className="text-sm font-semibold text-gray-700">мкЗв</span>
      </div>
    </div>
  );
}

import type { DoseSettings } from '../types/doseSettings';
