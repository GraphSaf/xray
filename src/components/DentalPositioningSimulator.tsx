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
  gumsUpper: `${S3_BASE_URL}/ms_upper.glb`,
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
  const { scene } = useGLTF(modelUrl);
  const clonedScene = scene.clone(true);

  // Настройка теней и прозрачности
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Добавляем прозрачность если нужно
        if (opacity < 1 && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
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
}


// Компонент визуализации света (без тубуса)
function LightVisualization({
  lightAngle,
  showAxes
}: {
  lightAngle: number;
  showAxes: boolean;
}) {
  // Вектор направления света (стрелка)
  const arrowLength = 2;

  // Контур конуса освещения
  const coneDistance = 2.5;
  const coneRadius = Math.tan(lightAngle * Math.PI / 180) * coneDistance;

  return (
    <group>
      {/* Вектор направления (стрелка вдоль -Z) */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, 0, -1), // направление вдоль -Z (вниз)
          new THREE.Vector3(0, 0, 0), // начало в (0,0,0)
          arrowLength, // длина стрелки
          0xff0000, // красный цвет для видимости
          0.2, // длина головки
          0.15 // ширина головки
        ]}
      />

      {/* Контур конуса освещения (wireframe) */}
      <mesh position={[0, 0, -coneDistance / 2]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[coneRadius, coneDistance, 16, 1, true]} />
        <meshBasicMaterial color="#00ff00" wireframe side={THREE.DoubleSide} />
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
  const [teethLowerPivotPos, setTeethLowerPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [teethLowerPivotRot, setTeethLowerPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [teethLowerObjPos, setTeethLowerObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [teethLowerObjRot, setTeethLowerObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Верхние мягкие ткани
  const [gumsUpperPivotPos, setGumsUpperPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsUpperPivotRot, setGumsUpperPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsUpperObjPos, setGumsUpperObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsUpperObjRot, setGumsUpperObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Нижние мягкие ткани
  const [gumsLowerPivotPos, setGumsLowerPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsLowerPivotRot, setGumsLowerPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsLowerObjPos, setGumsLowerObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [gumsLowerObjRot, setGumsLowerObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Гортань
  const [throatPivotPos, setThroatPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [throatPivotRot, setThroatPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [throatObjPos, setThroatObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [throatObjRot, setThroatObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Язык
  const [tonguePivotPos, setTonguePivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [tonguePivotRot, setTonguePivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [tongueObjPos, setTongueObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [tongueObjRot, setTongueObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Датчик
  const [sensorPivotPos, setSensorPivotPos] = useState<[number, number, number]>([0, 0, 0]);
  const [sensorPivotRot, setSensorPivotRot] = useState<[number, number, number]>([0, 0, 0]);
  const [sensorObjPos, setSensorObjPos] = useState<[number, number, number]>([0, 0, 0]);
  const [sensorObjRot, setSensorObjRot] = useState<[number, number, number]>([0, 0, 0]);

  // Свет
  const [lightPos, setLightPos] = useState<[number, number, number]>([0, 0, 0]);
  const [lightRot, setLightRot] = useState<[number, number, number]>([0, 0, 0]);
  const [xrayLightIntensity, setXrayLightIntensity] = useState(220);
  const [xrayLightAngle, setXrayLightAngle] = useState(9);

  // Прозрачность челюстей
  const [teethOpacity, setTeethOpacity] = useState(0.5);

  const controlsRef = useRef<OrbitControlsType>(null);
  const xrayLightRef = useRef<THREE.SpotLight>(null);

  // Обновляем направление SpotLight на сенсор
  React.useEffect(() => {
    if (xrayLightRef.current) {
      // Свет направлен на позицию pivot сенсора
      xrayLightRef.current.target.position.set(...sensorPivotPos);
      xrayLightRef.current.target.updateMatrixWorld();
    }
  }, [lightPos, lightRot, sensorPivotPos]);

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
      <div className={`flex-1 relative ${containerBg} rounded-lg overflow-hidden border-2 border-gray-200`}>
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

          {/* РЕНТГЕН-СВЕТ */}
          <group position={lightPos} rotation={lightRot}>
            <spotLight
              ref={xrayLightRef}
              angle={xrayLightAngle * Math.PI / 180}
              penumbra={0.05}
              intensity={xrayLightIntensity}
              color="#E5FFE5"
              distance={10}
              decay={2}
              castShadow
              shadow-mapSize={[4096, 4096]}
              shadow-bias={-0.00001}
              shadow-camera-near={0.1}
              shadow-camera-far={10}
            />
            {/* Визуализация света */}
            <LightVisualization lightAngle={xrayLightAngle} showAxes={showAxes} />
          </group>

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

            {/* Язык */}
            <UniversalModel
              modelUrl={MODEL_URLS.tongue}
              pivotPosition={tonguePivotPos}
              pivotRotation={tonguePivotRot}
              objectPosition={tongueObjPos}
              objectRotation={tongueObjRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'tongue'}
              onClick={() => setSelectedObject('tongue')}
              label="Язык"
            />

            {/* Датчик */}
            <UniversalModel
              modelUrl={MODEL_URLS.xraySensor}
              pivotPosition={sensorPivotPos}
              pivotRotation={sensorPivotRot}
              objectPosition={sensorObjPos}
              objectRotation={sensorObjRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'sensor'}
              onClick={() => setSelectedObject('sensor')}
              label="Датчик"
            />
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

        {/* Галочка для связки всех элементов */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={linkAllToSensor}
              onChange={(e) => setLinkAllToSensor(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold">Связать всё с датчиком</span>
          </label>
          <p className="text-xs text-gray-600 mt-1">
            При включении тубус и свет двигаются вместе с датчиком
          </p>
        </div>

        {/* Выбор объекта */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-2 block">Выберите объект:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedObject('teeth_lower')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold ${
                selectedObject === 'teeth_lower'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Нижние зубы
            </button>
            <button
              onClick={() => setSelectedObject('sensor')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold ${
                selectedObject === 'sensor'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Датчик
            </button>
          </div>
          <button
            onClick={() => setSelectedObject('light')}
            className={`w-full py-2 px-3 rounded-xl text-sm font-semibold mt-2 ${
              selectedObject === 'light'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Свет + Тубус
          </button>
        </div>

        {/* Настройки выбранного объекта */}
        {selectedObject === 'teeth_lower' && (
          <div>
            <h4 className="font-bold mb-3">Нижние зубы</h4>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Rotation X (радианы)
                <input
                  type="number"
                  step="0.1"
                  value={teethLowerRotX.toFixed(2)}
                  onChange={(e) => setTeethLowerRotX(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded mt-1"
                />
              </label>
            </div>

            <p className="text-xs text-gray-600">
              Центр ротации смещен к задним зубам (-1.2 по Z)
            </p>
          </div>
        )}

        {selectedObject === 'sensor' && (
          <div>
            <h4 className="font-bold mb-3">Датчик</h4>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={sensorPos[i]}
                      onChange={(e) => {
                        const newPos = [...sensorPos] as [number, number, number];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        setSensorPos(newPos);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">Rotation (радианы)</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={sensorRot[i].toFixed(2)}
                      onChange={(e) => {
                        const newRot = [...sensorRot] as [number, number, number];
                        newRot[i] = parseFloat(e.target.value) || 0;
                        setSensorRot(newRot);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Центр вращения внутри датчика
            </p>
          </div>
        )}

        {selectedObject === 'light' && (
          <div>
            <h4 className="font-bold mb-3">Свет + Тубус</h4>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={lightPos[i]}
                      onChange={(e) => {
                        const newPos = [...lightPos] as [number, number, number];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        setLightPos(newPos);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Rotation X (радианы)
                <input
                  type="number"
                  step="0.1"
                  value={lightRotX.toFixed(2)}
                  onChange={(e) => setLightRotX(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded mt-1"
                />
              </label>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Расстояние до датчика
                <input
                  type="number"
                  step="0.1"
                  value={lightSensorDistance}
                  onChange={(e) => setLightSensorDistance(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded mt-1"
                />
              </label>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Интенсивность
                <input
                  type="number"
                  step="10"
                  value={xrayLightIntensity}
                  onChange={(e) => setXrayLightIntensity(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded mt-1"
                />
              </label>
            </div>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">
                Угол (градусы)
                <input
                  type="number"
                  step="1"
                  value={xrayLightAngle}
                  onChange={(e) => setXrayLightAngle(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 border rounded mt-1"
                />
              </label>
            </div>

            <p className="text-xs text-gray-600">
              Тубус и свет связаны вместе. Свет автоматически направлен на датчик.
            </p>
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
