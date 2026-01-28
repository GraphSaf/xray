import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function CRMPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="bg-gray-50 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold text-black">Карточки пациентов</h1>
          <p className="mt-2 text-xl text-gray-700">
            Онлайн система для учета индивидуальных доз облучения пациентов
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-12 px-6 sm:px-8 lg:px-12">
        <div className="bg-gray-50 rounded-3xl shadow-sm p-16 text-center">
          <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-black mb-6">Раздел в разработке</h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Мы работаем над созданием удобной системы управления данными пациентов.
            Скоро здесь появится функционал для онлайн заполнения индивидуальных доз облучения.
          </p>
          <div className="space-y-6 text-left max-w-2xl mx-auto bg-white rounded-3xl p-10 border-2 border-gray-200">
            <h3 className="text-2xl font-bold text-black mb-6">Планируемые возможности:</h3>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-black mr-3 text-xl font-bold">✓</span>
                Онлайн журнал регистрации пациентов
              </li>
              <li className="flex items-start">
                <span className="text-black mr-3 text-xl font-bold">✓</span>
                Автоматический расчет эффективных доз
              </li>
              <li className="flex items-start">
                <span className="text-black mr-3 text-xl font-bold">✓</span>
                История исследований пациента
              </li>
              <li className="flex items-start">
                <span className="text-black mr-3 text-xl font-bold">✓</span>
                Экспорт данных для отчетности
              </li>
              <li className="flex items-start">
                <span className="text-black mr-3 text-xl font-bold">✓</span>
                Интеграция с медицинскими информационными системами
              </li>
            </ul>
          </div>
          <Link
            to="/"
            className="mt-10 inline-block px-8 py-4 bg-black text-white font-bold text-lg rounded-2xl hover:bg-gray-800 transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
