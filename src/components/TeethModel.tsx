import { useGLTF } from '@react-three/drei';

interface TeethModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  modelPath?: string;
}

// Компонент для загрузки 3D модели зубов
export function TeethModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  modelPath = '/models/teeth.glb'
}: TeethModelProps) {
  // Загружаем GLTF модель
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

// Предзагрузка модели для улучшения производительности
useGLTF.preload('/models/teeth.glb');
