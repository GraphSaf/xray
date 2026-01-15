import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:py-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <img
              src="https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub/xrayhub_logo.png"
              alt="XrayHub"
              className="h-14 sm:h-16 w-auto"
            />
            <div className="hidden sm:block">
              <span className="text-xl sm:text-2xl font-bold text-black block">XrayHub</span>
              <span className="text-sm text-gray-600">Для стоматологов</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/doz3"
              className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all ${
                isActive('/doz3')
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Журнал ДОЗ-3
            </Link>
            <Link
              to="/positioning"
              className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all ${
                isActive('/positioning')
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Укладки
            </Link>
            <Link
              to="/crm"
              className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all ${
                isActive('/crm')
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Пациенты
            </Link>
          </nav>

          {/* Auth + Mobile Menu */}
          <div className="flex items-center space-x-3">
            <AuthButton />

            {/* Mobile Dropdown */}
            <div className="md:hidden relative group">
              <button className="px-6 py-3 bg-gray-100 rounded-2xl font-semibold text-base">
                Меню
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link
                  to="/positioning"
                  className="block px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 first:rounded-t-2xl"
                >
                  Укладки
                </Link>
                <Link
                  to="/crm"
                  className="block px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100"
                >
                  Пациенты
                </Link>
                <Link
                  to="/doz3"
                  className="block px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 last:rounded-b-2xl"
                >
                  Журнал ДОЗ-3
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
