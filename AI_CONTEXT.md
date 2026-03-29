# AI Context - Техническая документация для AI агентов

> Этот файл содержит машиночитаемую документацию для быстрого понимания текущего состояния проекта AI агентами.

## 🎯 Текущая задача

Применить координаты объектов 3D сцены, полученные из Blender, в веб-приложение React + Three.js.

## 📐 Координаты для применения

### Датчик (xray_sensor)
**Файл:** `src/components/DentalPositioningSimulator.tsx`
**Строки:** 241-245
**Ветка для изменений:** `claude/radiation-dose-reporting-app-RM8Cf` (НЕ текущая ветка!)

```typescript
// ❌ ТЕКУЩЕЕ СОСТОЯНИЕ:
const [sensorPivotPos] = useState<[number, number, number]>([0, 0, 0]);
const [sensorObjPos] = useState<[number, number, number]>([0, 0, 0]);
const [sensorObjRot] = useState<[number, number, number]>([0, 0, 0]);

// ✅ ТРЕБУЕТСЯ ПРИМЕНИТЬ:
const [sensorPivotPos] = useState<[number, number, number]>([0, 0, 0.90]);
const [sensorObjPos] = useState<[number, number, number]>([0, 0.40, -3.30]);
const [sensorObjRot] = useState<[number, number, number]>([-0.82, 0, 0]);
```

**Описание от пользователя:**
- Датчик расположен вертикально
- Находится в центре мира и координат
- P (Pivot): [0.00, 0.00, 0.90]
- O (Object): [0.00, 0.40, -3.30] - "объект в центре мира и своих координат"
- R (Rotation): [-0.82, 0.00, 0.00] - "ротацию тоже сделал"

### Нижние зубы (teeth_lower)
**Файл:** `src/components/DentalPositioningSimulator.tsx`
**Строки:** 211-215
**Ветка для изменений:** `claude/radiation-dose-reporting-app-RM8Cf`

```typescript
// ❌ ТЕКУЩЕЕ СОСТОЯНИЕ:
const [teethLowerPivotPos] = useState<[number, number, number]>([0, 0, 0]);
const [teethLowerObjPos] = useState<[number, number, number]>([0, 0, 0]);
const [teethLowerObjRot] = useState<[number, number, number]>([0, 0, 0]);

// ✅ ТРЕБУЕТСЯ ПРИМЕНИТЬ:
const [teethLowerPivotPos] = useState<[number, number, number]>([0, 0, 0]);
const [teethLowerObjPos] = useState<[number, number, number]>([0, -0.80, -0.20]);
const [teethLowerObjRot] = useState<[number, number, number]>([0.20, 0, 0]);
```

## 🔦 Визуализация источника света

### Задача: Заменить arrowHelper на светопропускаемый шар

**Файл:** `src/components/DentalPositioningSimulator.tsx`
**Функция:** `LightVisualization`
**Строки:** 166-193
**Ветка для изменений:** `claude/radiation-dose-reporting-app-RM8Cf`

#### Текущая реализация (удалить):
```typescript
// Компонент визуализации света - только вектор направления
function LightVisualization({
  showAxes
}: {
  showAxes: boolean;
}) {
  const arrowLength = 3;

  return (
    <group>
      {/* Вектор направления (стрелка вдоль -Z) */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(0, 0, 0),
          arrowLength,
          0xff0000,
          0.3,
          0.2
        ]}
      />
      {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}
    </group>
  );
}
```

#### Новая реализация (применить):
```typescript
// Компонент визуализации света - светопропускаемый шар
function LightVisualization({
  showAxes
}: {
  showAxes: boolean;
}) {
  return (
    <group>
      {/* Светопропускаемый шар-индикатор источника света */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color="#80E5FF"           // Голубоватый цвет
          emissive="#70D5EE"        // Свечение
          emissiveIntensity={2}
          transparent={true}
          opacity={0.6}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* Оси координат для отладки */}
      {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}
    </group>
  );
}
```

**Причина замены:** Пользователь сказал "убери вектор у света и сделай светопропускаемый шар там где источник света а то я не понимаю где он"

## 🏗️ Архитектура 3D объектов

### Система Pivot/Object
Все объекты используют двухуровневую трансформацию:

```typescript
<group position={pivotPosition} rotation={pivotRotation}>
  {/* Pivot - опорная точка для вращения */}
  <group position={objectPosition} rotation={objectRotation}>
    {/* Object - сам объект */}
    <primitive object={model} />
  </group>
</group>
```

### Обозначения координат от пользователя:
- **P (Pivot)** = `pivotPosition` - точка вращения в мировых координатах
- **O (Object)** = `objectPosition` - смещение объекта относительно pivot
- **R (Rotation)** = `objectRotation` - ротация в радианах (Euler XYZ)

### Вопрос пользователя о Pivot:
> "что такое пивот как то непредсказуемо работает"

**Ответ:** Pivot (пивот) - это точка вращения и масштабирования. Может работать непредсказуемо если origin объекта в Blender смещен относительно геометрии. В коде это первая группа трансформаций.

## 📝 История коммуникации

### Контекст
Пользователь настраивал 3D сцену в Blender:
- Анатомические модели (зубы, слизистая, гортань)
- Рентген-аппарат (тубус, датчик, источник света - xray_light_area)
- MCP сервер Blender был настроен на порт 9888, но **отключен** - настройки применяются вручную

### Сообщения пользователя (хронология):

1. **Координаты датчика:**
   ```
   P: [0.00, 0.00, 0.90]
   O: [0.00, 0.40, -3.30]
   R: [-0.82, 0.00, 0.00]
   ```

2. **"mcp я отключил я на сайте все выставляю"**
   - "примени настройку к датчику"
   - "убери вектор у света и сделай светопропускаемый шар"

3. **"да не в блендере, забудь про него надо на гите применить к сайту"**

4. **"погоди ты к гиту можешь подключиться?"**

5. **"надо применить изменения на сайт"**

6. **"можем выбрать какую-то одну ветку самую актуальную и сделать ее main"**

7. **"а погодь все отмени"** (отмена применения изменений)

8. **"напиши все что я тебе написал с момента когда я отправил тебе позицию датчика"**

9. **"Напиши и создай в репо полноценный readme в машиночитаемом виде чтобы другая нейросеть быстро вникла и смогла продолжить твою работу"**

## 🔄 Git ветки

### ⚠️ ВАЖНО: Ограничения на push

Только ветки с именем `claude/<name>-<SESSION_ID>` могут быть запушены.
Текущий SESSION_ID: `zFp6c` (из `claude/blender-xray-scene-setup-zFp6c`)

### Активная ветка с кодом: `claude/radiation-dose-reporting-app-RM8Cf` ❌
**ПРОБЛЕМА:** Эта ветка НЕ может быть запушена (HTTP 403), потому что не заканчивается на session ID.

**Решение:** Создать новую ветку с правильным именем или применить изменения в существующей ветке с правами.

### Текущая ветка: `claude/blender-xray-scene-setup-zFp6c` ✅
- Имеет права на push
- Содержит только .mcp.json, README.md, AI_CONTEXT.md
- НЕ содержит код приложения

### Другие ветки:
- `main` - основная ветка (содержит код)
- `copilot/enable-github-pages-access` - GitHub Pages

## 🚀 Как применить изменения (правильный workflow)

### Вариант 1: Создать новую ветку с правильным именем
```bash
# Checkout from radiation-dose branch
git checkout claude/radiation-dose-reporting-app-RM8Cf

# Create new branch with correct session ID
git checkout -b claude/apply-blender-coords-zFp6c

# Apply changes to DentalPositioningSimulator.tsx
# ... edit file ...

# Commit and push
git add src/components/DentalPositioningSimulator.tsx
git commit -m "Применены координаты из Blender"
git push -u origin claude/apply-blender-coords-zFp6c

# Create PR to merge into claude/radiation-dose-reporting-app-RM8Cf or main
```

### Вариант 2: Cherry-pick в main
```bash
git checkout main
git cherry-pick <commit-hash-with-changes>
git push origin main
```

### Вариант 3: Manual merge через GitHub web interface
1. Push AI_CONTEXT.md в текущую ветку (claude/blender-xray-scene-setup-zFp6c) ✅
2. Создать PR из `claude/radiation-dose-reporting-app-RM8Cf` в `main`
3. Вручную применить координаты через GitHub editor
4. Merge PR

## 📦 3D Модели (S3)

Базовый URL: `https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub`

Модели:
- `teeth_upper.glb` - верхние зубы
- `teeth_lower.glb` - нижние зубы ⭐ (нужно применить координаты)
- `gums_upper.glb` - верхние десны
- `gums_lower.glb` - нижние десны
- `throat.glb` - гортань
- `tongue.glb` - язык (отключен - битая модель 132B)
- `xray_sensor.glb` - датчик ⭐ (нужно применить координаты)

## 🎨 Система координат Three.js

- **X** (red) - право (+) / лево (-)
- **Y** (green) - верх (+) / низ (-)
- **Z** (blue) - к камере (+) / от камеры (-)

### Конвертация углов:
- Rotation в коде в **радианах**
- `0.20` рад ≈ `11.5°`
- `-0.82` рад ≈ `-47°`

## ✅ TODO

- [ ] Создать новую ветку с правильным session ID
- [ ] Применить координаты датчика (P, O, R)
- [ ] Применить координаты нижних зубов (P, O, R)
- [ ] Заменить arrowHelper на светопропускаемый шар
- [ ] Протестировать изменения (npm run dev)
- [ ] Создать коммит и запушить
- [ ] Создать PR для merge в main или активную ветку

## 🔍 Полезные команды

### Поиск в коде
```bash
# Найти все useState для координат
grep -n "useState<\[number, number, number\]>" src/components/DentalPositioningSimulator.tsx

# Найти функцию визуализации света
grep -n "LightVisualization" src/components/DentalPositioningSimulator.tsx
```

### Git операции
```bash
# Просмотр всех веток
git branch -a

# Fetch всех веток
git fetch --all

# Checkout существующей удаленной ветки
git checkout -b <branch-name> origin/<branch-name>

# Создание новой ветки с правильным именем
git checkout -b claude/<name>-zFp6c
```

## 📚 Референсы

- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber
- **Three.js:** https://threejs.org/docs/
- **Euler angles:** https://threejs.org/docs/#api/en/math/Euler
- **README.md** - общая документация проекта
- **ТЗ ДОЗ 3.pdf** - техническое задание (101KB)

---

**Последнее обновление:** 2026-01-28
**Статус:** Координаты получены, документация создана. Требуется создание новой ветки для применения изменений.
**Текущая ветка:** `claude/blender-xray-scene-setup-zFp6c` (без кода приложения)
**Ветка с кодом:** `claude/radiation-dose-reporting-app-RM8Cf` (нет прав на push)
