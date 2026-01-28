import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { pb } from '../lib/pocketbase';

export function LandingPage() {
  const isAuthenticated = pb.authStore.isValid;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto py-10 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16 lg:mb-24">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 leading-tight">
            Платформа для<br/>
            <span className="text-gray-800">рентгенлаборантов-стоматологов</span>
          </h1>
          <p className="text-base sm:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Простые инструменты для учета доз облучения и обучения правильному позиционированию при стоматологических снимках
          </p>
        </div>

        {/* Features - большие карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Positioning Card - ПЕРВАЯ */}
          <Link
            to="/positioning"
            className="bg-gray-50 rounded-3xl shadow-sm p-6 sm:p-10 lg:p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Укладки и позиционирование</h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Справочник по правильному расположению пациента и рентген-аппарата для разных видов снимков.
            </p>
            <div className="inline-block px-4 py-2 sm:px-5 sm:py-3 bg-black text-white rounded-2xl text-base sm:text-lg font-semibold">
              Открыть справочник →
            </div>
          </Link>

          {/* Equipment Card - ВТОРАЯ */}
          <Link
            to="/equipment"
            className="bg-gray-50 rounded-3xl shadow-sm p-6 sm:p-10 lg:p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Справочник по оборудованию</h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Инструкции и руководства по работе с рентгеновским оборудованием. С поддержкой AI-помощника.
            </p>
            <div className="inline-block px-4 py-2 sm:px-5 sm:py-3 bg-black text-white rounded-2xl text-base sm:text-lg font-semibold">
              Открыть справочник →
            </div>
          </Link>

          {/* CRM Card - ТРЕТЬЯ */}
          <Link
            to="/crm"
            className="bg-gray-50 rounded-3xl shadow-sm p-6 sm:p-10 lg:p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Карточки пациентов</h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Храните историю снимков и дозы каждого пациента. Все в одном месте, легко найти.
            </p>
            <div className="inline-block px-4 py-2 sm:px-5 sm:py-3 bg-white border-2 border-black text-black rounded-2xl text-base sm:text-lg font-semibold">
              Скоро откроется
            </div>
          </Link>

          {/* DOZ3 Card - ЧЕТВЕРТАЯ */}
          <Link
            to="/doz3"
            className="bg-gray-50 rounded-3xl shadow-sm p-6 sm:p-10 lg:p-12 hover:shadow-xl transition-all border-4 border-transparent hover:border-black group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-3xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Журнал доз (ДОЗ-3)</h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed">
              Заполняйте форму учета доз облучения пациентов. Простой интерфейс - как на бумаге, только быстрее.
            </p>
            <div className="inline-block px-4 py-2 sm:px-5 sm:py-3 bg-black text-white rounded-2xl text-base sm:text-lg font-semibold">
              Открыть журнал →
            </div>
          </Link>
        </div>

        {/* Info Section */}
        {!isAuthenticated && (
          <div className="mt-12 sm:mt-16 lg:mt-20 text-center bg-gray-50 rounded-3xl p-6 sm:p-10 lg:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Как начать работать?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Некоторые разделы доступны сразу, для полного доступа войдите через VK ID в правом верхнем углу
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
