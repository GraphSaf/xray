import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Box, Cone, Cylinder, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

// URL модели зубов в S3 хранилище Beget
const TEETH_MODEL_URL = 'https://s3.ru1.storage.beget.cloud/0f31e7f56d88-xrayhub/teeth.glb';

// Компонент 3D модели зубов из GLB файла
function TeethModel() {
  const { scene } = useGLTF(TEETH_MODEL_URL);
  const clonedScene = scene.clone(true);

  console.log('[TeethModel] Model loaded successfully from S3');
  console.log('[TeethModel] Scene:', clonedScene);

  return (
    <primitive
      object={clonedScene}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
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
  position = [0, 0, 0.8] as [number, number, number]
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
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
  return (
    <div className="w-full h-full relative bg-gray-900 rounded-lg overflow-hidden">
      {/* 3D Canvas */}
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />

        {/* Освещение */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={1}
        />
        <pointLight position={[-5, 5, 2]} intensity={0.8} />
        <pointLight position={[5, -2, 5]} intensity={0.6} color="#ffffff" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.6}
          penumbra={0.5}
          intensity={1.2}
          castShadow
        />

        {/* Сетка пола */}
        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#4b5563"
          fadeDistance={20}
          fadeStrength={1}
          position={[0, -2, 0]}
        />

        {/* Объекты сцены */}
        <Suspense fallback={<LoadingCube />}>
          <TeethModel />
        </Suspense>
        <XRayMachine position={[2.5, 0, 0]} />
        <FilmSensor position={[0, -0.2, 1.3]} />

        {/* Оси координат для ориентации */}
        <axesHelper args={[2]} />
      </Canvas>
    </div>
  );
}
