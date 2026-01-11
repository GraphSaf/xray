import { Link } from 'react-router-dom';
import { AuthButton } from '../components/AuthButton';
import { DentalPositioningSimulator } from '../components/DentalPositioningSimulator';
import { useState } from 'react';

export function PositioningPage() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'guide'>('simulator');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                ← Вернуться на главную
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">3D Симулятор стоматологии</h1>
              <p className="mt-1 text-sm text-gray-600">
                Интерактивный симулятор для обучения позиционированию при рентгенологических исследованиях
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-lg border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              🦷 3D Симулятор позиционирования
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              📚 Справочник укладок
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'simulator' ? (
          <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
            {/* Описание */}
            <div className="bg-blue-50 border-b border-blue-200 p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                🦷 Интерактивный 3D симулятор позиционирования
              </h2>
              <p className="text-sm text-gray-700">
                Базовая визуализация позиционирования пациента и рентген-аппарата при интраоральной рентгенографии.
                Используйте мышь для управления камерой.
              </p>
            </div>

            {/* 3D Симулятор */}
            <div className="p-4" style={{ height: '700px' }}>
              <DentalPositioningSimulator />
            </div>

            {/* Информация */}
            <div className="bg-amber-50 border-t border-amber-200 p-4 text-sm">
              <p className="text-amber-800">
                <strong>Статус:</strong> Базовая версия (v0.1) - упрощенная 3D визуализация.
                В разработке: интерактивное управление углами, расчет параллельной и биссектрисной техники,
                симуляция снимков.
              </p>
            </div>
          </div>
        ) : (
          // Справочник укладок
          <div className="bg-white rounded-b-xl shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Справочник в разработке</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Мы работаем над созданием подробного справочника по укладкам пациентов при стоматологических
              рентгенологических исследованиях.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900">Планируемые разделы:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Интраоральные снимки (периапикальные, bite-wing)
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Панорамная рентгенография (ОПТГ)
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Цефалометрический анализ
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Конусно-лучевая компьютерная томография (КЛКТ)
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Укладки для детей и пациентов с особенностями
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
