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

// Компонент нижних зубов
function TeethLowerModel({
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

// Компонент датчика
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
    <group onClick={onClick}>
      <primitive
        object={clonedScene}
        position={position}
        rotation={rotation}
      />
      {showAxes && <AxesHelper size={0.3} position={position} />}
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

// Компонент тубуса
function XRayTubusModel({
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
  const { scene } = useGLTF(MODEL_URLS.xrayTubus);

  return (
    <group onClick={onClick}>
      <primitive
        object={scene.clone(true)}
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

type SelectedObject = 'teeth_upper' | 'teeth_lower' | 'sensor' | 'tubus' | 'light' | null;

// Основной компонент симулятора
export function DentalPositioningSimulator() {
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'dark'>('white');
  const [showAxes, setShowAxes] = useState(true);
  const [selectedObject, setSelectedObject] = useState<SelectedObject>(null);

  // Позиции объектов (редактируемые) - значения по умолчанию из настроек пользователя
  const [teethUpperPos, setTeethUpperPos] = useState<[number, number, number]>([0, 0.9, 0]);
  const [teethUpperRot, setTeethUpperRot] = useState<[number, number, number]>([-0.30, 0, 0]);

  const [teethLowerPos, setTeethLowerPos] = useState<[number, number, number]>([0, 0, 0]);
  const [teethLowerRot, setTeethLowerRot] = useState<[number, number, number]>([0, 0, 0]);

  const [sensorPos, setSensorPos] = useState<[number, number, number]>([0, 1.4, 0.1]);
  const [sensorRot, setSensorRot] = useState<[number, number, number]>([0, 0, 0]);

  const [tubusPos, setTubusPos] = useState<[number, number, number]>([0, 1, 1.3]);
  const [tubusRot, setTubusRot] = useState<[number, number, number]>([0, 0, 0]);

  // Настройки рентген-света (отдельно от тубуса)
  const [lightPos, setLightPos] = useState<[number, number, number]>([0, 1, 1.3]);
  const [lightRot, setLightRot] = useState<[number, number, number]>([0, 0, 0]);
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
  }, [sensorPos, lightPos]);

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

          {/* РЕНТГЕН-СВЕТ: Узконаправленный источник света */}
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
            {showAxes && <AxesHelper size={0.3} position={[0, 0, 0]} />}
          </group>

          {/* Объекты сцены */}
          <Suspense fallback={<LoadingPlaceholder />}>
            <TeethUpperModel
              position={teethUpperPos}
              rotation={teethUpperRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'teeth_upper'}
              onClick={() => setSelectedObject('teeth_upper')}
            />
            <TeethLowerModel
              position={teethLowerPos}
              rotation={teethLowerRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'teeth_lower'}
              onClick={() => setSelectedObject('teeth_lower')}
            />
            <XRaySensorModel
              position={sensorPos}
              rotation={sensorRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'sensor'}
              onClick={() => setSelectedObject('sensor')}
            />
            <XRayTubusModel
              position={tubusPos}
              rotation={tubusRot}
              showAxes={showAxes}
              isSelected={selectedObject === 'tubus'}
              onClick={() => setSelectedObject('tubus')}
            />
          </Suspense>
        </Canvas>

        {/* Управление камерой и фоном */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={resetCamera}
            className="px-4 py-2 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
          >
            ↑ Сброс
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setBackgroundColor('white')}
              className={`px-3 py-2 rounded-xl ${
                backgroundColor === 'white'
                  ? 'bg-white text-black border-2 border-black'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              ⚪
            </button>
            <button
              onClick={() => setBackgroundColor('dark')}
              className={`px-3 py-2 rounded-xl ${
                backgroundColor === 'dark'
                  ? 'bg-gray-700 text-white border-2 border-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              ⚫
            </button>
          </div>
          <button
            onClick={() => setShowAxes(!showAxes)}
            className={`px-3 py-2 rounded-xl ${
              showAxes ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            📐
          </button>
        </div>
      </div>

      {/* Панель настроек справа */}
      <div className="w-full lg:w-80 bg-white rounded-2xl border-2 border-gray-200 p-4 overflow-y-auto">
        <h3 className="font-bold text-xl mb-4">Настройки объектов</h3>

        {/* Выбор объекта */}
        <div className="mb-4">
          <label className="text-sm font-semibold mb-2 block">Выберите объект:</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              onClick={() => setSelectedObject('teeth_upper')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold ${
                selectedObject === 'teeth_upper'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🦷 Верхние
            </button>
            <button
              onClick={() => setSelectedObject('teeth_lower')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold ${
                selectedObject === 'teeth_lower'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🦷 Нижние
            </button>
            <button
              onClick={() => setSelectedObject('sensor')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold ${
                selectedObject === 'sensor'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📡 Датчик
            </button>
            <button
              onClick={() => setSelectedObject('tubus')}
              className={`py-2 px-3 rounded-xl text-sm font-semibold ${
                selectedObject === 'tubus'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📸 Тубус
            </button>
          </div>
          <button
            onClick={() => setSelectedObject('light')}
            className={`w-full py-2 px-3 rounded-xl text-sm font-semibold ${
              selectedObject === 'light'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💡 Рентген-свет
          </button>
        </div>

        {/* Настройки выбранного объекта */}
        {selectedObject === 'teeth_upper' && (
          <div>
            <h4 className="font-bold mb-3">🦷 Верхние зубы</h4>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={teethUpperPos[i]}
                      onChange={(e) => {
                        const newPos = [...teethUpperPos] as [number, number, number];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        setTeethUpperPos(newPos);
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
                      value={teethUpperRot[i].toFixed(2)}
                      onChange={(e) => {
                        const newRot = [...teethUpperRot] as [number, number, number];
                        newRot[i] = parseFloat(e.target.value) || 0;
                        setTeethUpperRot(newRot);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedObject === 'teeth_lower' && (
          <div>
            <h4 className="font-bold mb-3">🦷 Нижние зубы</h4>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={teethLowerPos[i]}
                      onChange={(e) => {
                        const newPos = [...teethLowerPos] as [number, number, number];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        setTeethLowerPos(newPos);
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
                      value={teethLowerRot[i].toFixed(2)}
                      onChange={(e) => {
                        const newRot = [...teethLowerRot] as [number, number, number];
                        newRot[i] = parseFloat(e.target.value) || 0;
                        setTeethLowerRot(newRot);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedObject === 'sensor' && (
          <div>
            <h4 className="font-bold mb-3">📡 Датчик</h4>

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
          </div>
        )}

        {selectedObject === 'tubus' && (
          <div>
            <h4 className="font-bold mb-3">📸 Тубус</h4>

            <div className="mb-3">
              <label className="text-xs font-semibold mb-1 block">Position</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={tubusPos[i]}
                      onChange={(e) => {
                        const newPos = [...tubusPos] as [number, number, number];
                        newPos[i] = parseFloat(e.target.value) || 0;
                        setTubusPos(newPos);
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
                      value={tubusRot[i].toFixed(2)}
                      onChange={(e) => {
                        const newRot = [...tubusRot] as [number, number, number];
                        newRot[i] = parseFloat(e.target.value) || 0;
                        setTubusRot(newRot);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedObject === 'light' && (
          <div>
            <h4 className="font-bold mb-3">💡 Рентген-свет</h4>

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
              <label className="text-xs font-semibold mb-1 block">Rotation (радианы)</label>
              <div className="grid grid-cols-3 gap-2">
                {['X', 'Y', 'Z'].map((axis, i) => (
                  <label key={axis} className="text-xs">
                    {axis}:
                    <input
                      type="number"
                      step="0.1"
                      value={lightRot[i].toFixed(2)}
                      onChange={(e) => {
                        const newRot = [...lightRot] as [number, number, number];
                        newRot[i] = parseFloat(e.target.value) || 0;
                        setLightRot(newRot);
                      }}
                      className="w-full px-2 py-1 border rounded mt-1"
                    />
                  </label>
                ))}
              </div>
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
              Свет автоматически направлен на датчик
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
