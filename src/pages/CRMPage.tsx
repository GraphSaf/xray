import { Link } from 'react-router-dom';
import { AuthButton } from '../components/AuthButton';

export function CRMPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                ← Вернуться на главную
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">CRM Пациенты</h1>
              <p className="mt-1 text-sm text-gray-600">
                Онлайн система для заполнения индивидуальных доз облучения пациентов
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Раздел в разработке</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Мы работаем над созданием удобной системы управления данными пациентов.
            Скоро здесь появится функционал для онлайн заполнения индивидуальных доз облучения.
          </p>
          <div className="space-y-4 text-left max-w-md mx-auto bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Планируемые возможности:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Онлайн журнал регистрации пациентов
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Автоматический расчет эффективных доз
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                История исследований пациента
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Экспорт данных для отчетности
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Интеграция с медицинскими информационными системами
              </li>
            </ul>
          </div>
          <Link
            to="/"
            className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </main>
    </div>
  );
}
