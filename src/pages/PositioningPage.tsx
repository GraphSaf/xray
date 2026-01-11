import { Link } from 'react-router-dom';
import { AuthButton } from '../components/AuthButton';

export function PositioningPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
                ← Вернуться на главную
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Справочник укладок</h1>
              <p className="mt-1 text-sm text-gray-600">
                База знаний по позиционированию пациентов при рентгенологических исследованиях
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Раздел в разработке</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Мы собираем базу знаний по укладкам пациентов для различных рентгенологических исследований.
            Скоро здесь появится подробный справочник с иллюстрациями и описаниями.
          </p>
          <div className="space-y-4 text-left max-w-md mx-auto bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900">Планируемые разделы:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Рентгенография грудной клетки
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Рентгенография костей и суставов
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Рентгенография позвоночника
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Рентгенография черепа и лицевого отделения
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Специальные укладки и контрастные исследования
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">✓</span>
                Укладки для детей и пациентов с ограниченной подвижностью
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
