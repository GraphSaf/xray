import { Unity, useUnityContext } from 'react-unity-webgl';

export function DentalSimulator() {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: '/unity/Build/unity.loader.js',
    dataUrl: '/unity/Build/unity.data',
    frameworkUrl: '/unity/Build/unity.framework.js',
    codeUrl: '/unity/Build/unity.wasm',
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
      {!isLoaded && (
        <div className="text-white text-center p-8">
          <div className="mb-4">
            <svg className="animate-spin h-12 w-12 mx-auto text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-lg font-semibold">Загрузка 3D симулятора...</p>
          <p className="text-sm text-gray-400 mt-2">{Math.round(loadingProgression * 100)}%</p>
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{
          width: '100%',
          height: '100%',
          display: isLoaded ? 'block' : 'none',
        }}
      />
    </div>
  );
}
