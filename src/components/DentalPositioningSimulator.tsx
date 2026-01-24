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


// Компонент верхних зубов
function TeethUpperModel({
  position,
  rotation,
  showAxes,
  isSelected,
  onClick
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  showAxes: boolean;
  isSelected: boolean;
  onClick: () => void;
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
    <group onClick={onClick}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
      />
      {showAxes && <AxesHelper size={0.5} position={position} />}
      {isSelected && (
        <Html position={[position[0], position[1] + 1.5, position[2]]} center>
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            ВЫБРАНО
          </div>
        </Html>
      )}
    </group>
  );
}

// Компонент нижних зубов (с кастомным центром ротации)
function TeethLowerModel({
  position,
  rotationX,
  pivot,
  showAxes,
  isSelected,
  onClick
}: {
  position: [number, number, number];
  rotationX: number;
  pivot: [number, number, number];
  showAxes: boolean;
  isSelected: boolean;
  onClick: () => void;
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
    <group onClick={onClick} position={position}>
      {/* Pivot point для смещения центра ротации */}
      <group position={pivot}>
        <group rotation={[rotationX, 0, 0]}>
          <group position={[-pivot[0], -pivot[1], -pivot[2]]}>
            <primitive object={clonedScene} />
          </group>
        </group>
      </group>
      {showAxes && <AxesHelper size={0.5} position={[0, 0, 0]} />}
      {isSelected && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            ВЫБРАНО
          </div>
        </Html>
      )}
    </group>
  );
}

// Компонент датчика (полное управление, центр внутри датчика)
function XRaySensorModel({
  position,
  rotation,
  showAxes,
  isSelected,
  onClick
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  showAxes: boolean;
  isSelected: boolean;
  onClick: () => void;
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
    <group onClick={onClick} position={position} rotation={rotation}>
      <primitive object={clonedScene} />
      {showAxes && <AxesHelper size={0.3} position={[0, 0, 0]} />}
      {isSelected && (
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            ВЫБРАНО
          </div>
        </Html>
      )}
    </group>
  );
}

// Компонент процедурного тубуса вокруг света
function ProceduralTubus({
  lightAngle,
  showAxes
}: {
  lightAngle: number;
  showAxes: boolean;
}) {
  // Размеры тубуса
  const outerRadius = 0.15;
  const innerRadius = 0.12;
  const length = 0.8;

  // Вектор направления (стрелка вниз по -Z)
  const arrowLength = 1.5;

  // Контур конуса освещения
  const coneDistance = 2;
  const coneRadius = Math.tan(lightAngle * Math.PI / 180) * coneDistance;

  return (
    <group>
      {/* Внешний цилиндр */}
      <mesh position={[0, 0, -length / 2]}>
        <cylinderGeometry args={[outerRadius, outerRadius, length, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Внутренний цилиндр (вырез) */}
      <mesh position={[0, 0, -length / 2]}>
        <cylinderGeometry args={[innerRadius, innerRadius, length + 0.01, 16]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.5} />
      </mesh>

      {/* Вектор направления (стрелка) */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, 0, -1), // направление
          new THREE.Vector3(0, 0, 0), // начало
          arrowLength, // длина
          0x888888, // цвет
          0.2, // длина головки
          0.1 // ширина головки
        ]}
      />

      {/* Контур конуса освещения (wireframe) */}
      <mesh position={[0, 0, -coneDistance]}>
        <coneGeometry args={[coneRadius, coneDistance, 16]} />
        <meshBasicMaterial color="#888888" wireframe opacity={0.3} transparent />
      </mesh>

      {showAxes && <AxesHelper size={0.3} position={[0, 0, 0]} />}
    </group>
  );
}

type SelectedObject = 'teeth_upper' | 'teeth_lower' | 'sensor' | 'tubus' | 'light' | null;

// Основной компонент симулятора
export function DentalPositioningSimulator() {
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'dark'>('white');
  const [showAxes, setShowAxes] = useState(true);
  const [selectedObject, setSelectedObject] = useState<SelectedObject>(null);

  // Позиции объектов (редактируемые) - значения по умолчанию из настроек пользователя
  // Верхние зубы - ФИКСИРОВАННЫЕ (не редактируются)
  const teethUpperPos: [number, number, number] = [0, 0.9, 0];
  const teethUpperRot: [number, number, number] = [-0.30, 0, 0];

  // Нижние зубы - только ротация по X, центр ротации смещен к задним зубам
  const [teethLowerRotX, setTeethLowerRotX] = useState(0);
  const teethLowerPos: [number, number, number] = [0, 0, 0];
  const teethLowerPivot: [number, number, number] = [0, 0, -1.2]; // Смещение центра ротации

  // Сенсор - полное управление по всем осям
  const [sensorPos, setSensorPos] = useState<[number, number, number]>([0, 1.4, 0.1]);
  const [sensorRot, setSensorRot] = useState<[number, number, number]>([0, 0, 0]);

  // Расстояние между светом и датчиком
  const [lightSensorDistance, setLightSensorDistance] = useState(1.3);

  // Настройки рентген-света (связан с тубусом)
  const [lightPos, setLightPos] = useState<[number, number, number]>([0, -61, 6.8]);
  const [lightRotX, setLightRotX] = useState(-8.50);
  const [xrayLightIntensity, setXrayLightIntensity] = useState(220);
  const [xrayLightAngle, setXrayLightAngle] = useState(9);

  // Галочка для связки всех элементов
  const [linkAllToSensor, setLinkAllToSensor] = useState(false);

  const controlsRef = useRef<OrbitControlsType>(null);
  const xrayLightRef = useRef<THREE.SpotLight>(null);

  // Обновляем направление SpotLight на сенсор
  React.useEffect(() => {
    if (xrayLightRef.current) {
      xrayLightRef.current.target.position.set(...sensorPos);
      xrayLightRef.current.target.updateMatrixWorld();
    }
  }, [lightPos, lightRotX]);

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

          {/* РЕНТГЕН-СВЕТ с процедурным тубусом */}
          <group position={lightPos} rotation={[lightRotX, 0, 0]}>
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
            {/* Процедурный тубус вокруг света */}
            <ProceduralTubus lightAngle={xrayLightAngle} showAxes={showAxes} />
          </group>

          {/* Объекты сцены */}
          <Suspense fallback={<LoadingPlaceholder />}>
            {/* Верхние зубы - фиксированные */}
            <TeethUpperModel
              position={teethUpperPos}
              rotation={teethUpperRot}
              showAxes={showAxes}
              isSelected={false}
              onClick={() => {}}
            />
            {/* Нижние зубы - только ротация X с кастомным центром */}
            <TeethLowerModel
              position={teethLowerPos}
              rotationX={teethLowerRotX}
              pivot={teethLowerPivot}
              showAxes={showAxes}
              isSelected={selectedObject === 'teeth_lower'}
              onClick={() => setSelectedObject('teeth_lower')}
            />
            {/* Датчик - полное управление */}
            <XRaySensorModel
              position={sensorPos}
              rotation={sensorRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'sensor'}
              onClick={() => setSelectedObject('sensor')}
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
