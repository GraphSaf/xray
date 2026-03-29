# XRay - Radiation Dose Reporting App

Веб-приложение для генерации отчетов DOZ3 для стоматологических рентген-снимков с интерактивным 3D симулятором позиционирования.

## 🎯 Описание проекта

React + TypeScript + Vite приложение с 3D визуализацией стоматологической рентгенографии. Включает интерактивный симулятор с анатомическими моделями (зубы, десны, гортань, язык) и систему позиционирования рентген-аппарата (тубус, датчик, источник света).

## 📁 Структура репозитория

### Ветки

- **`main`** - основная ветка (currently empty, needs merge from active branch)
- **`claude/radiation-dose-reporting-app-RM8Cf`** ⭐ - АКТИВНАЯ ВЕТКА с полным кодом приложения
- **`claude/blender-xray-scene-setup-zFp6c`** - ветка для настройки Blender сцены (содержит только .mcp.json)
- **`copilot/enable-github-pages-access`** - GitHub Pages конфигурация

### Ключевые файлы

```
/
├── src/
│   ├── components/
│   │   └── DentalPositioningSimulator.tsx  ⭐ ГЛАВНЫЙ ФАЙЛ 3D СЦЕНЫ
│   ├── pages/
│   │   ├── DOZ3Page.tsx
│   │   ├── PositioningPage.tsx
│   │   ├── EquipmentGuidePage.tsx
│   │   ├── LandingPage.tsx
│   │   └── CRMPage.tsx
│   ├── store/
│   │   ├── useDoseSettingsStore.ts
│   │   └── useDOZ3Store.ts
│   └── types/
├── .mcp.json - конфигурация Blender MCP сервера
├── ТЗ ДОЗ 3.pdf - техническое задание
└── README.md - этот файл
```

## 🎮 3D Симулятор (DentalPositioningSimulator.tsx)

### Технологии
- **React Three Fiber** (@react-three/fiber) - React renderer для Three.js
- **React Three Drei** (@react-three/drei) - helpers для R3F
- **Three.js** - 3D движок

### Архитектура 3D объектов

Все объекты используют систему **Pivot/Object**:
- **Pivot** (P) - точка вращения/опорная точка в мировых координатах
- **Object** (O) - позиция самого объекта относительно pivot
- **Rotation** (R) - ротация в радианах (Euler XYZ)

### 3D Модели в сцене

Модели загружаются с S3: `https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub`

1. **Верхние зубы** (`teeth_upper.glb`)
2. **Нижние зубы** (`teeth_lower.glb`)
3. **Верхние десны** (`gums_upper.glb`)
4. **Нижние десны** (`gums_lower.glb`)
5. **Гортань** (`throat.glb`)
6. **Язык** (`tongue.glb`) - временно отключен (битая модель 132B)
7. **Датчик рентгена** (`xray_sensor.glb`)
8. **Источник света** (SpotLight с визуализацией)

## 📐 Координаты объектов (от пользователя)

### ЗАДАЧА: Применить эти координаты в DentalPositioningSimulator.tsx

#### Датчик (xray_sensor)
```typescript
// Текущие значения в коде:
const [sensorPivotPos] = useState<[number, number, number]>([0, 0, 0]);
const [sensorObjPos] = useState<[number, number, number]>([0, 0, 0]);
const [sensorObjRot] = useState<[number, number, number]>([0, 0, 0]);

// НУЖНО ПРИМЕНИТЬ:
const [sensorPivotPos] = useState<[number, number, number]>([0, 0, 0.90]);
const [sensorObjPos] = useState<[number, number, number]>([0, 0.40, -3.30]);
const [sensorObjRot] = useState<[number, number, number]>([-0.82, 0, 0]);
```
**Описание:** Датчик расположен вертикально в центре мира

#### Нижние зубы (teeth_lower)
```typescript
// Текущие значения в коде:
const [teethLowerPivotPos] = useState<[number, number, number]>([0, 0, 0]);
const [teethLowerObjPos] = useState<[number, number, number]>([0, 0, 0]);
const [teethLowerObjRot] = useState<[number, number, number]>([0, 0, 0]);

// НУЖНО ПРИМЕНИТЬ:
const [teethLowerPivotPos] = useState<[number, number, number]>([0, 0, 0]);
const [teethLowerObjPos] = useState<[number, number, number]>([0, -0.80, -0.20]);
const [teethLowerObjRot] = useState<[number, number, number]>([0.20, 0, 0]);
```

## 🔦 Визуализация источника света

### ТЕКУЩАЯ РЕАЛИЗАЦИЯ (строки 166-193):
```typescript
// Компонент LightVisualization - отображает arrowHelper (красная стрелка)
<arrowHelper
  args={[
    new THREE.Vector3(0, 0, -1), // направление
    new THREE.Vector3(0, 0, 0),  // начало
    arrowLength,                  // длина = 3
    0xff0000,                     // красный цвет
    0.3, 0.2                      // размеры головки
  ]}
/>
```

### ТРЕБУЕТСЯ:
Заменить `arrowHelper` на **светопропускаемый шар** (translucent sphere):
```typescript
<mesh position={[0, 0, 0]}>
  <sphereGeometry args={[0.1, 32, 32]} />
  <meshStandardMaterial
    color="#80E5FF"           // голубоватый
    emissive="#70D5EE"        // свечение
    emissiveIntensity={2}
    transparent={true}
    opacity={0.6}
    roughness={0.1}
    metalness={0.2}
  />
</mesh>
```

## 📝 История взаимодействия с пользователем

### Контекст задачи
Пользователь настраивал сцену в Blender с объектами:
- Анатомически правильные зубы
- Слизистая с гортанью
- Тубус рентген-аппарата
- Датчик (xray_sensor)
- Источник света (xray_light_area)

### Задачи от пользователя:
1. ✅ Подключить Blender MCP сервер (отменено - пользователь работает в Blender вручную)
2. ⏳ **Применить координаты датчика к веб-приложению**
3. ⏳ **Применить координаты нижних зубов**
4. ⏳ **Убрать arrowHelper у света**
5. ⏳ **Создать светопропускаемый шар-индикатор источника света**

### Вопрос пользователя о Pivot:
> "что такое пивот как то непредсказуемо работает"

**Ответ:** Pivot (пивот) - это точка вращения и масштабирования объекта. Может работать непредсказуемо, если origin объекта смещен относительно геометрии.

## 🚀 Как продолжить работу

### Шаг 1: Переключиться на активную ветку
```bash
git checkout claude/radiation-dose-reporting-app-RM8Cf
```

### Шаг 2: Применить координаты
Отредактировать `/src/components/DentalPositioningSimulator.tsx`:
- Строки 241-245: Обновить датчик
- Строки 211-215: Обновить нижние зубы
- Строки 166-193: Заменить визуализацию света

### Шаг 3: Закоммитить и запушить
```bash
git add src/components/DentalPositioningSimulator.tsx
git commit -m "Применены координаты датчика и нижних зубов из Blender"
git push -u origin claude/radiation-dose-reporting-app-RM8Cf
```

### Шаг 4: Тестирование
```bash
npm install
npm run dev
```
Открыть страницу "Positioning" и проверить 3D сцену.

## 🔧 Конфигурация MCP

Файл `.mcp.json` содержит настройку Blender MCP сервера (порт 9888):
```json
{
  "mcpServers": {
    "blender": {
      "type": "http",
      "url": "http://localhost:9888"
    }
  }
}
```

**Примечание:** MCP сервер был отключен пользователем - настройки применяются вручную в Blender.

## 📋 TODO для следующего AI агента

- [ ] Применить координаты датчика (P, O, R)
- [ ] Применить координаты нижних зубов (P, O, R)
- [ ] Заменить arrowHelper на светопропускаемый шар
- [ ] Протестировать изменения в dev режиме
- [ ] Возможно применить координаты для других объектов (верхние зубы, десны, гортань)
- [ ] Рассмотреть вопрос merge активной ветки в main

## 📚 Полезные команды

```bash
# Переключение между ветками
git checkout main
git checkout claude/radiation-dose-reporting-app-RM8Cf

# Просмотр всех веток
git branch -a

# Запуск dev сервера
npm run dev

# Сборка проекта
npm run build

# Просмотр 3D компонента
# Открыть http://localhost:5173/positioning
```

## 🎨 Система координат Three.js

- **X** - право/лево (red axis)
- **Y** - верх/низ (green axis)
- **Z** - вперед/назад (blue axis)

Ротация в радианах:
- `0.20` радиан ≈ 11.5°
- `-0.82` радиан ≈ -47°

## 📄 Техническое задание

Подробное ТЗ в файле `ТЗ ДОЗ 3.pdf` (101KB)

---

**Последнее обновление:** 2026-01-28
**Статус проекта:** В разработке
**Активная ветка:** `claude/radiation-dose-reporting-app-RM8Cf`
