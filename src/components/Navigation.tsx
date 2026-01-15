import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-4 px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">X</span>
            </div>
            <div>
              <span className="text-xl font-bold text-black block">XrayHub</span>
              <span className="text-xs text-gray-600 hidden sm:block">Для стоматологов</span>
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

          {/* Mobile Menu + Auth */}
          <div className="flex items-center space-x-4">
            {/* Mobile Dropdown */}
            <div className="md:hidden relative group">
              <button className="px-4 py-2 bg-gray-100 rounded-2xl font-semibold text-base">
                Меню ☰
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border-2 border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link
                  to="/doz3"
                  className="block px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 first:rounded-t-2xl"
                >
                  Журнал ДОЗ-3
                </Link>
                <Link
                  to="/positioning"
                  className="block px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100"
                >
                  Укладки
                </Link>
                <Link
                  to="/crm"
                  className="block px-6 py-4 text-lg font-semibold text-gray-800 hover:bg-gray-100 last:rounded-b-2xl"
                >
                  Пациенты
                </Link>
              </div>
            </div>

            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
