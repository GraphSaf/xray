import { Link } from 'react-router-dom';
import { AuthButton } from '../components/AuthButton';
import { pb } from '../lib/pocketbase';

export function LandingPage() {
  const isAuthenticated = pb.authStore.isValid;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 bg-black rounded-3xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">X</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-black block">XrayHub</span>
                <span className="text-sm text-gray-600">Стоматологическая рентгенография</span>
              </div>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto py-20 px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-24">
          <h1 className="text-6xl font-bold text-black mb-6 leading-tight">
            Платформа для<br/>
            <span className="text-gray-800">рентгенлаборантов-стоматологов</span>
          </h1>
          <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Простые инструменты для учета доз облучения и обучения правильному позиционированию при стоматологических снимках
          </p>
        </div>

        {/* Features - большие карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* DOZ3 Card */}
          <Link
            to="/doz3"
            className="bg-gray-50 rounded-3xl shadow-sm p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-black mb-4">Журнал доз (ДОЗ-3)</h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Заполняйте форму учета доз облучения пациентов. Простой интерфейс - как на бумаге, только быстрее.
            </p>
            <div className="inline-block px-5 py-3 bg-black text-white rounded-2xl text-lg font-semibold">
              Открыть журнал →
            </div>
          </Link>

          {/* Positioning Card */}
          <Link
            to="/positioning"
            className="bg-gray-50 rounded-3xl shadow-sm p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-black mb-4">Укладки и позиционирование</h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Справочник по правильному расположению пациента и рентген-аппарата для разных видов снимков.
            </p>
            <div className="inline-block px-5 py-3 bg-black text-white rounded-2xl text-lg font-semibold">
              Открыть справочник →
            </div>
          </Link>

          {/* CRM Card */}
          <Link
            to="/crm"
            className="bg-gray-50 rounded-3xl shadow-sm p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-black mb-4">Карточки пациентов</h3>
            <p className="text-xl text-gray-700 mb-6 leading-relaxed">
              Храните историю снимков и дозы каждого пациента. Все в одном месте, легко найти.
            </p>
            <div className="inline-block px-5 py-3 bg-white border-2 border-black text-black rounded-2xl text-lg font-semibold">
              Скоро откроется
            </div>
          </Link>
        </div>

        {/* Info Section */}
        {!isAuthenticated && (
          <div className="mt-20 text-center bg-gray-50 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-black mb-4">Как начать работать?</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Некоторые разделы доступны сразу, для полного доступа войдите через VK ID в правом верхнем углу
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-gray-200 mt-24 py-12">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-gray-600 text-lg">
            © 2026 XrayHub — для рентгенлаборантов стоматологических кабинетов
          </p>
        </div>
      </footer>
    </div>
  );
}
