# Настройка автоматического деплоя через GitHub Actions

## Что будет происходить автоматически:

При каждом `git push`:
1. ✅ GitHub Actions соберет проект (`npm run build`)
2. ✅ Подключится к серверу по SSH
3. ✅ Установит PocketBase (если еще не установлен)
4. ✅ Загрузит frontend файлы
5. ✅ Перезапустит сервисы
6. ✅ Сохранит логи в Artifacts

## Настройка (один раз):

### Шаг 1: Создать SSH ключ на сервере

Подключись к серверу и выполни:

```bash
ssh root@85.198.86.169
cd ~/.ssh
ssh-keygen -t ed25519 -C "github-actions" -f github_actions_key -N ""
```

Это создаст два файла:
- `github_actions_key` - приватный ключ
- `github_actions_key.pub` - публичный ключ

### Шаг 2: Добавить публичный ключ в authorized_keys

```bash
cat github_actions_key.pub >> authorized_keys
chmod 600 authorized_keys
```

### Шаг 3: Скопировать приватный ключ

```bash
cat github_actions_key
```

Скопируй весь вывод (включая `-----BEGIN` и `-----END`)

### Шаг 4: Добавить секрет в GitHub

1. Открой https://github.com/GraphSaf/xray/settings/secrets/actions
2. Нажми **New repository secret**
3. Name: `SERVER_SSH_KEY`
4. Value: вставь скопированный приватный ключ
5. Нажми **Add secret**

## Готово! 🎉

Теперь при каждом push в `main` или `claude/radiation-dose-reporting-app-RM8Cf`:
- Автоматически запустится деплой
- Логи будут в: https://github.com/GraphSaf/xray/actions

## Альтернатива: использовать пароль (менее безопасно)

Если не хочешь возиться с SSH ключами, можно использовать пароль:

1. GitHub Settings → Secrets
2. Добавь секрет `SERVER_PASSWORD` = `f3vgEuWw3!cx`
3. Измени workflow файл для использования sshpass (скажи мне, если хочешь этот вариант)

## Просмотр логов деплоя:

1. https://github.com/GraphSaf/xray/actions
2. Выбери последний workflow run
3. Открой job "deploy"
4. Посмотри логи каждого шага

## Отладка:

Если деплой упал:
1. Посмотри логи в GitHub Actions
2. Скачай artifacts с логами (deploy.log)
3. Проверь статус сервисов на сервере:
   ```bash
   systemctl status pocketbase
   systemctl status nginx
   ```

## Ручной запуск:

Можешь запустить деплой вручную без push:
1. https://github.com/GraphSaf/xray/actions
2. Выбери "Auto Deploy to Server"
3. Нажми "Run workflow"
