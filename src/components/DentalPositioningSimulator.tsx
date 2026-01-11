import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Box, Sphere, Cone, Cylinder } from '@react-three/drei';
import { useState } from 'react';

// Компонент головы пациента с челюстью
function PatientHead() {
  return (
    <group position={[0, 0, 0]}>
      {/* Голова */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>

      {/* Верхняя челюсть */}
      <Box args={[0.8, 0.2, 0.6]} position={[0, -0.3, 0.4]}>
        <meshStandardMaterial color="#f0e6d2" />
      </Box>

      {/* Нижняя челюсть */}
      <Box args={[0.7, 0.2, 0.5]} position={[0, -0.6, 0.35]}>
        <meshStandardMaterial color="#f0e6d2" />
      </Box>

      {/* Упрощенные зубы (верхний ряд) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={`upper-${i}`}
          args={[0.08, 0.15, 0.08]}
          position={[-0.28 + i * 0.08, -0.2, 0.5]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Box>
      ))}

      {/* Упрощенные зубы (нижний ряд) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Box
          key={`lower-${i}`}
          args={[0.08, 0.15, 0.08]}
          position={[-0.24 + i * 0.08, -0.5, 0.45]}
        >
          <meshStandardMaterial color="#ffffff" />
        </Box>
      ))}
    </group>
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
  const [showGuide, setShowGuide] = useState(true);

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
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, 2]} intensity={0.5} />

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
        <PatientHead />
        <XRayMachine />
        <FilmSensor />

        {/* Оси координат для ориентации */}
        <axesHelper args={[2]} />
      </Canvas>

      {/* UI панель управления */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-xs">
        <h3 className="font-bold text-gray-900 mb-2">🦷 Симулятор позиционирования</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Управление:</strong></p>
          <ul className="text-xs space-y-1 ml-2">
            <li>• ЛКМ + движение - вращение</li>
            <li>• ПКМ + движение - перемещение</li>
            <li>• Колесо мыши - приближение</li>
          </ul>
        </div>

        <button
          onClick={() => setShowGuide(!showGuide)}
          className="mt-3 w-full px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition-colors"
        >
          {showGuide ? 'Скрыть подсказки' : 'Показать подсказки'}
        </button>
      </div>

      {/* Информационная панель */}
      {showGuide && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-sm">
          <h4 className="font-bold text-gray-900 mb-2 text-sm">Элементы сцены:</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>🟤 <strong>Голова пациента</strong> - положение лица с зубами</li>
            <li>⚫ <strong>Рентген-аппарат</strong> - источник излучения с тубусом</li>
            <li>🟦 <strong>Сенсор/пленка</strong> - приемник изображения</li>
            <li>🟢 <strong>Луч</strong> - направление рентгеновского излучения</li>
          </ul>
        </div>
      )}
    </div>
  );
}
