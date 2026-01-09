import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';

export function AuthButton() {
  const [user, setUser] = useState(pb.authStore.model);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Подписываемся на изменения авторизации
    const unsubscribe = pb.authStore.onChange((_token, model) => {
      setUser(model);
    });

    return unsubscribe;
  }, []);

  const handleVKLogin = async () => {
    try {
      setLoading(true);

      // Используем правильный PocketBase OAuth2 flow
      await pb.collection('users').authWithOAuth2({
        provider: 'vk',
        // Правильный redirect URL для PocketBase
        urlCallback: (url) => {
          // PocketBase сформировал правильный OAuth URL с redirect_uri=.../api/oauth2-redirect
          // Открываем его в текущем окне
          window.location.href = url;
        },
      });
    } catch (error) {
      console.error('VK login error:', error);
      alert('Ошибка при входе через VK: ' + (error as Error).message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm text-gray-700">
            {user.name || user.username || user.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Выйти
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleVKLogin}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.15 14.31h-1.8c-.58 0-.76-.47-1.8-1.52-1.05-1.05-1.52-1.2-1.8-1.2-.37 0-.47.1-.47.58v1.4c0 .37-.12.58-1.05.58-1.55 0-3.27-.94-4.48-2.7-1.82-2.55-2.32-4.47-2.32-4.87 0-.28.1-.55.58-.55h1.8c.42 0 .58.2.76.65.82 2.4 2.2 4.5 2.78 4.5.2 0 .3-.1.3-.65v-2.52c-.07-1.12-.65-1.22-.65-1.62 0-.23.2-.47.52-.47h2.82c.35 0 .47.2.47.63v3.37c0 .35.15.47.25.47.2 0 .4-.12.82-.53 1.27-1.43 2.18-3.65 2.18-3.65.12-.25.32-.47.75-.47h1.8c.53 0 .65.28.53.65-.22.97-2.45 4.03-2.45 4.03-.17.28-.23.4 0 .72.17.23.75.73 1.13 1.18.7.82 1.25 1.5 1.4 1.97.15.47-.1.7-.58.7z"/>
      </svg>
      {loading ? 'Загрузка...' : 'Войти через VK'}
    </button>
  );
}
