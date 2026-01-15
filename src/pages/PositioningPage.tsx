import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { DentalPositioningSimulator } from '../components/DentalPositioningSimulator';
import { useState } from 'react';

export function PositioningPage() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'guide'>('guide');

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Page Header */}
      <div className="bg-gray-50 border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-bold text-black">Укладки и позиционирование</h1>
          <p className="mt-2 text-xl text-gray-700">
            Справочник для рентгенлаборантов стоматологических кабинетов
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-6 sm:px-8 lg:px-12">
        {/* Tabs */}
        <div className="bg-gray-100 rounded-3xl p-2 mb-8">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-5 px-8 text-center font-bold text-xl rounded-3xl transition-all ${
                activeTab === 'guide'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 Справочник укладок
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`py-5 px-8 text-center font-bold text-xl rounded-3xl transition-all ${
                activeTab === 'simulator'
                  ? 'bg-black text-white'
                  : 'bg-transparent text-gray-700 hover:bg-gray-200'
              }`}
            >
              🦷 3D Симулятор
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'guide' ? (
          <div className="bg-gray-50 rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-black mb-8">Виды снимков в стоматологии</h2>

            {/* Интраоральные снимки */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-black mb-6 flex items-center">
                <span className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mr-4 text-2xl">1</span>
                Интраоральные снимки (внутриротовые)
              </h3>

              <div className="space-y-8 ml-16">
                {/* Периапикальные */}
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <h4 className="text-2xl font-bold text-black mb-4">Периапикальные снимки</h4>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Что показывает:</strong> Зуб целиком от коронки до верхушки корня и окружающую кость.
                  </p>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Когда делают:</strong> Кариес, пульпит, периодонтит, перед лечением каналов.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h5 className="text-xl font-bold text-black mb-3">Как правильно расположить:</h5>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li>• <strong>Пленку или сенсор</strong> помещают в рот пациента за зуб</li>
                      <li>• <strong>Тубус аппарата</strong> направляют перпендикулярно пленке (под прямым углом)</li>
                      <li>• <strong>Расстояние</strong> от тубуса до кожи 20-30 см</li>
                      <li>• <strong>Пациент не двигается</strong> во время съемки (2-3 секунды)</li>
                    </ul>
                  </div>
                </div>

                {/* Прикусные (Bite-wing) */}
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <h4 className="text-2xl font-bold text-black mb-4">Прикусные снимки (Bite-wing)</h4>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Что показывает:</strong> Коронки верхних и нижних зубов одновременно, межзубные промежутки.
                  </p>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Когда делают:</strong> Поиск скрытого кариеса между зубами, проверка пломб.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h5 className="text-xl font-bold text-black mb-3">Как правильно расположить:</h5>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li>• <strong>Пациент закусывает</strong> специальное крепление с пленкой между зубами</li>
                      <li>• <strong>Тубус</strong> направляют горизонтально, немного сверху вниз</li>
                      <li>• <strong>Луч проходит</strong> через межзубные промежутки</li>
                      <li>• <strong>Обе челюсти</strong> видны на одном снимке</li>
                    </ul>
                  </div>
                </div>

                {/* Окклюзионные */}
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <h4 className="text-2xl font-bold text-black mb-4">Окклюзионные снимки</h4>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Что показывает:</strong> Сразу несколько зубов одной челюсти в поперечном сечении.
                  </p>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Когда делают:</strong> Поиск непрорезавшихся зубов, камней слюнных желез, переломов челюсти.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h5 className="text-xl font-bold text-black mb-3">Как правильно расположить:</h5>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li>• <strong>Большая пленка</strong> кладется на жевательную поверхность зубов</li>
                      <li>• <strong>Пациент прикусывает</strong> пленку</li>
                      <li>• <strong>Тубус сверху или снизу</strong> под углом 60-75 градусов</li>
                      <li>• <strong>Луч проходит</strong> через всю челюсть</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ОПТГ */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-black mb-6 flex items-center">
                <span className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mr-4 text-2xl">2</span>
                Панорамный снимок (ОПТГ)
              </h3>

              <div className="ml-16">
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Что показывает:</strong> Все зубы верхней и нижней челюсти, височно-нижнечелюстные суставы, гайморовы пазухи.
                  </p>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Когда делают:</strong> Первичный осмотр, планирование имплантации, ортодонтическое лечение (брекеты).
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h5 className="text-xl font-bold text-black mb-3">Как правильно расположить:</h5>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li>• <strong>Пациент стоит</strong> или сидит, опираясь лбом и подбородком на опоры</li>
                      <li>• <strong>Зубы сомкнуты</strong> на специальной пластинке</li>
                      <li>• <strong>Язык прижат</strong> к нёбу</li>
                      <li>• <strong>Аппарат вращается</strong> вокруг головы (15-20 секунд)</li>
                      <li>• <strong>Не двигаться</strong> и не глотать во время съемки</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* ТРГ */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-black mb-6 flex items-center">
                <span className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mr-4 text-2xl">3</span>
                Телерентгенограмма (ТРГ)
              </h3>

              <div className="ml-16">
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Что показывает:</strong> Череп в профиль или анфас, соотношение челюстей, строение лицевого скелета.
                  </p>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Когда делают:</strong> Перед ортодонтическим лечением (брекеты), планирование операций на челюстях.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h5 className="text-xl font-bold text-black mb-3">Как правильно расположить:</h5>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li>• <strong>Пациент стоит боком</strong> (для снимка в профиль)</li>
                      <li>• <strong>Голова фиксируется</strong> в специальном держателе</li>
                      <li>• <strong>Франкфуртская горизонталь</strong> параллельна полу</li>
                      <li>• <strong>Расстояние большое</strong> - 1.5-2 метра до источника</li>
                      <li>• <strong>Зубы сомкнуты</strong> в привычном прикусе</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* КЛКТ */}
            <div>
              <h3 className="text-3xl font-bold text-black mb-6 flex items-center">
                <span className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mr-4 text-2xl">4</span>
                3D снимок (КЛКТ)
              </h3>

              <div className="ml-16">
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-200">
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Что показывает:</strong> Трехмерное изображение челюстей, зубов, нервов, сосудов. Можно "разрезать" в любой плоскости.
                  </p>
                  <p className="text-xl text-gray-700 mb-4 leading-relaxed">
                    <strong>Когда делают:</strong> Планирование имплантации, сложное удаление зубов мудрости, поиск каналов, переломы.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                    <h5 className="text-xl font-bold text-black mb-3">Как правильно расположить:</h5>
                    <ul className="space-y-3 text-lg text-gray-700">
                      <li>• <strong>Как при ОПТГ</strong> - пациент стоит/сидит с фиксацией головы</li>
                      <li>• <strong>Аппарат вращается</strong> вокруг области интереса (20-40 секунд)</li>
                      <li>• <strong>Полная неподвижность</strong> критична для качества</li>
                      <li>• <strong>Снять металлические украшения</strong> (серьги, заколки)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Важные советы */}
            <div className="mt-16 bg-black text-white rounded-3xl p-12">
              <h3 className="text-3xl font-bold mb-6">⚠️ Важно помнить</h3>
              <ul className="space-y-4 text-xl leading-relaxed">
                <li>• <strong>Защита:</strong> Всегда надевайте свинцовый фартук на пациента</li>
                <li>• <strong>Беременность:</strong> Спрашивайте женщин о беременности - рентген только по острой необходимости</li>
                <li>• <strong>Дети:</strong> У детей доза должна быть снижена, используйте детские режимы</li>
                <li>• <strong>Качество:</strong> Если снимок нечеткий - лучше переделать сразу, чем лечить неправильно</li>
                <li>• <strong>Документация:</strong> Заполняйте журнал доз (ДОЗ-3) после каждого исследования</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl overflow-hidden">
            {/* 3D Симулятор */}
            <div className="p-8" style={{ height: '800px' }}>
              <DentalPositioningSimulator />
            </div>

            <div className="p-8 bg-white">
              <p className="text-xl text-gray-700 leading-relaxed">
                <strong>Примечание:</strong> 3D-модель в разработке. Сейчас здесь будет интерактивный тренажер для отработки позиционирования пациента и рентген-аппарата.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
