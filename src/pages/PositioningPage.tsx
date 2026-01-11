import { Link } from 'react-router-dom';
import { AuthButton } from '../components/AuthButton';
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
              🦷 3D Симулятор (Virtual Patient Simulator)
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
          <div className="bg-white rounded-b-xl shadow-lg p-6">
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Virtual Patient Simulator for Dental Education
                </h2>
                <p className="text-gray-700 mb-4">
                  Интерактивная платформа для обучения стоматологии с использованием 3D моделирования.
                  Создана University of Peradeniya (Шри-Ланка) на базе React, Firebase и Unity.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Возможности:</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 3D визуализация зубов и челюсти</li>
                      <li>• Интерактивные клинические случаи</li>
                      <li>• Обучение диагностике и планированию лечения</li>
                      <li>• Симуляция рентгенологических исследований</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Технологии:</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• ReactJS - интерфейс</li>
                      <li>• Unity - 3D моделирование</li>
                      <li>• Firebase - база данных</li>
                      <li>• Google OAuth - авторизация</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Launch Options */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Student Platform */}
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Портал для студентов</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Доступ к готовым клиническим случаям и 3D симуляциям. Требуется вход через Google.
                      </p>
                      <a
                        href="https://virtual-patient-simulator-2k23.web.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Открыть симулятор →
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                    <strong>Вход:</strong> Используйте свой Google аккаунт или демо: test@demo.com / Test1234
                  </div>
                </div>

                {/* Tutor Platform */}
                <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Портал для преподавателей</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Создание и управление клиническими случаями, настройка 3D сценариев.
                      </p>
                      <a
                        href="https://vps-2k23-app.web.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Портал преподавателя →
                      </a>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                    <strong>Доступ:</strong> Для преподавателей и администраторов
                  </div>
                </div>
              </div>

              {/* Info Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                <p className="text-amber-800">
                  <strong>Примечание:</strong> Симулятор разработан University of Peradeniya (Шри-Ланка) как
                  образовательный проект. Для полноценной работы требуется регистрация через Google аккаунт.
                  Подробнее о проекте:{' '}
                  <a
                    href="https://github.com/cepdnaclk/e18-4yp-Virtual-Patient-Simulator-for-Skill-Training-in-Dentistry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    GitHub Repository
                  </a>
                </p>
              </div>

              {/* Video/Demo Section */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Предварительный просмотр</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">
                      Для просмотра демонстрации перейдите на{' '}
                      <a
                        href="https://virtual-patient-simulator-2k23.web.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline font-semibold"
                      >
                        платформу симулятора
                      </a>
                    </p>
                  </div>
                </div>
              </div>
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
