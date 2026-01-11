import { Link } from 'react-router-dom';
import { AuthButton } from '../components/AuthButton';
import { pb } from '../lib/pocketbase';

export function LandingPage() {
  const isAuthenticated = pb.authStore.isValid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">X</span>
              </div>
              <span className="text-xl font-bold text-gray-900">XrayHub</span>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Платформа для специалистов
            <span className="block text-indigo-600">рентгенологических служб</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Современные инструменты для учета доз облучения, управления данными пациентов и справочные материалы по укладкам
          </p>

          {!isAuthenticated && (
            <div className="mt-10">
              <p className="text-lg text-gray-700 mb-4">
                Войдите через VK ID для доступа ко всем функциям платформы
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* DOZ3 Card */}
          <Link
            to="/doz3"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-500"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Форма №3-ДОЗ</h3>
            <p className="text-gray-600 mb-4">
              Учет коллективных доз облучения пациентов при рентгенологических исследованиях
            </p>
            <div className="text-sm text-gray-500">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full">
                Демо доступно без авторизации
              </span>
            </div>
          </Link>

          {/* CRM Card */}
          <Link
            to="/crm"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-500"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">CRM Пациенты</h3>
            <p className="text-gray-600 mb-4">
              Онлайн система для заполнения индивидуальных доз облучения пациентов
            </p>
            <div className="text-sm text-gray-500">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                В разработке
              </span>
            </div>
          </Link>

          {/* Positioning Card */}
          <Link
            to="/positioning"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-indigo-500"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">3D Симулятор стоматологии</h3>
            <p className="text-gray-600 mb-4">
              Интерактивный симулятор для обучения позиционированию при рентген-исследованиях
            </p>
            <div className="text-sm text-gray-500">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full">
                Доступно всем
              </span>
            </div>
          </Link>
        </div>

        {/* About Section */}
        <div className="mt-20 bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">О проекте XrayHub</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              XrayHub — это комплексная платформа для специалистов рентгенологических служб медицинских учреждений.
              Наша цель — упростить ведение документации, автоматизировать рутинные задачи и предоставить удобный
              доступ к справочным материалам.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Для кого</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Медицинские физики</li>
                  <li>Рентгенолаборанты</li>
                  <li>Специалисты по радиационной безопасности</li>
                  <li>Руководители рентгенологических отделений</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Возможности</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Автоматическое формирование отчетов</li>
                  <li>Экспорт в Excel, DOC, PDF</li>
                  <li>Облачное хранение данных</li>
                  <li>Работа с любого устройства</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 XrayHub. Платформа для специалистов рентгенологических служб.</p>
            <p className="mt-2">
              Данные инструменты являются вспомогательными. Ответственность за корректность данных несет пользователь.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
