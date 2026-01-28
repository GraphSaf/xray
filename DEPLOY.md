# Финальная инструкция по деплою ДОЗ-3

## Что уже сделано и учтено:

✅ **UUID Fix** - работает через HTTP без HTTPS (используется `generateUUID()`)
✅ **PocketBase интеграция** - API для сохранения отчетов
✅ **Структура /xray/** - правильные пути для статических файлов
✅ **Nginx конфигурация** - проксирование API и админки
✅ **GitHub Actions** - автоматический деплой при push

## Быстрый деплой на новый сервер

### Требования:
- Ubuntu 20.04+ или Debian 10+
- 4GB RAM минимум
- Домен с A-записью на IP сервера
- Root доступ по SSH

### Шаг 1: Установка базовых компонентов (на сервере)

```bash
# Подключись к серверу
ssh root@YOUR_SERVER_IP

# Запусти автоматическую установку
curl -sSL https://raw.githubusercontent.com/GraphSaf/xray/claude/radiation-dose-reporting-app-RM8Cf/deploy/full-deploy.sh | bash
```

**Что установит:**
- PocketBase backend
- Nginx веб-сервер
- Сертификат SSL (Let's Encrypt)
- Создаст директории

### Шаг 2: Обновление домена в скрипте

Перед запуском отредактируй `deploy/full-deploy.sh`:
- Измени `DOMAIN="xray.zubrdental.ru"` на свой домен
- Измени `EMAIL="admin@zubrdental.ru"` на свой email

Или запусти вручную на сервере:

```bash
# Скачай скрипт
wget https://raw.githubusercontent.com/GraphSaf/xray/claude/radiation-dose-reporting-app-RM8Cf/deploy/full-deploy.sh

# Отредактируй домен
nano full-deploy.sh
# Измени DOMAIN и EMAIL

# Запусти
bash full-deploy.sh
```

### Шаг 3: Деплой frontend (на сервере)

```bash
cd /tmp
git clone --branch claude/radiation-dose-reporting-app-RM8Cf https://github.com/GraphSaf/xray.git
cd xray

# Установи Node.js 20 если нужно
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Собери проект
npm install
npm run build

# Создай правильную структуру
cd /var/www/doz3
mkdir -p xray
cp -r /tmp/xray/dist/* xray/

# Создай редирект в корне
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="refresh" content="0; url=/xray/" />
</head>
<body>
<p>Redirecting...</p>
</body>
</html>
EOF
```

### Шаг 4: Настройка PocketBase

1. Открой `https://YOUR_DOMAIN/_/`
2. Создай первый admin аккаунт
3. **Collections → New collection**:
   - Name: `doz3_reports`
   - Type: Base

4. **Добавь поля:**
   - `organizationName` - Text, required
   - `organizationAddress` - Text, required
   - `organizationOKPO` - Text, required
   - `responsibleName` - Text, required
   - `responsiblePosition` - Text, required
   - `responsiblePhone` - Text, required
   - `periodYear` - Number, required
   - `periodQuarter` - Number (optional)
   - `procedures` - JSON, required
   - `totalDose_personmGy` - Number, required
   - `status` - Select (values: draft, completed, archived), required

5. **API Rules** - оставь пустыми (публичный доступ)

6. **Create collection**

### Шаг 5: Проверка

```bash
# На сервере проверь сервисы
systemctl status pocketbase
systemctl status nginx

# Проверь DNS
nslookup YOUR_DOMAIN
```

Открой в браузере:
- **Приложение:** `https://YOUR_DOMAIN/xray/`
- **Admin UI:** `https://YOUR_DOMAIN/_/`
- **API:** `https://YOUR_DOMAIN/api/`

## Обновление приложения

После внесения изменений в код:

```bash
# На сервере
cd /tmp/xray
git pull
npm run build
cp -r dist/* /var/www/doz3/xray/
```

## Важные нюансы

### 1. UUID работает через HTTP
Приложение использует `generateUUID()` с fallback для работы без HTTPS.

### 2. Структура файлов
```
/var/www/doz3/
├── index.html          # Редирект на /xray/
└── xray/
    ├── index.html      # Основное приложение
    └── assets/         # JS, CSS файлы
```

### 3. Base path
Vite настроен с `base: '/xray/'` - все пути относительно `/xray/`

### 4. CORS
PocketBase автоматически разрешает запросы с того же домена.

### 5. SSL обязателен для продакшена
- VK ID требует HTTPS
- crypto.randomUUID требует HTTPS (но у нас fallback)
- Безопасность данных

## Troubleshooting

### Белая страница
```bash
# Проверь структуру
ls -la /var/www/doz3/xray/

# Проверь логи
tail -f /var/log/nginx/error.log
```

### 404 на assets
```bash
# Убедись что файлы в /xray/assets/
ls -la /var/www/doz3/xray/assets/
```

### crypto.randomUUID ошибка
Уже исправлено в коде - используется `generateUUID()` с fallback.

### PocketBase не подключается
Проверь `.env.production`:
```bash
VITE_POCKETBASE_URL=https://YOUR_DOMAIN
```

## GitHub Actions (опционально)

Для автоматического деплоя при push:

1. Создай SSH ключ на сервере
2. Добавь приватный ключ в GitHub Secrets как `SERVER_SSH_KEY`
3. При push в main - автоматический деплой

Подробнее: `deploy/GITHUB_ACTIONS_SETUP.md`

## Контакты

При проблемах проверь:
- https://github.com/GraphSaf/xray/issues
- Логи: `journalctl -u pocketbase -f`
- Nginx логи: `tail -f /var/log/nginx/error.log`
