import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t-2 border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* О проекте */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">О проекте</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              XrayHub — платформа для рентгенлаборантов стоматологических кабинетов.
              Простые инструменты для учета доз и обучения.
            </p>
          </div>

          {/* Разделы */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Разделы</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/positioning" className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors">
                  Укладки и позиционирование
                </Link>
              </li>
              <li>
                <Link to="/crm" className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors">
                  Карточки пациентов
                </Link>
              </li>
              <li>
                <Link to="/doz3" className="text-sm sm:text-base text-gray-700 hover:text-black transition-colors">
                  Журнал доз (ДОЗ-3)
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div className="sm:col-span-2 md:col-span-1">
            <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">Контакты</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              По всем вопросам обращайтесь через форму обратной связи на сайте
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 sm:pt-6 border-t-2 border-gray-200 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            © 2026 XrayHub — для рентгенлаборантов стоматологических кабинетов
          </p>
        </div>
      </div>
    </footer>
  );
}
