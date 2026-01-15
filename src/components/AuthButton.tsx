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

    // Проверяем авторизацию при загрузке
    if (pb.authStore.isValid && pb.authStore.model) {
      setUser(pb.authStore.model);
    }

    // Обработка OAuth callback
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (code && state) {
        try {
          const providerData = localStorage.getItem('oauth_provider');
          if (!providerData) {
            console.error('No provider data found');
            return;
          }

          const provider = JSON.parse(providerData);

          // Обмениваем code на токен через PocketBase
          const redirectUrl = `${window.location.origin}${window.location.pathname}`;

          const authData = await pb.collection('users').authWithOAuth2Code(
            provider.name,
            code,
            provider.codeVerifier,
            redirectUrl
          );

          console.log('Auth successful:', authData);

          // Очищаем localStorage и URL
          localStorage.removeItem('oauth_provider');
          window.history.replaceState({}, '', window.location.pathname);

          setUser(pb.authStore.model);
        } catch (error) {
          console.error('OAuth callback error:', error);
          alert('Ошибка авторизации: ' + (error as Error).message);
        }
      }
    };

    handleOAuthCallback();

    return unsubscribe;
  }, []);

  const handleVKLogin = async () => {
    try {
      setLoading(true);

      // Получаем OAuth провайдеры напрямую через API
      const response = await fetch(`${pb.baseUrl}/api/collections/users/auth-methods`);
      const data = await response.json();

      console.log('Auth methods:', data);

      const vkProvider = data.authProviders?.find((p: any) => p.name === 'vk');

      if (!vkProvider) {
        alert('VK провайдер не настроен в PocketBase');
        setLoading(false);
        return;
      }

      // Сохраняем данные провайдера для обработки callback
      localStorage.setItem('oauth_provider', JSON.stringify(vkProvider));

      // Формируем правильный redirect_uri для PocketBase
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;

      // PocketBase authUrl уже содержит все параметры кроме redirect_uri
      const authUrl = `${vkProvider.authUrl}${encodeURIComponent(redirectUrl)}`;

      console.log('Redirecting to:', authUrl);

      // Редирект на VK OAuth
      window.location.href = authUrl;
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
        <div className="hidden sm:flex items-center gap-2">
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-gray-200"
            />
          )}
          <span className="text-base font-semibold text-black">
            {user.name || user.username || user.email}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-100 text-black font-semibold rounded-2xl hover:bg-gray-200 transition-colors text-base"
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
      className="px-6 py-3 bg-black text-white font-semibold rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50 text-base sm:text-lg"
    >
      {loading ? 'Загрузка...' : 'Войти'}
    </button>
  );
}
