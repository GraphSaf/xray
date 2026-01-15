import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Box, Cone, Cylinder, useGLTF } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import * as React from 'react';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';

// URL модели зубов в S3 хранилище Beget
const TEETH_MODEL_URL = 'https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub/teeth.glb';

// Компонент 3D модели зубов из GLB файла
function TeethModel({ rotation }: { rotation: number }) {
  const { scene } = useGLTF(TEETH_MODEL_URL);
  const clonedScene = scene.clone(true);

  console.log('[TeethModel] Model loaded successfully from S3');
  console.log('[TeethModel] Scene:', clonedScene);

  return (
    <primitive
      object={clonedScene}
      position={[0, 0, 0]}
      rotation={[0, rotation, 0]}
      scale={1}
    />
  );
}

// Компонент загрузки (желтый куб)
function LoadingCube() {
  return (
    <Box args={[1, 1, 1]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
    </Box>
  );
}

// Компонент рентген-аппарата
function XRayMachine({
  position = [2, 0, 0] as [number, number, number],
  rotation = [0, -Math.PI / 2, 0] as [number, number, number]
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Корпус аппарата */}
      <Box args={[0.4, 0.4, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Тубус (коллиматор) */}
      <Cylinder args={[0.15, 0.12, 1, 16]} position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.3} />
      </Cylinder>

      {/* Конус тубуса */}
      <Cone args={[0.12, 0.15, 16]} position={[0, 0, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#718096" metalness={0.5} roughness={0.4} />
      </Cone>

      {/* Индикатор луча */}
      <Cone args={[0.08, 0.3, 16]} position={[0, 0, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#48bb78" emissive="#48bb78" emissiveIntensity={0.5} transparent opacity={0.6} />
      </Cone>
    </group>
  );
}

// Компонент пленки/сенсора
function FilmSensor({
  position = [0, 0, 0.5] as [number, number, number],
  rotation = 0
}: {
  position?: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Держатель */}
      <Box args={[0.5, 0.6, 0.02]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3182ce" metalness={0.3} roughness={0.5} />
      </Box>

      {/* Сенсор */}
      <Box args={[0.35, 0.45, 0.01]} position={[0, 0, 0.015]}>
        <meshStandardMaterial color="#90cdf4" metalness={0.1} roughness={0.8} />
      </Box>
    </group>
  );
}

// Основной компонент симулятора
export function DentalPositioningSimulator() {
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'dark'>('white');
  const [teethRotation, setTeethRotation] = useState(0);
  const [sensorRotation, setSensorRotation] = useState(0);
  const controlsRef = useRef<OrbitControlsType>(null);

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
        <ambientLight intensity={1.2} />
        <directionalLight
          position={[3, 4, 3]}
          intensity={2.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-3, 4, -3]}
          intensity={2}
        />
        <pointLight position={[-2, 3, 2]} intensity={1.5} />
        <pointLight position={[2, 2, 3]} intensity={1.2} color="#ffffff" />
        <spotLight
          position={[0, 5, 0]}
          angle={0.8}
          penumbra={0.3}
          intensity={2}
          castShadow
        />

        {/* Объекты сцены */}
        <Suspense fallback={<LoadingCube />}>
          <TeethModel rotation={teethRotation} />
        </Suspense>
        <XRayMachine position={[2.5, 0, 0]} />
        <FilmSensor position={[0, 0, 0.5]} rotation={sensorRotation} />
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
      </div>
    </div>
  );
}
