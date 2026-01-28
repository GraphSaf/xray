import { useState } from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

interface Equipment {
  id: string;
  name: string;
  manufacturer: string;
  type: 'intraoral' | 'panoramic' | 'cbct';
  image?: string;
}

const equipmentList: Equipment[] = [
  {
    id: 'kodak-3500',
    name: 'Kodak 3500',
    manufacturer: 'Carestream Dental',
    type: 'intraoral',
  },
  {
    id: 'sirona-heliodent',
    name: 'Heliodent Plus',
    manufacturer: 'Sirona',
    type: 'intraoral',
  },
  {
    id: 'kavo-op-3d-pro',
    name: 'OP 3D Pro',
    manufacturer: 'KaVo',
    type: 'cbct',
  },
];

const typeLabels = {
  intraoral: 'Интраоральный',
  panoramic: 'Панорамный (ОПТГ)',
  cbct: 'КЛКТ (3D)',
};

export function EquipmentGuidePage() {
  const [selectedType, setSelectedType] = useState<'all' | 'intraoral' | 'panoramic' | 'cbct'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipment = equipmentList.filter((eq) => {
    const matchesType = selectedType === 'all' || eq.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="bg-gray-50 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">
            Справочник по оборудованию
          </h1>
          <p className="text-base sm:text-xl text-gray-700">
            Инструкции и руководства по работе с рентгеновским оборудованием
          </p>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-12">
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
              <input
                type="text"
                placeholder="Поиск по названию или производителю..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 text-lg focus:outline-none"
              />
            </div>

            {/* Type Filter */}
            <div className="bg-gray-100 rounded-2xl p-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
                    selectedType === 'all' ? 'bg-black text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => setSelectedType('intraoral')}
                  className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
                    selectedType === 'intraoral'
                      ? 'bg-black text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Интраоральные
                </button>
                <button
                  onClick={() => setSelectedType('panoramic')}
                  className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
                    selectedType === 'panoramic'
                      ? 'bg-black text-white'
                      : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ОПТГ
                </button>
                <button
                  onClick={() => setSelectedType('cbct')}
                  className={`py-3 px-4 text-center font-semibold text-sm sm:text-base rounded-2xl transition-all ${
                    selectedType === 'cbct' ? 'bg-black text-white' : 'bg-transparent text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  КЛКТ
                </button>
              </div>
            </div>
          </div>

          {/* Equipment Cards */}
          {filteredEquipment.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-12 text-center">
              <p className="text-xl text-gray-600">Оборудование не найдено</p>
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="mt-12 bg-black text-white rounded-3xl p-8 sm:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Скоро: AI-ассистент</h3>
            <p className="text-lg sm:text-xl leading-relaxed mb-6">
              Мы работаем над интеграцией искусственного интеллекта для ответов на ваши вопросы об оборудовании.
              Вы сможете задавать вопросы на естественном языке и получать точные ответы из инструкций.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white text-black px-6 py-3 rounded-2xl font-semibold">
                Загрузка PDF-инструкций
              </div>
              <div className="bg-white text-black px-6 py-3 rounded-2xl font-semibold">
                RAG (поиск по документам)
              </div>
              <div className="bg-white text-black px-6 py-3 rounded-2xl font-semibold">
                Чат с нейросетью
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

interface EquipmentCardProps {
  equipment: Equipment;
}

function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
      {/* Image Placeholder */}
      <div className="h-48 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-500">Изображение скоро появится</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl">
            {typeLabels[equipment.type]}
          </span>
        </div>
        <h3 className="text-xl font-bold text-black mb-2">{equipment.name}</h3>
        <p className="text-base text-gray-600 mb-4">{equipment.manufacturer}</p>

        <button
          disabled
          className="w-full px-6 py-3 bg-gray-200 text-gray-500 font-semibold rounded-2xl cursor-not-allowed"
        >
          Инструкция (скоро)
        </button>
      </div>
    </div>
  );
}
