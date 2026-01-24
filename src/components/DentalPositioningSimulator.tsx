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
  xraySensor: `${S3_BASE_URL}/xray_sensor.glb`,
  xrayTubus: `${S3_BASE_URL}/xray_tubus.glb`,
  placeholder: '/models/placeholder.glb', // Локально
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

// Компонент для отображения информации об объекте
function ObjectInfo({
  name,
  position,
  rotation
}: {
  name: string;
  position: [number, number, number];
  rotation: number;
}) {
  return (
    <Html position={[position[0], position[1] + 1, position[2]]} center>
      <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap pointer-events-none">
        <div className="font-bold mb-1">{name}</div>
        <div>pos: [{position[0].toFixed(2)}, {position[1].toFixed(2)}, {position[2].toFixed(2)}]</div>
        <div>rot: {(rotation * 180 / Math.PI).toFixed(1)}°</div>
      </div>
    </Html>
  );
}

// Компонент верхних зубов
function TeethUpperModel({
  position,
  rotation,
  showAxes
}: {
  position: [number, number, number];
  rotation: number;
  showAxes: boolean;
}) {
  const { scene } = useGLTF(MODEL_URLS.teethUpper);
  const clonedScene = scene.clone(true);

  // Включаем отбрасывание теней для всех мешей
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group>
      <primitive
        object={clonedScene}
        position={position}
        rotation={[0, rotation, 0]}
      />
      {showAxes && <AxesHelper size={0.5} position={position} />}
      {showAxes && <ObjectInfo name="Teeth Upper" position={position} rotation={rotation} />}
    </group>
  );
}

// Компонент нижних зубов
function TeethLowerModel({
  position,
  rotation,
  showAxes
}: {
  position: [number, number, number];
  rotation: number;
  showAxes: boolean;
}) {
  const { scene } = useGLTF(MODEL_URLS.teethLower);
  const clonedScene = scene.clone(true);

  // Включаем отбрасывание теней для всех мешей
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group>
      <primitive
        object={clonedScene}
        position={position}
        rotation={[0, rotation, 0]}
      />
      {showAxes && <AxesHelper size={0.5} position={position} />}
      {showAxes && <ObjectInfo name="Teeth Lower" position={position} rotation={rotation} />}
    </group>
  );
}

// Компонент датчика
function XRaySensorModel({
  position,
  rotation,
  showAxes
}: {
  position: [number, number, number];
  rotation: number;
  showAxes: boolean;
}) {
  const { scene } = useGLTF(MODEL_URLS.xraySensor);
  const clonedScene = scene.clone(true);

  // Датчик должен принимать тени
  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.receiveShadow = true;
        child.castShadow = false; // датчик не отбрасывает тени
      }
    });
  }, [clonedScene]);

  return (
    <group>
      <primitive
        object={clonedScene}
        position={position}
        rotation={[0, rotation, 0]}
      />
      {showAxes && <AxesHelper size={0.3} position={position} />}
      {showAxes && <ObjectInfo name="XRay Sensor" position={position} rotation={rotation} />}
    </group>
  );
}

// Компонент тубуса
function XRayTubusModel({
  position,
  showAxes
}: {
  position: [number, number, number];
  showAxes: boolean;
}) {
  const { scene } = useGLTF(MODEL_URLS.xrayTubus);

  return (
    <group>
      <primitive
        object={scene.clone(true)}
        position={position}
      />
      {showAxes && <AxesHelper size={0.5} position={position} />}
      {showAxes && <ObjectInfo name="XRay Tubus" position={position} rotation={0} />}
    </group>
  );
}

// Основной компонент симулятора
export function DentalPositioningSimulator() {
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'dark'>('white');
  const [teethRotation, setTeethRotation] = useState(0);
  const [sensorRotation, setSensorRotation] = useState(0);
  const [showAxes, setShowAxes] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Позиции объектов (редактируемые)
  const [teethPos, setTeethPos] = useState<[number, number, number]>([0, 0, 0]);
  const [sensorPos, setSensorPos] = useState<[number, number, number]>([0, 0, 0.5]);
  const [tubusPos, setTubusPos] = useState<[number, number, number]>([2.5, 0, 0]);

  // Настройки рентген-света
  const [xrayLightIntensity, setXrayLightIntensity] = useState(100);
  const [xrayLightAngle, setXrayLightAngle] = useState(15); // градусы

  const controlsRef = useRef<OrbitControlsType>(null);
  const xrayLightRef = useRef<THREE.SpotLight>(null);

  // Обновляем направление SpotLight на сенсор
  React.useEffect(() => {
    if (xrayLightRef.current) {
      xrayLightRef.current.target.position.set(...sensorPos);
      xrayLightRef.current.target.updateMatrixWorld();
    }
  }, [sensorPos, tubusPos]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const rotateLeft = () => {
    setTeethRotation(prev => prev - (15 * Math.PI / 180)); // -15 градусов для зубов
    setSensorRotation(prev => prev + (15 * Math.PI / 180)); // +15 градусов для датчика
  };

  const rotateRight = () => {
    setTeethRotation(prev => prev + (15 * Math.PI / 180)); // +15 градусов для зубов
    setSensorRotation(prev => prev - (15 * Math.PI / 180)); // -15 градусов для датчика
  };

  // Обработчик клавиатуры
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        rotateLeft();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        rotateRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const bgColor = backgroundColor === 'white' ? '#ffffff' : '#374151';
  const containerBg = backgroundColor === 'white' ? 'bg-white' : 'bg-gray-700';

  return (
    <div className={`w-full h-full relative ${containerBg} rounded-lg overflow-hidden border-2 border-gray-200`}>
      {/* 3D Canvas */}
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

        {/* РЕНТГЕН-СВЕТ: Узконаправленный из тубуса на сенсор */}
        <spotLight
          ref={xrayLightRef}
          position={tubusPos}
          angle={xrayLightAngle * Math.PI / 180}
          penumbra={0.05}
          intensity={xrayLightIntensity}
          color="#E5FFE5"
          distance={10}
          decay={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />

        {/* Объекты сцены */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <TeethUpperModel position={teethPos} rotation={teethRotation} showAxes={showAxes} />
          <TeethLowerModel position={teethPos} rotation={teethRotation} showAxes={showAxes} />
          <XRaySensorModel position={sensorPos} rotation={sensorRotation} showAxes={showAxes} />
          <XRayTubusModel position={tubusPos} showAxes={showAxes} />
        </Suspense>
      </Canvas>

      {/* Панель управления */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Кнопка сброса камеры */}
        <button
          onClick={resetCamera}
          className="px-4 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
          title="Вернуться в исходную позицию"
        >
          ↑ Сброс
        </button>

        {/* Кнопки смены фона */}
        <div className="flex gap-2">
          <button
            onClick={() => setBackgroundColor('white')}
            className={`px-3 py-2 font-semibold rounded-xl transition-colors shadow-lg ${
              backgroundColor === 'white'
                ? 'bg-white text-black border-2 border-black'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Белый фон"
          >
            ⚪
          </button>
          <button
            onClick={() => setBackgroundColor('dark')}
            className={`px-3 py-2 font-semibold rounded-xl transition-colors shadow-lg ${
              backgroundColor === 'dark'
                ? 'bg-gray-700 text-white border-2 border-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Темный фон"
          >
            ⚫
          </button>
        </div>

        {/* Кнопки вращения */}
        <div className="flex gap-2">
          <button
            onClick={rotateLeft}
            className="px-3 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            title="Повернуть влево (← стрелка)"
          >
            ←
          </button>
          <button
            onClick={rotateRight}
            className="px-3 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
            title="Повернуть вправо (→ стрелка)"
          >
            →
          </button>
        </div>

        {/* Кнопка показа осей */}
        <button
          onClick={() => setShowAxes(!showAxes)}
          className={`px-3 py-2 font-semibold rounded-xl transition-colors shadow-lg ${
            showAxes
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title="Показать/скрыть оси"
        >
          📐 Оси
        </button>

        {/* Кнопка настроек */}
        <button
          onClick={() => setShowControls(!showControls)}
          className={`px-3 py-2 font-semibold rounded-xl transition-colors shadow-lg ${
            showControls
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          title="Открыть настройки позиций"
        >
          ⚙️
        </button>
      </div>

      {/* Панель настроек позиций */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl max-h-[60vh] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Настройки позиционирования</h3>

          {/* Зубы */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h4 className="font-semibold mb-2">🦷 Зубы (Upper + Lower)</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <label className="text-sm">
                X:
                <input
                  type="number"
                  step="0.1"
                  value={teethPos[0]}
                  onChange={(e) => setTeethPos([parseFloat(e.target.value), teethPos[1], teethPos[2]])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Y:
                <input
                  type="number"
                  step="0.1"
                  value={teethPos[1]}
                  onChange={(e) => setTeethPos([teethPos[0], parseFloat(e.target.value), teethPos[2]])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Z:
                <input
                  type="number"
                  step="0.1"
                  value={teethPos[2]}
                  onChange={(e) => setTeethPos([teethPos[0], teethPos[1], parseFloat(e.target.value)])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
            </div>
            <label className="text-sm">
              Rotation (°):
              <input
                type="number"
                step="15"
                value={(teethRotation * 180 / Math.PI).toFixed(0)}
                onChange={(e) => setTeethRotation(parseFloat(e.target.value) * Math.PI / 180)}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </label>
          </div>

          {/* Сенсор */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h4 className="font-semibold mb-2">📡 Датчик (Sensor)</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <label className="text-sm">
                X:
                <input
                  type="number"
                  step="0.1"
                  value={sensorPos[0]}
                  onChange={(e) => setSensorPos([parseFloat(e.target.value), sensorPos[1], sensorPos[2]])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Y:
                <input
                  type="number"
                  step="0.1"
                  value={sensorPos[1]}
                  onChange={(e) => setSensorPos([sensorPos[0], parseFloat(e.target.value), sensorPos[2]])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Z:
                <input
                  type="number"
                  step="0.1"
                  value={sensorPos[2]}
                  onChange={(e) => setSensorPos([sensorPos[0], sensorPos[1], parseFloat(e.target.value)])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
            </div>
            <label className="text-sm">
              Rotation (°):
              <input
                type="number"
                step="15"
                value={(sensorRotation * 180 / Math.PI).toFixed(0)}
                onChange={(e) => setSensorRotation(parseFloat(e.target.value) * Math.PI / 180)}
                className="w-full px-2 py-1 border rounded text-xs"
              />
            </label>
          </div>

          {/* Тубус */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h4 className="font-semibold mb-2">📸 Тубус (Tubus)</h4>
            <div className="grid grid-cols-3 gap-2">
              <label className="text-sm">
                X:
                <input
                  type="number"
                  step="0.1"
                  value={tubusPos[0]}
                  onChange={(e) => setTubusPos([parseFloat(e.target.value), tubusPos[1], tubusPos[2]])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Y:
                <input
                  type="number"
                  step="0.1"
                  value={tubusPos[1]}
                  onChange={(e) => setTubusPos([tubusPos[0], parseFloat(e.target.value), tubusPos[2]])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Z:
                <input
                  type="number"
                  step="0.1"
                  value={tubusPos[2]}
                  onChange={(e) => setTubusPos([tubusPos[0], tubusPos[1], parseFloat(e.target.value)])}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
            </div>
          </div>

          {/* Рентген-свет */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">💡 Рентген-свет (X-Ray Light)</h4>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-sm">
                Интенсивность:
                <input
                  type="number"
                  step="10"
                  value={xrayLightIntensity}
                  onChange={(e) => setXrayLightIntensity(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
              <label className="text-sm">
                Угол (°):
                <input
                  type="number"
                  step="1"
                  value={xrayLightAngle}
                  onChange={(e) => setXrayLightAngle(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border rounded text-xs"
                />
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Свет идет из позиции тубуса → на сенсор
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
