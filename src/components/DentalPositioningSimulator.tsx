import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Html } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import * as React from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';

// S3 хранилище Beget
const S3_BASE_URL = 'https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub';

// URL моделей
const MODEL_URLS = {
  teethUpper: `${S3_BASE_URL}/teeth_upper.glb`,
  teethLower: `${S3_BASE_URL}/teeth_lower.glb`,
  gumsLower: `${S3_BASE_URL}/gums_lower.glb`,
  gumsUpper: `${S3_BASE_URL}/gums_upper.glb`,
  throat: `${S3_BASE_URL}/throat.glb`,
  tongue: `${S3_BASE_URL}/tongue.glb`,
  xraySensor: `${S3_BASE_URL}/xray_sensor.glb`,
  placeholder: '/models/placeholder.glb',
};

// Компонент загрузки (placeholder) - вращающийся
function LoadingPlaceholder() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Анимация вращения
  React.useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.02;
        meshRef.current.rotation.x += 0.01;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial
        color="#48BB78"
        emissive="#48BB78"
        emissiveIntensity={0.5}
        wireframe
      />
    </mesh>
  );
}

// Компонент для отображения осей координат
function AxesHelper({ size = 1, position = [0, 0, 0] as [number, number, number] }) {
  const axesRef = useRef<THREE.AxesHelper>(null);

  React.useEffect(() => {
    if (axesRef.current) {
      axesRef.current.position.set(...position);
    }
  }, [position]);

  return <axesHelper ref={axesRef} args={[size]} />;
}


// Универсальный компонент модели с pivot и object трансформациями
function UniversalModel({
  modelUrl,
  pivotPosition,
  pivotRotation,
  objectPosition,
  objectRotation,
  opacity = 1,
  showAxes,
  isSelected,
  onClick,
  label
}: {
  modelUrl: string;
  pivotPosition: [number, number, number];
  pivotRotation: [number, number, number];
  objectPosition: [number, number, number];
  objectRotation: [number, number, number];
  opacity?: number;
  showAxes: boolean;
  isSelected: boolean;
  onClick: () => void;
  label: string;
}) {
  try {
    const { scene } = useGLTF(modelUrl);
    const clonedScene = scene.clone(true);

  // Настройка теней и прозрачности
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Добавляем прозрачность если нужно
        if (opacity < 1 && mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.transparent = true;
          material.opacity = opacity;
        }
      }
    });
  }, [clonedScene, opacity]);

    return (
      <group onClick={onClick}>
        {/* Pivot (оси вращения) */}
        <group position={pivotPosition} rotation={pivotRotation}>
          {/* Object (сам объект) */}
          <group position={objectPosition} rotation={objectRotation}>
            <primitive object={clonedScene} />
          </group>
          {/* Оси в центре pivot */}
          {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}
        </group>
        {isSelected && (
          <Html position={[pivotPosition[0], pivotPosition[1] + 1.5, pivotPosition[2]]} center>
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              {label}
            </div>
          </Html>
        )}
      </group>
    );
  } catch (error) {
    console.error(`Error loading model ${modelUrl}:`, error);
    // Fallback: показываем wireframe куб
    return (
      <group onClick={onClick}>
        <group position={pivotPosition} rotation={pivotRotation}>
          <group position={objectPosition} rotation={objectRotation}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial
                color="#ff0000"
                wireframe
                transparent={opacity < 1}
                opacity={opacity}
              />
            </mesh>
          </group>
          {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}
        </group>
        {isSelected && (
          <Html position={[pivotPosition[0], pivotPosition[1] + 0.5, pivotPosition[2]]} center>
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              {label} (ERROR)
            </div>
          </Html>
        )}
      </group>
    );
  }
}


// Компонент визуализации света - светящийся шар-индикатор
function LightVisualization({
  showAxes
}: {
  showAxes: boolean;
}) {
  return (
    <group>
      {/* Светопропускаемый шар-индикатор для источника света */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffff00"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Оси координат для отладки */}
      {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}
    </group>
  );
}

type SelectedObject = 'teeth_upper' | 'teeth_lower' | 'gums_upper' | 'gums_lower' | 'throat' | 'tongue' | 'sensor' | 'light' | null;

// Основной компонент симулятора
export function DentalPositioningSimulator() {
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'dark'>('white');
  const [showAxes, setShowAxes] = useState(true);
  const [selectedObject, setSelectedObject] = useState<SelectedObject>(null);

  // Все объекты в центре мира - раздельные настройки Pivot и Object

  // Верхние зубы
  const [teethUpperPivotPos, setTeethUpperPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [teethUpperPivotRot, setTeethUpperPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [teethUpperObjPos, setTeethUpperObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [teethUpperObjRot, setTeethUpperObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Нижние зубы
  const [teethLowerPivotPos, setTeethLowerPivotPos] = useState<[number, number, number]>([0.00, 0.00, 0.00]);
  const [teethLowerPivotRot, setTeethLowerPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [teethLowerObjPos, setTeethLowerObjPos] = useState<[number, number, number]>([0.00, -0.80, -0.20]);
  const [teethLowerObjRot, setTeethLowerObjRot] = useState<[number, number, number]>([0.20, 0.00, 0.00]);

  // Верхние мягкие ткани
  const [gumsUpperPivotPos, setGumsUpperPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsUpperPivotRot, setGumsUpperPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsUpperObjPos, setGumsUpperObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsUpperObjRot, setGumsUpperObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Нижние мягкие ткани
  const [gumsLowerPivotPos, setGumsLowerPivotPos] = useState<[number, number, number]>([0.00, 0.00, 0.00]);
  const [gumsLowerPivotRot, setGumsLowerPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsLowerObjPos, setGumsLowerObjPos] = useState<[number, number, number]>([0.00, -0.90, -0.30]);
  const [gumsLowerObjRot, setGumsLowerObjRot] = useState<[number, number, number]>([0.34, 0.00, -0.00]);

  // Гортань
  const [throatPivotPos, setThroatPivotPos] = useState<[number, number, number]>([0.00, 0.00, 0.00]);
  const [throatPivotRot, setThroatPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [throatObjPos, setThroatObjPos] = useState<[number, number, number]>([0.00, -0.60, -0.10]);
  const [throatObjRot, setThroatObjRot] = useState<[number, number, number]>([0.30, 0.00, -0.00]);

  // Язык
  const [tonguePivotPos, setTonguePivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [tonguePivotRot, setTonguePivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [tongueObjPos, setTongueObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [tongueObjRot, setTongueObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Датчик
  const [sensorPivotPos, setSensorPivotPos] = useState<[number, number, number]>([0.00, 0.00, 0.90]);
  const [sensorPivotRot, setSensorPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [sensorObjPos, setSensorObjPos] = useState<[number, number, number]>([0.00, 0.40, -3.30]);
  const [sensorObjRot, setSensorObjRot] = useState<[number, number, number]>([-0.82, 0.00, 0.00]);

  // Свет - система Pivot/Object как у остальных объектов
  const [lightPivotPos, setLightPivotPos] = useState<[number, number, number]>([0.00, 0.00, 0.00]);
  const [lightPivotRot, setLightPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [lightObjPos, setLightObjPos] = useState<[number, number, number]>([0.00, 0.00, 5.50]);
  const [lightObjRot, setLightObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Бисектрисная методика
  const [useBisectrixTechnique, setUseBisectrixTechnique] = useState(false);
  const [bisectrixAngle, setBisectrixAngle] = useState(0.10);
  const [xrayLightIntensity, setXrayLightIntensity] = useState(220);
  const [xrayLightAngle, setXrayLightAngle] = useState(9);
  const [lightDistance, setLightDistance] = useState(10);
  const [lightPenumbra, setLightPenumbra] = useState(0.05);
  const [lightDecay, setLightDecay] = useState(2);

  // Прозрачность челюстей
  const [teethOpacity, setTeethOpacity] = useState(0.5);

  // Видимость мягких тканей и гортани
  const [showSoftTissues, setShowSoftTissues] = useState(true);

  const controlsRef = useRef<OrbitControlsType>(null);
  const xrayLightRef = useRef<THREE.SpotLight>(null);

  // Обновляем направление SpotLight - свет направлен на объект датчика
  React.useEffect(() => {
    if (xrayLightRef.current) {
      // Свет направлен на позицию объекта сенсора (относительно pivot)
      xrayLightRef.current.target.position.set(...sensorObjPos);
      xrayLightRef.current.target.updateMatrixWorld();
    }
  }, [lightObjPos, lightObjRot, sensorObjPos, useBisectrixTechnique, bisectrixAngle]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const bgColor = backgroundColor === 'white' ? '#ffffff' : '#374151';
  const containerBg = backgroundColor === 'white' ? 'bg-white' : 'bg-gray-700';

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* 3D Canvas */}
      <div className={`h-[400px] lg:h-full lg:flex-1 relative ${containerBg} rounded-lg overflow-hidden border-2 border-gray-200`}>
        <Canvas shadows>
          <color attach="background" args={[bgColor]} />
          <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={60} />
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />

          {/* Освещение - усиленное и ближе к объектам */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[3, 4, 3]}
            intensity={1.5}
            castShadow={false}
          />
          <directionalLight
            position={[-3, 4, -3]}
            intensity={1}
          />

          {/* Объекты сцены */}
          <Suspense fallback={<LoadingPlaceholder />}>
            {/* Верхние зубы */}
            <UniversalModel
              modelUrl={MODEL_URLS.teethUpper}
              pivotPosition={teethUpperPivotPos}
              pivotRotation={teethUpperPivotRot}
              objectPosition={teethUpperObjPos}
              objectRotation={teethUpperObjRot}
              opacity={teethOpacity}
              showAxes={showAxes}
              isSelected={selectedObject === 'teeth_upper'}
              onClick={() => setSelectedObject('teeth_upper')}
              label="Верхние зубы"
            />

            {/* Нижние зубы */}
            <UniversalModel
              modelUrl={MODEL_URLS.teethLower}
              pivotPosition={teethLowerPivotPos}
              pivotRotation={teethLowerPivotRot}
              objectPosition={teethLowerObjPos}
              objectRotation={teethLowerObjRot}
              opacity={teethOpacity}
              showAxes={showAxes}
              isSelected={selectedObject === 'teeth_lower'}
              onClick={() => setSelectedObject('teeth_lower')}
              label="Нижние зубы"
            />

            {/* Мягкие ткани и гортань (опционально) */}
            {showSoftTissues && (
              <>
                {/* Верхние мягкие ткани */}
                <UniversalModel
                  modelUrl={MODEL_URLS.gumsUpper}
                  pivotPosition={gumsUpperPivotPos}
                  pivotRotation={gumsUpperPivotRot}
                  objectPosition={gumsUpperObjPos}
                  objectRotation={gumsUpperObjRot}
                  showAxes={showAxes}
                  isSelected={selectedObject === 'gums_upper'}
                  onClick={() => setSelectedObject('gums_upper')}
                  label="Дёсны верхние"
                />

                {/* Нижние мягкие ткани */}
                <UniversalModel
                  modelUrl={MODEL_URLS.gumsLower}
                  pivotPosition={gumsLowerPivotPos}
                  pivotRotation={gumsLowerPivotRot}
                  objectPosition={gumsLowerObjPos}
                  objectRotation={gumsLowerObjRot}
                  showAxes={showAxes}
                  isSelected={selectedObject === 'gums_lower'}
                  onClick={() => setSelectedObject('gums_lower')}
                  label="Дёсны нижние"
                />

                {/* Гортань */}
                <UniversalModel
                  modelUrl={MODEL_URLS.throat}
                  pivotPosition={throatPivotPos}
                  pivotRotation={throatPivotRot}
                  objectPosition={throatObjPos}
                  objectRotation={throatObjRot}
                  showAxes={showAxes}
                  isSelected={selectedObject === 'throat'}
                  onClick={() => setSelectedObject('throat')}
                  label="Гортань"
                />

                {/* Язык - временно отключен, модель битая (132B) */}
                {/* <UniversalModel
                  modelUrl={MODEL_URLS.tongue}
                  pivotPosition={tonguePivotPos}
                  pivotRotation={tonguePivotRot}
                  objectPosition={tongueObjPos}
                  objectRotation={tongueObjRot}
                  showAxes={showAxes}
                  isSelected={selectedObject === 'tongue'}
                  onClick={() => setSelectedObject('tongue')}
                  label="Язык"
                /> */}
              </>
            )}

            {/* Датчик со встроенным светом */}
            <group position={sensorPivotPos} rotation={sensorPivotRot} onClick={() => setSelectedObject('sensor')}>
              {/* Оси в центре pivot датчика */}
              {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}

              {/* Модель датчика */}
              <group position={sensorObjPos} rotation={sensorObjRot}>
                <UniversalModel
                  modelUrl={MODEL_URLS.xraySensor}
                  pivotPosition={[0, 0, 0]}
                  pivotRotation={[0, 0, 0]}
                  objectPosition={[0, 0, 0]}
                  objectRotation={[0, 0, 0]}
                  showAxes={false}
                  isSelected={selectedObject === 'sensor'}
                  onClick={() => setSelectedObject('sensor')}
                  label="Датчик"
                />
              </group>

              {/* Свет относительно датчика */}
              <group
                position={lightObjPos}
                rotation={[
                  useBisectrixTechnique ? bisectrixAngle : lightObjRot[0],
                  lightObjRot[1],
                  lightObjRot[2]
                ]}
              >
                <spotLight
                  ref={xrayLightRef}
                  angle={xrayLightAngle * Math.PI / 180}
                  penumbra={lightPenumbra}
                  intensity={xrayLightIntensity}
                  color="#E5FFE5"
                  distance={lightDistance}
                  decay={lightDecay}
                  castShadow
                  shadow-mapSize={[4096, 4096]}
                  shadow-bias={-0.00001}
                  shadow-camera-near={0.1}
                  shadow-camera-far={20}
                />
                {/* Визуализация света */}
                <LightVisualization showAxes={false} />
              </group>
            </group>
          </Suspense>
        </Canvas>
      </div>

      {/* Панель настроек справа */}
      <div className="w-full lg:w-80 bg-white rounded-2xl border-2 border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-xl mb-4">Настройки</h3>

        {/* Управление камерой и отображением */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold mb-2">Вид</h4>
          <div className="flex flex-col gap-2">
            <button
              onClick={resetCamera}
              className="px-4 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Сбросить камеру
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setBackgroundColor('white')}
                className={`flex-1 px-3 py-2 rounded-xl ${
                  backgroundColor === 'white'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Белый фон
              </button>
              <button
                onClick={() => setBackgroundColor('dark')}
                className={`flex-1 px-3 py-2 rounded-xl ${
                  backgroundColor === 'dark'
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Темный фон
              </button>
            </div>
            <button
              onClick={() => setShowAxes(!showAxes)}
              className={`px-3 py-2 rounded-xl ${
                showAxes ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {showAxes ? 'Скрыть оси' : 'Показать оси'}
            </button>
          </div>
        </div>

        {/* Информация о моделях */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs text-blue-800">
            <strong>Модели загружаются с S3:</strong><br/>
            {S3_BASE_URL}<br/>
            Если видны красные кубики - проверьте CORS и доступ к S3.
          </p>
        </div>

        {/* Глобальные настройки */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold">Глобальные настройки</h4>

          {/* Прозрачность челюстей */}
          <div>
            <label className="text-xs font-semibold mb-1 block">
              Прозрачность челюстей: {(teethOpacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={teethOpacity}
              onChange={(e) => setTeethOpacity(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Показать мягкие ткани */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSoftTissues}
              onChange={(e) => setShowSoftTissues(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Показать мягкие ткани</span>
          </label>
        </div>

        {/* Текущие координаты */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-semibold mb-2">Текущие координаты</h4>
          <div className="text-xs font-mono space-y-1 max-h-48 overflow-y-auto">
            <div className="border-b pb-1">
              <div className="font-semibold">Зубы верхние:</div>
              <div>P: [{teethUpperPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
              <div>O: [{teethUpperObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
            </div>
            <div className="border-b pb-1">
              <div className="font-semibold">Зубы нижние:</div>
              <div>P: [{teethLowerPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
              <div>O: [{teethLowerObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
            </div>
            {showSoftTissues && (
              <>
                <div className="border-b pb-1">
                  <div className="font-semibold">Десны верхние:</div>
                  <div>P: [{gumsUpperPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
                  <div>O: [{gumsUpperObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
                </div>
                <div className="border-b pb-1">
                  <div className="font-semibold">Десны нижние:</div>
                  <div>P: [{gumsLowerPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
                  <div>O: [{gumsLowerObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
                </div>
                <div className="border-b pb-1">
                  <div className="font-semibold">Гортань:</div>
                  <div>P: [{throatPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
                  <div>O: [{throatObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
                </div>
                <div className="border-b pb-1">
                  <div className="font-semibold">Язык:</div>
                  <div>P: [{tonguePivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
                  <div>O: [{tongueObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
                </div>
              </>
            )}
            <div className="border-b pb-1">
              <div className="font-semibold">Датчик:</div>
              <div>P: [{sensorPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
              <div>O: [{sensorObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
            </div>
            <div>
              <div className="font-semibold">Свет:</div>
              <div>P: [{lightPivotPos.map(v => v.toFixed(2)).join(', ')}]</div>
              <div>O: [{lightObjPos.map(v => v.toFixed(2)).join(', ')}]</div>
            </div>
          </div>
        </div>

        {/* Выбор объекта */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-2 block">Выберите объект:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedObject('teeth_upper')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'teeth_upper'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Зубы верх
            </button>
            <button
              onClick={() => setSelectedObject('teeth_lower')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'teeth_lower'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Зубы низ
            </button>
            <button
              onClick={() => setSelectedObject('gums_upper')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'gums_upper'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Дёсны верх
            </button>
            <button
              onClick={() => setSelectedObject('gums_lower')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'gums_lower'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Дёсны низ
            </button>
            <button
              onClick={() => setSelectedObject('throat')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'throat'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Гортань
            </button>
            {/* Язык временно отключен - модель битая */}
            {/* <button
              onClick={() => setSelectedObject('tongue')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'tongue'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Язык
            </button> */}
            <button
              onClick={() => setSelectedObject('sensor')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'sensor'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Датчик
            </button>
            <button
              onClick={() => setSelectedObject('light')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold ${
                selectedObject === 'light'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Свет
            </button>
          </div>
        </div>

        {/* Настройки выбранного объекта */}
        {selectedObject && selectedObject !== 'light' && (
          <div>
            <h4 className="font-bold mb-3">
              {selectedObject === 'teeth_upper' && 'Верхние зубы'}
              {selectedObject === 'teeth_lower' && 'Нижние зубы'}
              {selectedObject === 'gums_upper' && 'Дёсны верхние'}
              {selectedObject === 'gums_lower' && 'Дёсны нижние'}
              {selectedObject === 'throat' && 'Гортань'}
              {selectedObject === 'tongue' && 'Язык'}
              {selectedObject === 'sensor' && 'Датчик'}
            </h4>

            {/* Pivot Position */}
            <div className="mb-3 p-2 bg-blue-50 rounded">
              <label className="text-xs font-bold mb-1 block">Pivot Position</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={
                      selectedObject === 'teeth_upper' ? teethUpperPivotPos[i] :
                      selectedObject === 'teeth_lower' ? teethLowerPivotPos[i] :
                      selectedObject === 'gums_upper' ? gumsUpperPivotPos[i] :
                      selectedObject === 'gums_lower' ? gumsLowerPivotPos[i] :
                      selectedObject === 'throat' ? throatPivotPos[i] :
                      selectedObject === 'tongue' ? tonguePivotPos[i] :
                      sensorPivotPos[i]
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (selectedObject === 'teeth_upper') {
                        const newPos = [...teethUpperPivotPos] as [number, number, number];
                        newPos[i] = val;
                        setTeethUpperPivotPos(newPos);
                      } else if (selectedObject === 'teeth_lower') {
                        const newPos = [...teethLowerPivotPos] as [number, number, number];
                        newPos[i] = val;
                        setTeethLowerPivotPos(newPos);
                      } else if (selectedObject === 'gums_upper') {
                        const newPos = [...gumsUpperPivotPos] as [number, number, number];
                        newPos[i] = val;
                        setGumsUpperPivotPos(newPos);
                      } else if (selectedObject === 'gums_lower') {
                        const newPos = [...gumsLowerPivotPos] as [number, number, number];
                        newPos[i] = val;
                        setGumsLowerPivotPos(newPos);
                      } else if (selectedObject === 'throat') {
                        const newPos = [...throatPivotPos] as [number, number, number];
                        newPos[i] = val;
                        setThroatPivotPos(newPos);
                      } else if (selectedObject === 'tongue') {
                        const newPos = [...tonguePivotPos] as [number, number, number];
                        newPos[i] = val;
                        setTonguePivotPos(newPos);
                      } else if (selectedObject === 'sensor') {
                        const newPos = [...sensorPivotPos] as [number, number, number];
                        newPos[i] = val;
                        setSensorPivotPos(newPos);
                      }
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            {/* Pivot Rotation */}
            <div className="mb-3 p-2 bg-blue-50 rounded">
              <label className="text-xs font-bold mb-1 block">Pivot Rotation</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={(
                      selectedObject === 'teeth_upper' ? teethUpperPivotRot[i] :
                      selectedObject === 'teeth_lower' ? teethLowerPivotRot[i] :
                      selectedObject === 'gums_upper' ? gumsUpperPivotRot[i] :
                      selectedObject === 'gums_lower' ? gumsLowerPivotRot[i] :
                      selectedObject === 'throat' ? throatPivotRot[i] :
                      selectedObject === 'tongue' ? tonguePivotRot[i] :
                      sensorPivotRot[i]
                    ).toFixed(2)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (selectedObject === 'teeth_upper') {
                        const newRot = [...teethUpperPivotRot] as [number, number, number];
                        newRot[i] = val;
                        setTeethUpperPivotRot(newRot);
                      } else if (selectedObject === 'teeth_lower') {
                        const newRot = [...teethLowerPivotRot] as [number, number, number];
                        newRot[i] = val;
                        setTeethLowerPivotRot(newRot);
                      } else if (selectedObject === 'gums_upper') {
                        const newRot = [...gumsUpperPivotRot] as [number, number, number];
                        newRot[i] = val;
                        setGumsUpperPivotRot(newRot);
                      } else if (selectedObject === 'gums_lower') {
                        const newRot = [...gumsLowerPivotRot] as [number, number, number];
                        newRot[i] = val;
                        setGumsLowerPivotRot(newRot);
                      } else if (selectedObject === 'throat') {
                        const newRot = [...throatPivotRot] as [number, number, number];
                        newRot[i] = val;
                        setThroatPivotRot(newRot);
                      } else if (selectedObject === 'tongue') {
                        const newRot = [...tonguePivotRot] as [number, number, number];
                        newRot[i] = val;
                        setTonguePivotRot(newRot);
                      } else if (selectedObject === 'sensor') {
                        const newRot = [...sensorPivotRot] as [number, number, number];
                        newRot[i] = val;
                        setSensorPivotRot(newRot);
                      }
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            {/* Object Position */}
            <div className="mb-3 p-2 bg-green-50 rounded">
              <label className="text-xs font-bold mb-1 block">Object Position</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={
                      selectedObject === 'teeth_upper' ? teethUpperObjPos[i] :
                      selectedObject === 'teeth_lower' ? teethLowerObjPos[i] :
                      selectedObject === 'gums_upper' ? gumsUpperObjPos[i] :
                      selectedObject === 'gums_lower' ? gumsLowerObjPos[i] :
                      selectedObject === 'throat' ? throatObjPos[i] :
                      selectedObject === 'tongue' ? tongueObjPos[i] :
                      sensorObjPos[i]
                    }
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (selectedObject === 'teeth_upper') {
                        const newPos = [...teethUpperObjPos] as [number, number, number];
                        newPos[i] = val;
                        setTeethUpperObjPos(newPos);
                      } else if (selectedObject === 'teeth_lower') {
                        const newPos = [...teethLowerObjPos] as [number, number, number];
                        newPos[i] = val;
                        setTeethLowerObjPos(newPos);
                      } else if (selectedObject === 'gums_upper') {
                        const newPos = [...gumsUpperObjPos] as [number, number, number];
                        newPos[i] = val;
                        setGumsUpperObjPos(newPos);
                      } else if (selectedObject === 'gums_lower') {
                        const newPos = [...gumsLowerObjPos] as [number, number, number];
                        newPos[i] = val;
                        setGumsLowerObjPos(newPos);
                      } else if (selectedObject === 'throat') {
                        const newPos = [...throatObjPos] as [number, number, number];
                        newPos[i] = val;
                        setThroatObjPos(newPos);
                      } else if (selectedObject === 'tongue') {
                        const newPos = [...tongueObjPos] as [number, number, number];
                        newPos[i] = val;
                        setTongueObjPos(newPos);
                      } else if (selectedObject === 'sensor') {
                        const newPos = [...sensorObjPos] as [number, number, number];
                        newPos[i] = val;
                        setSensorObjPos(newPos);
                      }
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            {/* Object Rotation */}
            <div className="mb-3 p-2 bg-green-50 rounded">
              <label className="text-xs font-bold mb-1 block">Object Rotation</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={(
                      selectedObject === 'teeth_upper' ? teethUpperObjRot[i] :
                      selectedObject === 'teeth_lower' ? teethLowerObjRot[i] :
                      selectedObject === 'gums_upper' ? gumsUpperObjRot[i] :
                      selectedObject === 'gums_lower' ? gumsLowerObjRot[i] :
                      selectedObject === 'throat' ? throatObjRot[i] :
                      selectedObject === 'tongue' ? tongueObjRot[i] :
                      sensorObjRot[i]
                    ).toFixed(2)}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      if (selectedObject === 'teeth_upper') {
                        const newRot = [...teethUpperObjRot] as [number, number, number];
                        newRot[i] = val;
                        setTeethUpperObjRot(newRot);
                      } else if (selectedObject === 'teeth_lower') {
                        const newRot = [...teethLowerObjRot] as [number, number, number];
                        newRot[i] = val;
                        setTeethLowerObjRot(newRot);
                      } else if (selectedObject === 'gums_upper') {
                        const newRot = [...gumsUpperObjRot] as [number, number, number];
                        newRot[i] = val;
                        setGumsUpperObjRot(newRot);
                      } else if (selectedObject === 'gums_lower') {
                        const newRot = [...gumsLowerObjRot] as [number, number, number];
                        newRot[i] = val;
                        setGumsLowerObjRot(newRot);
                      } else if (selectedObject === 'throat') {
                        const newRot = [...throatObjRot] as [number, number, number];
                        newRot[i] = val;
                        setThroatObjRot(newRot);
                      } else if (selectedObject === 'tongue') {
                        const newRot = [...tongueObjRot] as [number, number, number];
                        newRot[i] = val;
                        setTongueObjRot(newRot);
                      } else if (selectedObject === 'sensor') {
                        const newRot = [...sensorObjRot] as [number, number, number];
                        newRot[i] = val;
                        setSensorObjRot(newRot);
                      }
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Pivot - оси вращения объекта. Object - сам объект.
            </p>
          </div>
        )}

        {/* Настройки света */}
        {selectedObject === 'light' && (
          <div>
            <h4 className="font-bold mb-3">Свет</h4>

            {/* Pivot Position */}
            <div className="mb-3 p-2 bg-blue-50 rounded">
              <label className="text-xs font-bold mb-1 block">Pivot Position</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={lightPivotPos[i]}
                    onChange={(e) => {
                      const newPos = [...lightPivotPos] as [number, number, number];
                      newPos[i] = parseFloat(e.target.value) || 0;
                      setLightPivotPos(newPos);
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            {/* Pivot Rotation */}
            <div className="mb-3 p-2 bg-blue-50 rounded">
              <label className="text-xs font-bold mb-1 block">Pivot Rotation</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={lightPivotRot[i].toFixed(2)}
                    onChange={(e) => {
                      const newRot = [...lightPivotRot] as [number, number, number];
                      newRot[i] = parseFloat(e.target.value) || 0;
                      setLightPivotRot(newRot);
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            {/* Object Position */}
            <div className="mb-3 p-2 bg-green-50 rounded">
              <label className="text-xs font-bold mb-1 block">Object Position</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={lightObjPos[i]}
                    onChange={(e) => {
                      const newPos = [...lightObjPos] as [number, number, number];
                      newPos[i] = parseFloat(e.target.value) || 0;
                      setLightObjPos(newPos);
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            {/* Object Rotation */}
            <div className="mb-3 p-2 bg-green-50 rounded">
              <label className="text-xs font-bold mb-1 block">Object Rotation</label>
              <div className="grid grid-cols-3 gap-1">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <input
                    key={axis}
                    type="number"
                    step="0.1"
                    value={lightObjRot[i].toFixed(2)}
                    onChange={(e) => {
                      const newRot = [...lightObjRot] as [number, number, number];
                      newRot[i] = parseFloat(e.target.value) || 0;
                      setLightObjRot(newRot);
                    }}
                    className="w-full px-1 py-1 border rounded text-xs"
                    placeholder={axis}
                  />
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Интенсивность: {xrayLightIntensity}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={xrayLightIntensity}
                onChange={(e) => setXrayLightIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Угол: {xrayLightAngle}°
              </label>
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={xrayLightAngle}
                onChange={(e) => setXrayLightAngle(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Дистанция: {lightDistance.toFixed(1)}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={lightDistance}
                onChange={(e) => setLightDistance(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Penumbra (мягкость): {lightPenumbra.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={lightPenumbra}
                onChange={(e) => setLightPenumbra(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Decay (затухание): {lightDecay.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={lightDecay}
                onChange={(e) => setLightDecay(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Бисектрисная методика */}
            <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useBisectrixTechnique}
                  onChange={(e) => setUseBisectrixTechnique(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold">Бисектрисная методика</span>
              </label>

              {useBisectrixTechnique && (
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Угол наклона: {bisectrixAngle.toFixed(2)} рад ({(bisectrixAngle * 180 / Math.PI).toFixed(1)}°)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={bisectrixAngle}
                    onChange={(e) => setBisectrixAngle(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedObject && (
          <div className="text-center text-gray-500 py-8">
            <p>Выберите объект для редактирования</p>
          </div>
        )}
      </div>
    </div>
  );
}
